<script lang="ts" setup>
import { usersService } from "@/services/usersServices";
import { ref, inject, watch, onMounted } from "vue";
import * as XLSX from "xlsx";

interface CreateUserRequest {
  fullname: string;
  email: string;
  ms: string;
  role: "student" | "professor" | "admin";
}

// State for single user form
const singleUser = ref<CreateUserRequest>({
  fullname: "",
  email: "",
  ms: "",
  role: "student",
});

const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

// State for multiple users import
const selectedRole = ref<"student" | "professor" | "admin">("student");
const excelFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const importLoading = ref(false);
const importErrors = ref<string[]>([]);
const previewData = ref<CreateUserRequest[]>([]);
const showPreview = ref(false);
const isDragging = ref(false);

// Computed properties
const msLabel = computed(() => (selectedRole.value === "student" ? "MSSV" : "MSCB"));
const msDescription = computed(() =>
  selectedRole.value === "student" ? "Student ID Number" : "Employee ID Number"
);

// Injections
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const triggerFileInput = () => {
  console.log("Triggering file input");
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    excelFile.value = input.files[0];
    processExcelFile();
  }
};
// Single user methods
const resetSingleUser = () => {
  singleUser.value = {
    fullname: "",
    email: "",
    ms: "",
    role: "student",
  };
};

const submitSingleUser = async () => {
  try {
    loading.value = true;
    if (!singleUser.value.fullname || !singleUser.value.email || !singleUser.value.ms) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    const userToSubmit = {
      ...singleUser.value,
      name: singleUser.value.email.split("@")[0],
      date_of_birth: new Date("1997-01-01").toISOString(),
    };

    const response = await usersService.createUser([userToSubmit], {
      showError,
      showSuccess,
    });

    if (response && response.isSuccess) {
      resetSingleUser();
      showSnackbar("User created successfully");
    }
  } catch (error) {
    showSnackbar("Failed to create user", "error");
  } finally {
    loading.value = false;
  }
};

// Multiple users methods
const showSnackbar = (text: string, color: string = "success") => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const validateEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const processExcelFile = async () => {
  importLoading.value = true;
  importErrors.value = [];
  previewData.value = [];

  if (!excelFile.value) {
    importErrors.value.push("No file selected");
    importLoading.value = false;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

    if (jsonData.length < 2) {
      importErrors.value.push("File contains no data or is missing headers");
      importLoading.value = false;
      return;
    }

    const headers = jsonData[0];
    const requiredColumns = ["Fullname", "Email", msLabel.value];
    const missingColumns = requiredColumns.filter((col) => !headers.includes(col));

    if (missingColumns.length > 0) {
      importErrors.value.push(`Missing required columns: ${missingColumns.join(", ")}`);
      importLoading.value = false;
      return;
    }

    const processedUsers: CreateUserRequest[] = [];
    const errors: string[] = [];

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row.length === 0 || row.every((cell: any) => cell === "")) continue;

      const fullnameIndex = headers.indexOf("Fullname");
      const emailIndex = headers.indexOf("Email");
      const msIndex = headers.indexOf(msLabel.value);

      if (!row[fullnameIndex]) errors.push(`Row ${i}: Missing Fullname`);
      if (!row[emailIndex]) errors.push(`Row ${i}: Missing Email`);
      else if (!validateEmail(row[emailIndex]))
        errors.push(`Row ${i}: Invalid Email format "${row[emailIndex]}"`);
      if (!row[msIndex]) errors.push(`Row ${i}: Missing ${msLabel.value}`);

      if (
        row[fullnameIndex] &&
        row[emailIndex] &&
        row[msIndex] &&
        validateEmail(row[emailIndex])
      ) {
        processedUsers.push({
          fullname: row[fullnameIndex],
          email: row[emailIndex],
          ms: row[msIndex].toString(),
          role: selectedRole.value,
        });
      }
    }

    importErrors.value = errors;
    previewData.value = processedUsers;
    showPreview.value = processedUsers.length > 0;
    importLoading.value = false;
  };

  reader.readAsArrayBuffer(excelFile.value);
};

const downloadTemplate = () => {
  const wb = XLSX.utils.book_new();
  const headers = ["Fullname", "Email", msLabel.value];
  const sampleData = [
    [
      "John Doe",
      "john.doe@example.com",
      selectedRole.value === "student" ? "12345678" : "CB12345",
    ],
    [
      "Jane Smith",
      "jane.smith@example.com",
      selectedRole.value === "student" ? "87654321" : "CB54321",
    ],
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  XLSX.writeFile(wb, `${selectedRole.value}_users_template.xlsx`);
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    excelFile.value = event.dataTransfer.files[0];
    processExcelFile();
  }
};
</script>
<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-8">
          <h1 class="text-h4 font-weight-bold gradient-text">User Management</h1>
          <v-spacer></v-spacer>
          <v-chip color="primary" variant="outlined" class="px-4">
            <v-icon start>mdi-account-group</v-icon>
            <span class="text-body-1">Admin Portal</span>
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <v-row class="gutter-xl">
      <!-- Left Section: Single User Creation -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-xl border-card">
          <div class="card-header pa-6">
            <v-icon color="primary" size="x-large" class="mb-3">mdi-account-plus</v-icon>
            <h2 class="text-h5 font-weight-bold">Create Single User</h2>
            <p class="text-subtitle-2 text-medium-emphasis mb-0">
              Add a new user with custom details
            </p>
          </div>

          <v-divider></v-divider>

          <v-card-text class="pa-6 flex flex-col justify-space-between">
            <v-form @submit.prevent="submitSingleUser">
              <v-select
                v-model="singleUser.role"
                :items="[
                  { title: 'Student', value: 'student' },
                  { title: 'Professor', value: 'professor' },
                  { title: 'Administrator', value: 'admin' },
                ]"
                item-title="title"
                item-value="value"
                label="Role*"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-shield-account"
                :rules="[(v) => !!v || 'Role is required']"
                hide-details="auto"
              ></v-select>

              <v-text-field
                v-model="singleUser.ms"
                :label="singleUser.role === 'student' ? 'MSSV*' : 'MSCB*'"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-identifier"
                :placeholder="
                  singleUser.role === 'student'
                    ? 'Enter student ID...'
                    : 'Enter employee ID...'
                "
                :rules="[(v) => !!v || 'ID number is required']"
                hide-details="auto"
              ></v-text-field>

              <v-text-field
                v-model="singleUser.email"
                label="Email Address*"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-email-outline"
                placeholder="Enter email address..."
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
                hide-details="auto"
              ></v-text-field>

              <v-text-field
                v-model="singleUser.fullname"
                label="Full Name*"
                variant="outlined"
                density="comfortable"
                class="mb-6 rounded-lg"
                prepend-inner-icon="mdi-account-outline"
                placeholder="Enter full name..."
                :rules="[(v) => !!v || 'Full name is required']"
                hide-details="auto"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions class="d-flex justify-end">
            <div class="d-flex gap-4 justify-end" style="max-width: 100%">
              <v-btn
                variant="outlined"
                prepend-icon="mdi-refresh"
                class="rounded-lg"
                @click="resetSingleUser"
                style="max-width: 180px"
              >
                Reset
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                class="rounded-lg"
                variant="elevated"
                elevation="2"
                prepend-icon="mdi-check-circle"
                style="max-width: 180px"
              >
                Create User
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Right Section: Multiple Users Creation -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-xl border-card">
          <div class="card-header pa-6">
            <v-icon color="primary" size="x-large" class="mb-3"
              >mdi-database-import</v-icon
            >
            <h2 class="text-h5 font-weight-bold">Bulk User Import</h2>
            <p class="text-subtitle-2 text-medium-emphasis mb-0">
              Import multiple users from Excel file
            </p>
          </div>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <!-- Template Section -->
            <div class="template-section mb-6">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Template Format</h3>
              </div>

              <v-sheet rounded="lg" elevation="1" class="pa-2 mb-4 bg-grey-lighten-4">
                <v-table density="compact" class="rounded-lg">
                  <thead>
                    <tr class="bg-grey-lighten-3">
                      <th class="text-primary">Fullname</th>
                      <th class="text-primary">Email</th>
                      <th class="text-primary">{{ msLabel }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>john.doe@example.com</td>
                      <td>{{ selectedRole === "student" ? "12345678" : "CB12345" }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-sheet>

              <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-file-download-outline"
                class="rounded-lg px-4"
                @click="downloadTemplate"
              >
                Download Template
              </v-btn>
            </div>

            <!-- Upload Section -->
            <div class="import-section">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-cloud-upload-outline</v-icon>
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Upload Users</h3>
              </div>

              <v-select
                v-model="selectedRole"
                :items="[
                  { title: 'Student', value: 'student' },
                  { title: 'Professor', value: 'professor' },
                  { title: 'Administrator', value: 'admin' },
                ]"
                item-title="title"
                item-value="value"
                label="Select Role*"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-shield-account"
                hide-details="auto"
              ></v-select>

              <div
                class="drop-zone pa-8 text-center"
                :class="{ dragging: isDragging, 'has-file': showPreview }"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop="handleDrop"
              >
                <v-icon
                  size="40"
                  class="mb-3"
                  :color="showPreview ? 'success' : 'primary'"
                >
                  {{ showPreview ? "mdi-check-circle" : "mdi-cloud-upload-outline" }}
                </v-icon>
                <p class="mb-3">
                  {{
                    showPreview
                      ? "File uploaded successfully!"
                      : "Drag and drop Excel file here or"
                  }}
                </p>
                <v-btn
                  :color="showPreview ? 'success' : 'primary'"
                  variant="elevated"
                  class="rounded-lg px-4"
                  prepend-icon="mdi-file-excel"
                  @click="triggerFileInput"
                >
                  {{ showPreview ? "Change File" : "Upload Excel" }}
                </v-btn>

                <input
                  ref="fileInput"
                  type="file"
                  accept=".xlsx, .xls"
                  style="display: none"
                  @change="handleFileChange"
                />
              </div>

              <v-progress-linear
                v-if="importLoading"
                indeterminate
                color="primary"
                class="mt-4 rounded-xl"
              ></v-progress-linear>

              <v-alert
                v-if="importErrors.length"
                type="error"
                variant="tonal"
                class="mt-4 rounded-lg"
                border="start"
                :text="importErrors.join(', ')"
              ></v-alert>

              <v-expand-transition>
                <div v-if="showPreview" class="mt-6">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-table</v-icon>
                      <h3 class="text-subtitle-1 font-weight-bold mb-0">Preview Data</h3>
                    </div>
                    <v-chip color="success" size="small"
                      >{{ previewData.length }} users</v-chip
                    >
                  </div>

                  <v-sheet rounded="lg" elevation="1" class="pa-2 mb-4 bg-grey-lighten-4">
                    <v-table density="compact" class="rounded-lg preview-table">
                      <thead>
                        <tr class="bg-grey-lighten-3">
                          <th class="text-primary">Fullname</th>
                          <th class="text-primary">Email</th>
                          <th class="text-primary">{{ msLabel }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(user, i) in previewData.slice(0, 3)" :key="i">
                          <td>{{ user.fullname }}</td>
                          <td>{{ user.email }}</td>
                          <td>{{ user.ms }}</td>
                        </tr>
                        <tr v-if="previewData.length > 3">
                          <td
                            colspan="3"
                            class="text-center text-body-2 text-medium-emphasis"
                          >
                            + {{ previewData.length - 3 }} more users
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-sheet>

                  <v-btn
                    color="success"
                    variant="elevated"
                    block
                    class="rounded-lg mt-2"
                    elevation="2"
                    prepend-icon="mdi-database-import"
                    :loading="importLoading"
                  >
                    Import {{ previewData.length }} Users
                  </v-btn>
                </div>
              </v-expand-transition>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{
          snackbarColor === "success" ? "mdi-check-circle" : "mdi-alert-circle"
        }}</v-icon>
        {{ snackbarText }}
      </div>
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.border-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.border-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.05);
}

.drop-zone {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  border-radius: 16px;
  background-color: rgba(var(--v-theme-primary), 0.03);
  transition: all 0.3s ease;
}

.drop-zone.dragging {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: scale(1.01);
}

.drop-zone.has-file {
  border-color: rgb(var(--v-theme-success));
  background-color: rgba(var(--v-theme-success), 0.05);
}

.gutter-xl {
  margin: 0 -16px;
}

.gutter-xl > [class*="col-"] {
  padding: 0 16px;
}

.preview-table tr:nth-child(even) {
  background-color: rgba(var(--v-theme-primary), 0.02);
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.3px;
}

:deep(.v-field) {
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}
</style>
