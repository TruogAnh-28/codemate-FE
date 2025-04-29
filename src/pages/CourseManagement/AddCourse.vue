<script lang="ts" setup>
import { ref, inject, computed } from "vue";
import { CreateCourseRequest, GetAvailableCourses } from "@/types/Course";
import { GetAllUsersResponse } from "@/types/User";
import { coursesService } from "@/services/courseslistServices";
import { usersService } from "@/services/usersServices";
import * as XLSX from "xlsx";

// State
const course = ref<CreateCourseRequest>({
  name: "",
  professorID: "",
  creditNumber: 0,
  studentIDs: [],
  nSemester: 0,
  courseID: "",
  startDate: new Date(),
  endDate: new Date(),
  id: 0,
  class_name: "",
});

const availableCourses = ref<GetAvailableCourses[]>([]);
const professorInformation = ref<GetAllUsersResponse[]>([]);
const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const excelFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const importLoading = ref(false);
const importErrors = ref<string[]>([]);
const previewData = ref<string[]>([]);
const showPreview = ref(false);
const isDragging = ref(false);
const professorSearch = ref("");
const courseNameSearch = ref("");
const courseIdSearch = ref("");
const creditSearch = ref("");

// Injections
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Methods
const showSnackbar = (text: string, color: string = "success") => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const resetForm = () => {
  course.value = {
    id: 0,
    name: "",
    professorID: "",
    creditNumber: 0,
    studentIDs: [],
    nSemester: 0,
    courseID: "",
    startDate: new Date(),
    endDate: new Date(),
    class_name: "",
  };
  excelFile.value = null;
  previewData.value = [];
  showPreview.value = false;
};

const submitCourse = async () => {
  try {
    loading.value = true;
    if (
      !course.value.name ||
      !course.value.professorID ||
      !course.value.courseID ||
      course.value.nSemester <= 0 ||
      course.value.creditNumber <= 0
    ) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    const response = await coursesService.createCourse(
      { showError, showSuccess },
      [course.value]
    );
    if (response && "data" in response) {
      resetForm();
      showSnackbar("Course created successfully");
    }
  } catch (error) {
    showSnackbar("Failed to create course", "error");
  } finally {
    loading.value = false;
  }
};

const fetchAvailableCourses = async () => {
  loading.value = true;
  try {
    const response = await coursesService.getAvailableCourses({
      showError,
      showSuccess,
    });
    if (response.data) {
      availableCourses.value = response.data;
    }
  } finally {
    loading.value = false;
  }
};

const fetchProfessorInfoList = async () => {
  loading.value = true;
  try {
    const response = await usersService.getAllUsers(
      { role: "professor" },
      { showError, showSuccess }
    );
    if (response.data) {
      professorInformation.value = response.data;
    }
  } finally {
    loading.value = false;
  }
};
const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    excelFile.value = input.files[0];
    processExcelFile();
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    excelFile.value = event.dataTransfer.files[0];
    processExcelFile();
  }
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

    if (jsonData.length < 2 || !jsonData[0].includes("StudentID")) {
      importErrors.value.push("File must contain 'StudentID' header and data");
      importLoading.value = false;
      return;
    }

    const studentIDs: string[] = [];
    const errors: string[] = [];
    const studentIdIndex = jsonData[0].indexOf("StudentID");

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row[studentIdIndex]) {
        errors.push(`Row ${i}: Missing StudentID`);
      } else if (!course.value.studentIDs.includes(row[studentIdIndex])) {
        studentIDs.push(row[studentIdIndex].toString());
      }
    }

    importErrors.value = errors;
    previewData.value = studentIDs;
    showPreview.value = studentIDs.length > 0;
    if (studentIDs.length > 0) {
      course.value.studentIDs.push(...studentIDs);
    }
    importLoading.value = false;
  };
  reader.readAsArrayBuffer(excelFile.value);
};

const downloadTemplate = () => {
  const wb = XLSX.utils.book_new();
  const headers = ["StudentID"];
  const sampleData = [["12345678"], ["87654321"]];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
  XLSX.utils.book_append_sheet(wb, ws, "StudentIDs");
  XLSX.writeFile(wb, "student_ids_template.xlsx");
};
// Computed properties
const filteredProfessors = computed(() => {
  if (!professorSearch.value) return professorInformation.value;
  const search = professorSearch.value.toLowerCase();
  return professorInformation.value.filter(
    (prof) =>
      prof.fullname.toLowerCase().includes(search) ||
      prof.email.toLowerCase().includes(search) ||
      prof.ms.toLowerCase().includes(search)
  );
});

const filteredCoursesByName = computed(() => {
  if (!courseNameSearch.value) return availableCourses.value;
  const search = courseNameSearch.value.toLowerCase();
  return availableCourses.value.filter(
    (c) =>
      c.name.toLowerCase().includes(search) &&
      (!course.value.creditNumber || c.nCredit === course.value.creditNumber)
  );
});

const filteredCoursesById = computed(() => {
  if (!courseIdSearch.value) return availableCourses.value;
  const search = courseIdSearch.value.toLowerCase();
  return availableCourses.value.filter(
    (c) =>
      c.courseID.toLowerCase().includes(search) &&
      (!course.value.creditNumber || c.nCredit === course.value.creditNumber)
  );
});

const filteredCredits = computed(() => {
  const uniqueCredits = [
    ...new Set(availableCourses.value.map((c) => c.nCredit)),
  ];
  if (!creditSearch.value) return uniqueCredits;
  return uniqueCredits.filter((c) => c.toString().includes(creditSearch.value));
});

// Methods
const updateFromName = (name: string) => {
  const selectedCourse = availableCourses.value.find((c) => c.name === name);
  if (selectedCourse) {
    course.value.courseID = selectedCourse.courseID;
    course.value.creditNumber = selectedCourse.nCredit;
  }
};

const updateFromId = (id: string) => {
  const selectedCourse = availableCourses.value.find((c) => c.courseID === id);
  if (selectedCourse) {
    course.value.name = selectedCourse.name;
    course.value.creditNumber = selectedCourse.nCredit;
  }
};

const updateFromCredit = (credit: number) => {
  const matchingCourse = availableCourses.value.find(
    (c) => c.nCredit === credit
  );
  if (matchingCourse && !course.value.name && !course.value.courseID) {
    course.value.name = matchingCourse.name;
    course.value.courseID = matchingCourse.courseID;
  }
};

onMounted(() => {
  // Fetch data on mount
  fetchAvailableCourses();
  fetchProfessorInfoList();
});
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-8">
          <h1 class="text-h4 font-weight-bold gradient-text">
            Course Management
          </h1>
          <v-spacer></v-spacer>
          <v-chip color="primary" variant="outlined" class="px-4">
            <v-icon start>mdi-book-open-variant</v-icon>
            <span class="text-body-1">Admin Portal</span>
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <v-row class="gutter-xl">
      <!-- Left Section: Single Course Creation -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-xl border-card">
          <div class="card-header pa-6">
            <v-icon color="primary" size="x-large" class="mb-3"
              >mdi-book-plus</v-icon
            >
            <h2 class="text-h5 font-weight-bold">Create Course</h2>
            <p class="text-subtitle-2 text-medium-emphasis mb-0">
              Add a new course with details
            </p>
          </div>
          <v-divider></v-divider>
          <v-card-text class="pa-6">
            <v-form @submit.prevent="submitCourse">
              <v-autocomplete
                v-model="course.courseID"
                :items="filteredCoursesById"
                item-title="courseID"
                item-value="courseID"
                label="Course ID*"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-format-list-numbered"
                :rules="[(v) => !!v || 'Course ID is required']"
                hide-details="auto"
                @update:modelValue="updateFromId"
              >
              </v-autocomplete>

              <v-autocomplete
                v-model="course.name"
                :items="filteredCoursesByName"
                item-title="name"
                item-value="name"
                label="Course Name*"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-book-open-page-variant"
                :rules="[(v) => !!v || 'Course name is required']"
                hide-details="auto"
                @update:modelValue="updateFromName"
              >
              </v-autocomplete>

              <v-autocomplete
                v-model.number="course.creditNumber"
                :items="filteredCredits"
                label="Credit Number*"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-numeric"
                :rules="[
                  (v) => v > 0 || 'Credit number must be greater than 0',
                ]"
                hide-details="auto"
                @update:modelValue="updateFromCredit"
              >
              </v-autocomplete>

              <v-autocomplete
                v-model="course.professorID"
                :items="filteredProfessors"
                item-value="ms"
                item-title="email"
                item-subtitle="fullName"
                label="Professor*"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-account-tie"
                :rules="[(v) => !!v || 'Professor is required']"
                hide-details="auto"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props" class="py-2">
                    <v-list-item-title>
                      {{ item.raw.fullname || "No name" }}

                      <v-chip size="x-small" class="ml-2">{{
                        item.raw.ms || "No MS"
                      }}</v-chip></v-list-item-title
                    >
                    <v-divider class="my-1"></v-divider>
                  </v-list-item>
                </template>
                <template #prepend-item>
                  <v-text-field
                    v-model="professorSearch"
                    placeholder="Search professors..."
                    variant="outlined"
                    density="compact"
                    class="ma-2"
                    prepend-inner-icon="mdi-magnify"
                  ></v-text-field>
                </template>
              </v-autocomplete>

              <v-text-field
                v-model.number="course.nSemester"
                label="Semester Number*"
                variant="outlined"
                type="number"
                min="1"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-calendar-range"
                :rules="[(v) => v > 0 || 'Semester number is required']"
                hide-details="auto"
              ></v-text-field>

              <v-text-field
                v-model="course.class_name"
                label="Class Name*"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-school"
                :rules="[(v) => !!v || 'Class name is required']"
                hide-details="auto"
              ></v-text-field>

              <v-text-field
                v-model="course.startDate"
                label="Start Date*"
                type="date"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-calendar-start"
                :rules="[(v) => !!v || 'Start date is required']"
                hide-details="auto"
              ></v-text-field>

              <v-text-field
                v-model="course.endDate"
                label="End Date*"
                type="date"
                variant="outlined"
                density="comfortable"
                class="mb-4 rounded-lg"
                prepend-inner-icon="mdi-calendar-end"
                :rules="[(v) => !!v || 'End date is required']"
                hide-details="auto"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex justify-end pa-6">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-refresh"
              class="rounded-lg mr-4"
              @click="resetForm"
            >
              Reset
            </v-btn>
            <v-btn
              color="primary"
              :loading="loading"
              class="rounded-lg"
              variant="elevated"
              prepend-icon="mdi-check-circle"
              @click="submitCourse"
              :disabled="
                [
                  course.studentIDs.length === 0,
                  course.startDate === undefined,
                  course.endDate === undefined,
                  course.professorID === '',
                  course.name === '',
                  course.courseID === '',
                  course.creditNumber === 0,
                  course.nSemester === 0,
                  course.class_name === '',
                ].some(Boolean)
              "
            >
              Create Course
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Right Section: Student IDs Import -->
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-xl border-card">
          <div class="card-header pa-6">
            <v-icon color="primary" size="x-large" class="mb-3"
              >mdi-account-group</v-icon
            >
            <h2 class="text-h5 font-weight-bold">Import Student IDs</h2>
            <p class="text-subtitle-2 text-medium-emphasis mb-0">
              Upload student IDs via Excel
            </p>
          </div>
          <v-divider></v-divider>
          <v-card-text class="pa-6">
            <div class="template-section mb-6">
              <div class="d-flex align-center justify-space-between mb-3">
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
                >
                  Download Template
                </v-btn>
              </div>
              <v-sheet
                rounded="lg"
                elevation="1"
                class="pa-2 mb-4 bg-grey-lighten-4"
              >
                <v-table density="compact" class="rounded-lg">
                  <thead>
                    <tr class="bg-grey-lighten-3">
                      <th class="text-primary">StudentID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>12345678</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-sheet>
            </div>

            <div class="import-section">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2"
                  >mdi-cloud-upload-outline</v-icon
                >
                <h3 class="text-subtitle-1 font-weight-bold mb-0">
                  Upload Student IDs
                </h3>
              </div>
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
                  {{
                    showPreview
                      ? "mdi-check-circle"
                      : "mdi-cloud-upload-outline"
                  }}
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
                      <h3 class="text-subtitle-1 font-weight-bold mb-0">
                        Preview Data
                      </h3>
                    </div>
                    <v-chip color="success" size="small"
                      >{{ previewData.length }} IDs</v-chip
                    >
                  </div>
                  <v-sheet
                    rounded="lg"
                    elevation="1"
                    class="pa-2 mb-4 bg-grey-lighten-4"
                  >
                    <v-table density="compact" class="rounded-lg">
                      <thead>
                        <tr class="bg-grey-lighten-3">
                          <th class="text-primary">StudentID</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(id, i) in previewData.slice(0, 3)" :key="i">
                          <td>{{ id }}</td>
                        </tr>
                        <tr v-if="previewData.length > 3">
                          <td
                            class="text-center text-body-2 text-medium-emphasis"
                          >
                            + {{ previewData.length - 3 }} more IDs
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-sheet>
                </div>
              </v-expand-transition>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{
          snackbarColor === "success" ? "mdi-check-circle" : "mdi-alert-circle"
        }}</v-icon>
        {{ snackbarText }}
      </div>
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false"
          >Close</v-btn
        >
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
  background: linear-gradient(
    to right,
    rgba(var(--v-theme-primary), 0.05),
    transparent
  );
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
