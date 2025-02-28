<script lang="ts" setup>
import { usersService } from "@/services/usersServices";
import { ref, inject, computed, watch, onMounted } from "vue";
import * as XLSX from "xlsx";

interface CreateUserRequest {
  id?: number;
  name: string;
  fullname: string;
  email: string;
  date_of_birth: Date;
  ms: string; // MSSV for students or MSCB for others
  role: "student" | "professor" | "admin";
}

// State
const users = ref<CreateUserRequest[]>([
  {
    name: "",
    fullname: "",
    email: "",
    date_of_birth: new Date(),
    ms: "",
    role: "student",
  },
]);

const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

// Excel import related state
const importDialog = ref(false);
const selectedRole = ref<"student" | "professor" | "admin">("student");
const excelFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const importLoading = ref(false);
const importErrors = ref<string[]>([]);
const previewData = ref<CreateUserRequest[]>([]);
const showPreview = ref(false);
const isDragging = ref(false);

// Add partial import support
const hasPartialData = computed(
  () => importErrors.value.length > 0 && previewData.value.length > 0
);

// Template download settings
const msLabel = computed(() => (selectedRole.value === "student" ? "MSSV" : "MSCB"));
const msDescription = computed(() =>
  selectedRole.value === "student" ? "Student ID Number" : "Employee ID Number"
);

// Methods
const addNewUser = () => {
  users.value.push({
    name: "",
    fullname: "",
    email: "",
    date_of_birth: new Date(),
    ms: "",
    role: "student",
  });
};

const showSnackbar = (text: string, color: string = "success") => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const handleConfirm = async () => {
  try {
    loading.value = true;

    // Validate data
    const isValid = users.value.every(
      (user) => user.name && user.fullname && user.email && user.ms && user.role
    );

    if (!isValid) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    const formattedUsers = users.value.map((user) => {
      const dateOfBirth = new Date(user.date_of_birth);

      dateOfBirth.setUTCHours(0, 0, 0, 0);
      if (user.name === "") {
        user.name = user.email.split("@")[0];
      }

      return {
        ...user,
        date_of_birth: dateOfBirth.toISOString(),
      };
    });

    const response = await usersService.createUser(formattedUsers, {
      showError,
      showSuccess,
    });

    if (response && response.isSuccess) {
      // Reset form after successful submission
      users.value = [
        {
          name: "",
          fullname: "",
          email: "",
          date_of_birth: new Date(),
          ms: "",
          role: "student",
        },
      ];
      showSnackbar(`${formattedUsers.length} user(s) created successfully`);
    }
  } catch (error) {
    console.error("Error creating users:", error);
    showSnackbar("Failed to create users", "error");
  } finally {
    loading.value = false;
  }
};

const removeUser = (index: number) => {
  users.value.splice(index, 1);
  showSnackbar("User removed");
};

// Excel import functions
const openImportDialog = () => {
  console.log("Opening import dialog");
  importDialog.value = true;
  importErrors.value = [];
  excelFile.value = null;
  previewData.value = [];
  showPreview.value = false;

  // Reset to step 1
  setTimeout(() => {
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }, 100);
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    excelFile.value = input.files[0];
    processExcelFile();
  }
};

const validateEmail = (email: string): boolean => {
  // More comprehensive email validation
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const validateDate = (dateStr: string): boolean => {
  // Check if date is valid
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

const triggerFileInput = () => {
  console.log("Triggering file input");
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const processExcelFile = async () => {
  console.log("Processing file:", excelFile.value?.name);
  importLoading.value = true;
  importErrors.value = [];
  previewData.value = [];

  try {
    if (!excelFile.value) {
      importErrors.value.push("No file selected");
      importLoading.value = false;
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        if (jsonData.length < 2) {
          importErrors.value.push("File contains no data or is missing headers");
          importLoading.value = false;
          return;
        }

        // Get headers (assuming first row contains headers)
        const headers = jsonData[0];

        // Check required columns
        const requiredColumns = ["Fullname", "Email", "Date Of Birth", msLabel.value];
        const missingColumns = requiredColumns.filter((col) => !headers.includes(col));

        if (missingColumns.length > 0) {
          importErrors.value.push(
            `Missing required columns: ${missingColumns.join(", ")}`
          );
          importLoading.value = false;
          return;
        }

        // Process data rows
        const processedUsers: CreateUserRequest[] = [];
        const errors: string[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row.length === 0 || row.every((cell: any) => cell === "")) continue; // Skip empty rows

          const fullnameIndex = headers.indexOf("Fullname");
          const emailIndex = headers.indexOf("Email");
          const dobIndex = headers.indexOf("Date Of Birth");
          const msIndex = headers.indexOf(msLabel.value);

          // Validate row data completeness
          if (!row[fullnameIndex]) {
            errors.push(`Row ${i}: Missing Fullname`);
            continue;
          }

          // Validate email
          if (!row[emailIndex]) {
            errors.push(`Row ${i}: Missing Email`);
            continue;
          }

          if (!validateEmail(row[emailIndex])) {
            errors.push(
              `Row ${i}: Invalid Email format "${
                row[emailIndex] || ""
              }" - must be a valid email address`
            );
            continue;
          }

          // Validate date of birth
          if (!row[dobIndex]) {
            errors.push(`Row ${i}: Missing Date Of Birth`);
            continue;
          }

          if (!validateDate(row[dobIndex])) {
            errors.push(
              `Row ${i}: Invalid Date Of Birth "${
                row[dobIndex] || ""
              }" - use YYYY-MM-DD format`
            );
            continue;
          }

          // Validate MS number
          if (!row[msIndex]) {
            errors.push(`Row ${i}: Missing ${msLabel.value}`);
            continue;
          }

          // Create user object
          const user: CreateUserRequest = {
            name: row[emailIndex].split("@")[0], // Default username from email
            fullname: row[fullnameIndex],
            email: row[emailIndex],
            date_of_birth: new Date(row[dobIndex]),
            ms: row[msIndex].toString(),
            role: selectedRole.value,
          };

          processedUsers.push(user);
        }

        if (errors.length > 0) {
          importErrors.value = errors;
          if (processedUsers.length > 0) {
            showPreview.value = true;
            previewData.value = processedUsers;
          }
        } else if (processedUsers.length === 0) {
          importErrors.value.push("No valid users found in the file");
        } else {
          previewData.value = processedUsers;
          showPreview.value = true;
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        importErrors.value.push(
          "Failed to process Excel file. Please make sure the file is valid."
        );
      } finally {
        importLoading.value = false;
      }
    };

    reader.onerror = () => {
      importErrors.value.push("Error reading file");
      importLoading.value = false;
    };

    reader.readAsArrayBuffer(excelFile.value);
  } catch (error) {
    console.error("Error processing Excel file:", error);
    importErrors.value.push("An unexpected error occurred");
    importLoading.value = false;
  }
};

const confirmImport = () => {
  if (previewData.value.length > 0) {
    users.value = [...previewData.value];
    showSnackbar(`Successfully imported ${previewData.value.length} users`);
    importDialog.value = false;
  }
};

const downloadTemplate = () => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Define headers based on role
  const headers = ["Fullname", "Email", "Date Of Birth", msLabel.value];

  // Sample data with examples appropriate for the selected role
  const sampleData = [
    [
      "John Doe",
      "john.doe@example.com",
      "2000-01-01",
      selectedRole.value === "student" ? "12345678" : "CB12345",
    ],
    [
      "Jane Smith",
      "jane.smith@example.com",
      "1999-05-15",
      selectedRole.value === "student" ? "87654321" : "CB54321",
    ],
  ];

  // Create worksheet with headers and sample data
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Users");

  // Generate file and trigger download
  XLSX.writeFile(wb, `${selectedRole.value}_users_template.xlsx`);
};

// Drag and drop handling
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    // Check if the file is an Excel file
    const file = event.dataTransfer.files[0];
    if (
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      excelFile.value = file;
      processExcelFile();
    } else {
      importErrors.value = ["Please select an Excel file (.xlsx or .xls)"];
    }
  }
};

// Clear file selection
const clearFileSelection = () => {
  excelFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  importErrors.value = [];
  previewData.value = [];
  showPreview.value = false;
};

// Reset the import process
const resetImport = () => {
  showPreview.value = false;
  previewData.value = [];
  importErrors.value = [];
  clearFileSelection();
};

// Watch for role changes to clear data
watch(selectedRole, () => {
  clearFileSelection();
});

// Ensure dialog is properly reset when closed
watch(importDialog, (newVal) => {
  if (!newVal) {
    // Reset everything when dialog is closed
    setTimeout(() => {
      resetImport();
    }, 300);
  }
});

// Run this on component mount to ensure refs are properly initialized
onMounted(() => {
  console.log("Component mounted");
});
</script>

<template>
  <v-container class="max-w-7xl mx-auto py-8">
    <v-card class="mb-8 elevation-2">
      <v-card-title class="d-flex align-center justify-space-between py-4 px-6 flex-wrap">
        <h1 class="text-h4 font-weight-bold">User Management</h1>
        <div class="d-flex align-center gap-4 flex-wrap">
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-file-excel"
            size="large"
            @click="openImportDialog"
            class="my-2"
          >
            Import from Excel
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(user, index) in users"
            :key="index"
            :title="`User ${index + 1} - ${user.fullname || 'New User'}`"
            class="mb-4"
          >
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.name"
                    label="Username"
                    variant="outlined"
                    hint="Leave blank to use email username"
                    persistent-hint
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.fullname"
                    label="Full Name*"
                    variant="outlined"
                    :rules="[(v) => !!v || 'Full name is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.email"
                    label="Email*"
                    variant="outlined"
                    type="email"
                    :rules="[
                      (v) => !!v || 'Email is required',
                      (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                    ]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.ms"
                    :label="user.role === 'student' ? 'MSSV Number*' : 'MSCB Number*'"
                    variant="outlined"
                    :hint="
                      user.role === 'student' ? 'Student ID Number' : 'Employee ID Number'
                    "
                    persistent-hint
                    :rules="[(v) => !!v || 'MS number is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card>
                    <v-card-title>Date of Birth*</v-card-title>
                    <v-date-picker
                      v-model="user.date_of_birth"
                      variant="outlined"
                    ></v-date-picker>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="user.role"
                    label="Role*"
                    variant="outlined"
                    :items="['student', 'professor', 'admin']"
                    :rules="[(v) => !!v || 'Role is required']"
                  ></v-select>
                </v-col>

                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="error"
                    variant="outlined"
                    class="mr-2"
                    @click="removeUser(index)"
                    :disabled="users.length === 1"
                  >
                    Remove User
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <div class="d-flex justify-end gap-4 flex-wrap">
      <v-btn
        @click="addNewUser"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-plus"
      >
        Add User
      </v-btn>
      <v-btn
        @click="handleConfirm"
        color="primary"
        :loading="loading"
        :disabled="
          users.length === 0 || users.every((u) => !u.fullname || !u.email || !u.ms)
        "
      >
        Submit All Users
      </v-btn>
    </div>

    <!-- Excel Import Dialog -->
    <v-dialog v-model="importDialog" max-width="800px" persistent scrollable>
      <v-card>
        <v-card-title
          class="d-flex align-center justify-space-between py-4 px-6 bg-primary text-white"
        >
          <h2 class="text-h5">Import Users from Excel</h2>
          <v-btn icon @click="importDialog = false" variant="text" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-6">
          <!-- Role selection section -->
          <div class="mb-6 border rounded pa-4 bg-grey-lighten-5">
            <v-card-title class="pb-2 px-0">
              <v-icon color="primary" size="small" class="mr-2">mdi-account-group</v-icon>
              Step 1: Select User Role
            </v-card-title>

            <v-card-text class="px-0">
              <p class="text-subtitle-2 mb-3">
                Choose the role type for the users you want to import:
              </p>

              <v-select
                v-model="selectedRole"
                :items="[
                  { title: 'Student', value: 'student' },
                  { title: 'Professor', value: 'professor' },
                  { title: 'Admin', value: 'admin' },
                ]"
                item-title="title"
                item-value="value"
                label="Select Role"
                variant="outlined"
                class="mb-2 max-w-xs"
              ></v-select>

              <v-alert
                color="info"
                variant="tonal"
                density="compact"
                class="mt-2"
                icon="mdi-information"
              >
                <strong
                  >{{
                    selectedRole === "student"
                      ? "Student"
                      : selectedRole === "professor"
                      ? "Professor"
                      : "Admin"
                  }}s</strong
                >
                require <strong>{{ msLabel }}</strong> ({{ msDescription }}) in the Excel
                file.
              </v-alert>
            </v-card-text>
          </div>

          <!-- Excel Template Section -->
          <div class="mb-6 border rounded pa-4 bg-grey-lighten-5">
            <v-card-title class="pb-2 px-0">
              <v-icon color="primary" size="small" class="mr-2">mdi-file-excel</v-icon>
              Step 2: Download Excel Template
            </v-card-title>

            <v-card-text class="px-0">
              <p class="text-subtitle-2 mb-3">
                Use our template file to ensure your data is formatted correctly:
              </p>

              <v-list density="compact" class="bg-grey-lighten-5 mb-4 pa-0">
                <v-list-item
                  prepend-icon="mdi-account"
                  title="Fullname"
                  subtitle="User's full name"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-email"
                  title="Email"
                  subtitle="Valid email address"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-calendar"
                  title="Date Of Birth"
                  subtitle="YYYY-MM-DD format"
                ></v-list-item>
                <v-list-item
                  :prepend-icon="
                    selectedRole === 'student' ? 'mdi-school' : 'mdi-badge-account'
                  "
                  :title="msLabel"
                  :subtitle="msDescription"
                ></v-list-item>
              </v-list>

              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-file-download"
                @click="downloadTemplate"
                class="mt-2"
              >
                Download Template
              </v-btn>

              <p class="text-caption text-grey mt-2">
                The template includes sample data to help you understand the required
                format.
              </p>
            </v-card-text>
          </div>

          <!-- File Upload Section -->
          <div class="mb-6 border rounded pa-4">
            <v-card-title class="pb-2 px-0">
              <v-icon color="primary" size="small" class="mr-2">mdi-upload</v-icon>
              Step 3: Upload Excel File
            </v-card-title>

            <v-card-text class="px-0">
              <!-- Drag and drop area + file input -->
              <div
                class="upload-area pa-6 mb-4 border-dashed rounded d-flex flex-column align-center justify-center"
                :class="{ dragging: isDragging, 'has-file': !!excelFile }"
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
                @drop="handleDrop"
              >
                <v-icon
                  :color="excelFile ? 'success' : 'primary'"
                  size="large"
                  class="mb-3"
                >
                  {{ excelFile ? "mdi-file-check" : "mdi-cloud-upload" }}
                </v-icon>

                <h3 class="text-h6 mb-2">
                  {{ excelFile ? "File Selected" : "Drop Excel File Here" }}
                </h3>

                <p v-if="!excelFile" class="text-body-2 text-center mb-3">
                  Drag and drop your Excel file or click to browse
                </p>

                <p v-else class="text-body-2 text-center mb-3 text-success">
                  {{ excelFile.name }} ({{ (excelFile.size / 1024).toFixed(1) }} KB)
                </p>

                <div v-if="!excelFile" class="d-flex justify-center">
                  <v-btn
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-file-excel"
                    @click="triggerFileInput"
                  >
                    Upload Excel
                  </v-btn>

                  <input
                    ref="fileInput"
                    type="file"
                    accept=".xlsx, .xls"
                    style="display: none"
                    @change="handleFileChange"
                  />
                </div>

                <div v-else class="d-flex justify-center gap-2">
                  <v-btn
                    color="error"
                    variant="outlined"
                    size="small"
                    @click="clearFileSelection"
                  >
                    Remove File
                  </v-btn>

                  <v-btn
                    color="primary"
                    :loading="importLoading"
                    size="small"
                    @click="processExcelFile"
                  >
                    Process File
                  </v-btn>
                </div>

                <input
                  type="file"
                  ref="fileInput"
                  accept=".xlsx, .xls"
                  style="display: none"
                  @change="handleFileChange"
                />
              </div>

              <!-- Loading indicator -->
              <v-progress-linear
                v-if="importLoading"
                indeterminate
                color="primary"
                class="mb-4"
              ></v-progress-linear>

              <!-- Error display -->
              <v-alert
                v-if="importErrors.length > 0"
                type="error"
                class="mt-4"
                title="Import Errors"
                variant="tonal"
                density="compact"
              >
                <div class="max-h-64 overflow-y-auto pa-2">
                  <ul>
                    <li v-for="(error, index) in importErrors" :key="index" class="mb-1">
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </v-alert>

              <!-- Preview data actions -->
              <div class="d-flex justify-end mt-4" v-if="hasPartialData">
                <v-btn color="info" @click="showPreview = true">
                  Continue with Valid Data ({{ previewData.length }} users)
                </v-btn>
              </div>
            </v-card-text>
          </div>

          <!-- Data Preview Section (Step 4) -->
          <div v-if="showPreview" class="border rounded pa-4">
            <v-card-title class="pb-2 px-0">
              <v-icon color="success" size="small" class="mr-2">mdi-eye</v-icon>
              Step 4: Review and Import Data
            </v-card-title>

            <v-card-text class="px-0">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h6">Preview ({{ previewData.length }} users)</h3>
                <v-chip color="primary" variant="tonal">
                  Role: {{ selectedRole }}
                </v-chip>
              </div>

              <v-table density="compact" class="mb-4 elevation-1 border">
                <thead>
                  <tr>
                    <th>Fullname</th>
                    <th>Email</th>
                    <th>Date of Birth</th>
                    <th>{{ msLabel }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, i) in previewData" :key="i">
                    <td>{{ user.fullname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ new Date(user.date_of_birth).toLocaleDateString() }}</td>
                    <td>{{ user.ms }}</td>
                  </tr>
                </tbody>
              </v-table>

              <v-alert
                v-if="importErrors.length > 0"
                type="warning"
                class="mt-4"
                title="Warning"
                variant="tonal"
              >
                <p>
                  Some rows had errors and will be skipped. Only
                  {{ previewData.length }} valid users will be imported.
                </p>
                <v-btn
                  size="small"
                  variant="text"
                  density="compact"
                  prepend-icon="mdi-alert-circle"
                  color="warning"
                  class="mt-2"
                  @click="showPreview = false"
                >
                  View Errors
                </v-btn>
              </v-alert>

              <div class="d-flex justify-end mt-4 gap-2">
                <v-btn color="secondary" variant="outlined" @click="resetImport">
                  Start Over
                </v-btn>
                <v-btn
                  color="primary"
                  @click="confirmImport"
                  :disabled="previewData.length === 0"
                  prepend-icon="mdi-account-multiple-plus"
                >
                  Import {{ previewData.length }} Users
                </v-btn>
              </div>
            </v-card-text>
          </div>

          <!-- Debug button for development -->
          <!-- <v-btn @click="logButtonState" color="grey" class="mt-4" variant="text">Debug</v-btn> -->
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.v-expansion-panel {
  margin-bottom: 1rem !important;
}

.upload-area {
  border: 2px dashed #ccc;
  height: 200px;
  transition: all 0.3s ease;
}

.upload-area.dragging {
  border-color: #1867c0;
  background-color: rgba(25, 118, 210, 0.05);
}

.upload-area.has-file {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.border-dashed {
  border-style: dashed;
  border-width: 2px;
  border-color: #ccc;
}

.import-stepper :deep(.v-stepper-header) {
  box-shadow: none;
}
</style>
