<script lang="ts" setup>
import type { VForm } from 'vuetify/components'; // Import VForm type
import { usersService } from "@/services/usersServices";
import * as XLSX from "xlsx";

interface CreateUserRequest {
  fullname: string;
  email: string;
  ms: string;
  role: "student" | "professor" | "admin";
}

// Common role state
const selectedRole = ref<"student" | "professor" | "admin">("student");

// State for single user form
const singleUser = ref<CreateUserRequest>({
  fullname: "",
  email: "",
  ms: "",
  role: "student",
});

// *** Ref for the single user form instance ***
const singleUserForm = ref<InstanceType<typeof VForm> | null>(null);

// Watch for role changes
watch(selectedRole, (newRole) => {
  // Reset the form entirely when role changes to clear data and validation
  resetSingleUser();
  // Update the role in the (now empty) singleUser object for the next input
  singleUser.value.role = newRole;
});

const loading = ref(false); // Loading for single user submit
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

// State for multiple users import
const excelFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const importLoading = ref(false); // Loading for Excel processing/API submit
const importErrors = ref<string[]>([]);
const previewData = ref<CreateUserRequest[]>([]); // Valid users from file
const showPreview = ref(false); // Controls visibility of the preview/error section
const isDragging = ref(false);

// Computed properties
const msLabel = computed(() => (selectedRole.value === "student" ? "MSSV" : "MSCB"));

// Injections
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
     const file = input.files[0];
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        excelFile.value = file;
        processExcelFile();
    } else {
        showSnackbar("Invalid file type. Please upload an Excel file (.xlsx, .xls).", "error");
         if (fileInput.value) fileInput.value.value = ''; // Reset input if invalid type
    }
  }
   // Reset the input value so the same file can trigger the change event again
   if (input) input.value = '';
};

// Single user methods
const resetSingleUser = () => {
  // Use Vuetify's form reset - Clears models inside form AND validation
  singleUserForm.value?.reset();

  // Manually ensure role is set correctly after reset, as it's not an input
  // but affects labels/logic. reset() might nullify singleUser values.
  singleUser.value = {
      fullname: singleUser.value?.fullname ?? "", // Keep potential residual value if needed, otherwise ""
      email: singleUser.value?.email ?? "",
      ms: singleUser.value?.ms ?? "",
      role: selectedRole.value, // Ensure role is reset based on the selector
  };
};

const submitSingleUser = async () => {
  // Trigger validation
  const { valid } = await singleUserForm.value!.validate();
  if (!valid) {
      showSnackbar("Please fill in all required fields correctly", "error");
      return;
  }

  try {
    loading.value = true;

    const userToSubmit = {
      ...singleUser.value,
      name: singleUser.value.email.split("@")[0], // Ensure this logic is intended
      date_of_birth: new Date("1997-01-01").toISOString(), // Ensure this is intended
    };

    const response = await usersService.createUser([userToSubmit], {
      showError, // Use injected error handler
      showSuccess, // Use injected success handler
    });

    // Check success based on your service's response structure
    if (response && response.isSuccess) {
      // No need for manual showSuccess here if injection handles it
      // showSnackbar("User created successfully"); // Can be removed if showSuccess injection does this
      resetSingleUser(); // Reset form data AND validation state
    } else {
        // No need for manual showError if injection handles it
        // showSnackbar(response?.message || "Failed to create user", "error");
    }
  } catch (error) {
     // Fallback error display if service/injection doesn't catch it
    console.error("Error creating single user:", error);
    showSnackbar(`Failed to create user: ${error instanceof Error ? error.message : String(error)}`, "error");
  } finally {
    loading.value = false;
  }
};

// Multiple users methods
const submitMultipleUsers = async () => {
  if (previewData.value.length === 0) {
    showSnackbar("No valid users processed to import", "error");
    return;
  }

  try {
    importLoading.value = true; // Use importLoading for API submission too

    const usersToSubmit = previewData.value.map(user => ({
      ...user,
      name: user.email.split("@")[0], // Ensure this logic is intended
      date_of_birth: new Date("1997-01-01").toISOString(), // Ensure this is intended
    }));

    const response = await usersService.createUser(usersToSubmit, {
      showError, // Use injected error handler
      showSuccess, // Use injected success handler
    });

    // Check success based on your service's response structure
    if (response && response.isSuccess) {
      // showSnackbar(`Successfully imported ${usersToSubmit.length} ${selectedRole.value}(s)`); // Remove if showSuccess handles it
      // Reset import state on success
      excelFile.value = null;
      previewData.value = [];
      showPreview.value = false;
      importErrors.value = [];
       if (fileInput.value) {
           fileInput.value.value = '';
       }
    } else {
       // showSnackbar(response?.message || `Failed to import users`, "error"); // Remove if showError handles it
    }
  } catch (error) {
    console.error("Error importing multiple users:", error);
    showSnackbar(`Failed to import users: ${error instanceof Error ? error.message : String(error)}`, "error");
  } finally {
    importLoading.value = false;
  }
};

const showSnackbar = (text: string, color: string = "success") => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const validateEmail = (email: string): boolean => {
  if (!email) return false;
  // Basic email regex, consider a more robust one if needed
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const processExcelFile = async () => {
  importLoading.value = true;
  importErrors.value = [];
  previewData.value = [];
  showPreview.value = false; // Reset preview state initially

  if (!excelFile.value) {
    // This case should ideally be prevented by UI disabling upload without file
    // but handle defensively
    importErrors.value.push("No file selected.");
    showPreview.value = true; // Show the error area
    importLoading.value = false;
    return;
  }

  const reader = new FileReader();
  reader.onerror = (err) => {
      console.error("FileReader error:", err);
      importErrors.value.push("Error reading the file.");
      showPreview.value = true;
      importLoading.value = false;
  }
  reader.onload = (e) => {
    try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
            importErrors.value.push("Excel file does not contain any sheets.");
            showPreview.value = true;
            importLoading.value = false;
            return;
        }
        const firstSheet = workbook.Sheets[firstSheetName];
        // Use defval to prevent null/undefined cells causing issues
        const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: "" });

        if (jsonData.length < 2) {
            importErrors.value.push("File must contain a header row and at least one data row.");
            showPreview.value = true;
            importLoading.value = false;
            return;
        }

        const headers = jsonData[0].map(h => String(h).trim());
        // Use computed property msLabel for dynamic column name check
        const requiredColumns = ["Fullname", "Email", msLabel.value];

        const headerMap: { [key: string]: number } = {
           fullname: headers.indexOf("Fullname"),
           email: headers.indexOf("Email"),
           ms: headers.indexOf(msLabel.value),
        };

        const missingColumns = requiredColumns.filter(col => headers.indexOf(col) === -1);

        if (missingColumns.length > 0) {
            importErrors.value.push(`Missing required columns: ${missingColumns.join(", ")}. Header requires: ${requiredColumns.join(", ")}.`);
            showPreview.value = true;
            importLoading.value = false;
            return;
        }

        const processedUsers: CreateUserRequest[] = [];
        const errors: string[] = [];
        const uniqueEmails = new Set<string>(); // Track emails within the file for duplicates
        const uniqueMs = new Set<string>(); // Track MS numbers within the file

        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            // Skip completely empty rows more reliably
            if (row.every(cell => cell === null || cell === undefined || String(cell).trim() === "")) continue;

            const rowNum = i + 1; // User-friendly row number
            const fullname = String(row[headerMap.fullname] ?? "").trim();
            const email = String(row[headerMap.email] ?? "").trim();
            const ms = String(row[headerMap.ms] ?? "").trim();

            let rowHasError = false;
            if (!fullname) { errors.push(`Row ${rowNum}: Missing Fullname`); rowHasError = true; }
            if (!email) { errors.push(`Row ${rowNum}: Missing Email`); rowHasError = true; }
            else if (!validateEmail(email)) { errors.push(`Row ${rowNum}: Invalid Email format "${email}"`); rowHasError = true; }
            else if (uniqueEmails.has(email)) { errors.push(`Row ${rowNum}: Duplicate Email "${email}" in file.`); rowHasError = true; }
            if (!ms) { errors.push(`Row ${rowNum}: Missing ${msLabel.value}`); rowHasError = true; }
            else if (uniqueMs.has(ms)) { errors.push(`Row ${rowNum}: Duplicate ${msLabel.value} "${ms}" in file.`); rowHasError = true; }

            if (!rowHasError) {
                processedUsers.push({
                    fullname: fullname,
                    email: email,
                    ms: ms,
                    role: selectedRole.value, // Assign currently selected role
                });
                uniqueEmails.add(email);
                uniqueMs.add(ms);
            }
        }

        importErrors.value = errors;
        previewData.value = processedUsers; // Store only the valid users
        showPreview.value = true; // Always show the preview/error section after processing

    } catch (err) {
        console.error("Error processing Excel file:", err);
        importErrors.value.push(`Failed to process file: ${err instanceof Error ? err.message : String(err)}`);
        showPreview.value = true;
        previewData.value = [];
    } finally {
        importLoading.value = false;
    }
  };
  reader.readAsArrayBuffer(excelFile.value);
};


const downloadTemplate = () => {
  const wb = XLSX.utils.book_new();
  const headers = ["Fullname", "Email", msLabel.value]; // Use computed property
  const sampleData = [
    [
      "John Doe",
      "john.doe@example.com",
      selectedRole.value === "student" ? "20211234" : "CB1001",
    ],
    [
      "Jane Smith",
      "jane.smith@example.com",
      selectedRole.value === "student" ? "20215678" : "CB1002",
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
    const file = event.dataTransfer.files[0];
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        excelFile.value = file;
        processExcelFile();
    } else {
        showSnackbar("Invalid file type. Please upload an Excel file (.xlsx, .xls).", "error");
    }
  }
};

</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-8">
          <h1 class="text-h4 font-weight-bold gradient-text">User Management</h1>
          <v-spacer></v-spacer>
          <v-chip color="primary" variant="outlined" class="px-4" label>
            <v-icon start>mdi-account-group</v-icon>
            <span class="text-body-1">Admin Portal</span>
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- Role Selection Card -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" class="rounded-xl border-card">
          <v-card-text class="pa-6">
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" size="large" class="mr-3">mdi-shield-account-variant-outline</v-icon>
              <h2 class="text-h5 font-weight-medium">Select User Role</h2>
            </div>
            <p class="text-body-1 mb-6 text-medium-emphasis">
              Choose the role for new users. This applies to both single creation and bulk import.
            </p>
            <v-select
              v-model="selectedRole"
              :items="[
                { title: 'Student', value: 'student' },
                { title: 'Professor', value: 'professor' },
                { title: 'Administrator', value: 'admin' },
              ]"
              item-title="title"
              item-value="value"
              label="User Role*"
              variant="outlined"
              density="comfortable"
              class="max-w-md rounded-lg"
              prepend-inner-icon="mdi-account-cog-outline"
              :rules="[(v) => !!v || 'Role selection is required']"
              hide-details="auto"
            ></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="gutter-xl">
      <!-- Left Section: Single User Creation -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-xl border-card d-flex flex-column">
          <div class="card-header pa-6">
            <v-icon color="primary" size="x-large" class="mb-3">mdi-account-plus-outline</v-icon>
            <h2 class="text-h5 font-weight-medium">Create Single User</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Add one new {{ selectedRole }}
            </p>
          </div>
          <v-divider></v-divider>

          <!-- *** Add ref="singleUserForm" here *** -->
          <v-form ref="singleUserForm" @submit.prevent="submitSingleUser" class="d-flex flex-column flex-grow-1">
            <v-card-text class="pa-6 flex-grow-1">
              <v-text-field
                v-model="singleUser.ms"
                :label="msLabel + '*'"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-identifier"
                :placeholder="
                  selectedRole === 'student'
                    ? 'Enter student ID (e.g., 2114857...)'
                    : 'Enter employee ID (e.g., CB34563...)'
                "
                :rules="[(v) => !!v || `${msLabel} is required`]"
                required
                hide-details="auto"
              ></v-text-field>

              <v-text-field
                v-model="singleUser.email"
                label="Email Address*"
                variant="outlined"
                type="email"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-email-outline"
                placeholder="Enter email address..."
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => validateEmail(v) || 'Email must be a valid format',
                ]"
                required
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
                required
                hide-details="auto"
              ></v-text-field>
            </v-card-text>

            <v-card-actions class="d-flex justify-end pa-6 mt-auto">
              <div class="d-flex gap-4 justify-end" style="max-width: 100%">
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-refresh"
                  class="rounded-lg"
                  @click="resetSingleUser"
                  size="large"
                >
                  Reset
                </v-btn>
                <!-- *** Use type="submit" and remove @click *** -->
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  class="rounded-lg"
                  variant="elevated"
                  elevation="2"
                  prepend-icon="mdi-check-circle-outline"
                   size="large"
                >
                  Create User
                </v-btn>
              </div>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>

      <!-- Right Section: Multiple Users Creation -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-xl border-card d-flex flex-column">
          <div class="card-header pa-6">
            <v-icon color="primary" size="x-large" class="mb-3">mdi-database-import-outline</v-icon>
            <h2 class="text-h5 font-weight-medium">Bulk User Import</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Import multiple {{ selectedRole }}s via Excel
            </p>
          </div>
          <v-divider></v-divider>

          <v-card-text class="pa-6 flex-grow-1 d-flex flex-column">
            <!-- Template Section -->
            <div class="template-section mb-6">
              <div class="d-flex align-center justify-space-between mb-3 flex-wrap gap-2">
                <div class="d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold mb-0">Template Format</h3>
                </div>
                <v-btn
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-file-download-outline"
                  class="rounded-lg px-4"
                  @click="downloadTemplate"
                  size="small"
                >
                  Download Template
                </v-btn>
              </div>
              <v-sheet rounded="lg" elevation="1" class="pa-2 mb-4 bg-grey-lighten-4">
                <v-table density="compact" class="rounded-lg bg-transparent">
                  <thead>
                    <tr class="bg-grey-lighten-3">
                      <th class="text-left text-primary font-weight-bold">Fullname</th>
                      <th class="text-left text-primary font-weight-bold">Email</th>
                      <th class="text-left text-primary font-weight-bold">{{ msLabel }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>john.doe@example.com</td>
                      <td>{{ selectedRole === "student" ? "20211234" : "CB1001" }}</td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis">...</td>
                      <td class="text-medium-emphasis">...</td>
                      <td class="text-medium-emphasis">...</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-sheet>
            </div>

            <!-- Upload Section -->
            <div class="import-section mt-auto"> <!-- Push upload to bottom -->
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-cloud-upload-outline</v-icon>
                <h3 class="text-subtitle-1 font-weight-bold mb-0">
                  Upload {{ selectedRole }}s File
                </h3>
              </div>

              <div
                class="drop-zone pa-8 text-center rounded-lg"
                :class="{ dragging: isDragging, 'has-file': excelFile }"
                @dragenter.prevent="isDragging = true"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
              >
                <v-icon
                  size="40"
                  class="mb-3"
                  :color="excelFile ? 'success' : 'primary'"
                >
                   {{ excelFile ? "mdi-file-check-outline" : "mdi-cloud-upload-outline" }}
                </v-icon>
                <p class="mb-3 text-body-2">
                  {{
                    excelFile ? `Selected: ${excelFile.name}` :
                    "Drag and drop Excel file here or click below"
                  }}
                </p>
                <v-btn
                   :color="excelFile ? 'grey' : 'primary'"
                   variant="elevated"
                   class="rounded-lg px-4"
                   prepend-icon="mdi-file-excel-outline"
                   @click="triggerFileInput"
                   :disabled="importLoading"
                   size="small"
                >
                  {{ excelFile ? "Change File" : "Select Excel" }}
                </v-btn>

                <input
                  ref="fileInput"
                  type="file"
                  accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  style="display: none"
                  @change="handleFileChange"
                />
              </div>

              <v-progress-linear
                v-if="importLoading"
                indeterminate
                color="primary"
                class="mt-4 rounded-xl"
                height="6"
              ></v-progress-linear>

              <!-- Error Display -->
               <v-alert
                v-if="importErrors.length && !importLoading && showPreview"
                type="error"
                variant="tonal"
                class="mt-4 rounded-lg"
                border="start"
                closable
                density="compact"
                @update:modelValue="importErrors = []"
              >
                 <div class="font-weight-bold mb-1 text-caption">Import Issues Found:</div>
                 <ul class="pl-4 text-caption" style="list-style-type: disc;">
                     <li v-for="(error, index) in importErrors.slice(0, 5)" :key="`err-${index}`">{{ error }}</li>
                 </ul>
                 <div v-if="importErrors.length > 5" class="mt-1 text-caption font-italic">... and {{ importErrors.length - 5 }} more issues.</div>
              </v-alert>

              <!-- Preview & Submit Section -->
              <v-expand-transition>
                <div v-if="showPreview && !importLoading" class="mt-4">
                  <!-- Valid Data Preview -->
                  <div v-if="previewData.length > 0">
                      <div class="d-flex align-center justify-space-between mb-2 flex-wrap gap-2">
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2" size="small">mdi-clipboard-check-outline</v-icon>
                          <h3 class="text-subtitle-2 font-weight-bold mb-0">Preview Valid Data</h3>
                        </div>
                        <v-chip color="success" size="x-small" label>
                            {{ previewData.length }} valid {{ selectedRole }}(s) found
                        </v-chip>
                      </div>
                      <v-sheet rounded="lg" elevation="1" class="pa-1 mb-4 bg-grey-lighten-4">
                        <v-table density="compact" class="rounded-lg preview-table bg-transparent">
                          <thead>
                            <tr class="bg-grey-lighten-3">
                              <th class="text-left text-primary font-weight-bold text-caption">Fullname</th>
                              <th class="text-left text-primary font-weight-bold text-caption">Email</th>
                              <th class="text-left text-primary font-weight-bold text-caption">{{ msLabel }}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(user, i) in previewData.slice(0, 3)" :key="`preview-${i}`">
                              <td class="text-caption">{{ user.fullname }}</td>
                              <td class="text-caption">{{ user.email }}</td>
                              <td class="text-caption">{{ user.ms }}</td>
                            </tr>
                            <tr v-if="previewData.length > 3">
                              <td
                                colspan="3"
                                class="text-center text-caption text-medium-emphasis"
                              >
                                + {{ previewData.length - 3 }} more valid {{ selectedRole }}(s)
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
                        prepend-icon="mdi-database-import-outline"
                        :loading="importLoading"
                        @click="submitMultipleUsers"
                         size="large"
                      >
                        Import {{ previewData.length }} {{ selectedRole }}(s)
                      </v-btn>
                  </div>
                  <!-- Message if only errors found -->
                   <div v-else-if="importErrors.length > 0">
                        <v-alert type="warning" variant="tonal" class="rounded-lg text-caption" density="compact">
                            No valid users found in the file due to the issues listed above. Please correct the file and re-upload.
                        </v-alert>
                   </div>
                     <!-- Message if file processed but contained nothing valid and no errors -->
                   <div v-else>
                        <v-alert type="info" variant="tonal" class="rounded-lg text-caption" density="compact">
                           File processed, but no valid user data found. Check the file content and template format.
                        </v-alert>
                   </div>
                </div>
              </v-expand-transition>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="4000"
      location="top right"
      multi-line
      rounded="lg"
      elevation="4"
    >
       <div class="d-flex align-center">
        <v-icon class="mr-3">{{
          snackbarColor === "success" ? "mdi-check-circle-outline" :
          snackbarColor === "error" ? "mdi-alert-circle-outline" :
          snackbarColor === "warning" ? "mdi-alert-outline" :
          "mdi-information-outline"
        }}</v-icon>
       <span class="text-body-2">{{ snackbarText }}</span>
      </div>
      <template #actions>
        <v-btn :color="snackbarColor === 'error' ? 'white' : 'primary'" variant="text" @click="snackbar = false" size="small">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.border-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.border-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
   background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, transparent 50%);
   border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.drop-zone {
  border: 2px dashed rgba(var(--v-theme-primary), 0.4);
  background-color: rgba(var(--v-theme-primary), 0.02);
  transition: all 0.3s ease;
  cursor: pointer;
}

.drop-zone.dragging {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: scale(1.02);
}

.drop-zone.has-file {
  border-color: rgb(var(--v-theme-success));
  border-style: solid;
  background-color: rgba(var(--v-theme-success), 0.05);
}

.gutter-xl {
  margin: 0 -12px;
}

.gutter-xl > [class*="col-"] {
  padding: 12px 12px;
}

.preview-table tr:nth-child(even) {
  background-color: rgba(var(--v-theme-on-surface), 0.02);
}

.v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.max-w-md {
  max-width: 400px;
}

:deep(.v-field) {
  border-radius: 8px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 8px 0 0 8px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 8px 8px 0 !important;
}

.gradient-text {
  background: -webkit-linear-gradient(45deg, #1e88e5, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }

:deep(.v-table--density-compact > .v-table__wrapper > table > tbody > tr > td),
:deep(.v-table--density-compact > .v-table__wrapper > table > thead > tr > th),
:deep(.v-table--density-compact > .v-table__wrapper > table > tfoot > tr > td) {
    height: 36px;
}

.bg-transparent {
    background-color: transparent !important;
}
</style>