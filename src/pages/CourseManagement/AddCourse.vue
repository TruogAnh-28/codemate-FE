<script lang="ts" setup>
import { CreateCourseRequest } from "@/types/Course";
import { coursesService } from "@/services/courseslistServices";
import ImportExcel from "@/components/AdminDashboard/ImportExcel.vue";
// State
const courses = ref<CreateCourseRequest[]>([
  {
    id: 1,
    name: "",
    professorID: "",
    creditNumber: 0,
    studentIDs: [],
    nSemester: 0,
    courseID: "",
    startDate: new Date(),
    endDate: new Date(),
  },
]);

const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const IDInput = ref("");
const searchTerm = ref("");

// Methods
const addNewCourse = () => {
  courses.value.push({
    id: courses.value.length + 1,
    name: "",
    professorID: "",
    creditNumber: 0,
    studentIDs: [],
    nSemester: 0,
    courseID: "",
    startDate: new Date(),
    endDate: new Date(),
  });
};

const showSnackbar = (text: string, color: string = "success") => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const addStudentID = (courseIndex: number, ID: string) => {
  if (ID && !courses.value[courseIndex].studentIDs.includes(ID)) {
    courses.value[courseIndex].studentIDs.push(ID);
    IDInput.value = "";
    showSnackbar("Student ID added successfully");
  } else if (ID) {
    showSnackbar("ID already exists", "error");
  }
};

const removeStudentID = (courseIndex: number, IDIndex: number) => {
  courses.value[courseIndex].studentIDs.splice(IDIndex, 1);
  showSnackbar("Student ID removed");
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const handleConfirm = async () => {
  try {
    loading.value = true;

    // Validate data
    const isValid = courses.value.every(
      (course) =>
        course.name &&
        course.professorID &&
        course.creditNumber > 0 &&
        course.courseID &&
        course.nSemester > 0 &&
        course.studentIDs.length > 0
    );

    if (!isValid) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    courses.value.forEach((course) => {
      const startDateString = course.startDate.toISOString().split("T")[0];
      const endDateString = course.endDate.toISOString().split("T")[0];

      course.startDate = new Date(startDateString);
      course.endDate = new Date(endDateString);
      course.studentIDs = course.studentIDs.map((id) => id.toString());
      course.professorID = course.professorID.toString();
    });

    const response = await coursesService.createCourse(
      { showError, showSuccess },
      courses.value
    );
    if (response && "data" in response) {
      courses.value = response.data as CreateCourseRequest[];
    }

    // Reset form after successful submission
    courses.value = [
      {
        id: 1,
        name: "",
        professorID: "",
        creditNumber: 0,
        studentIDs: [],
        nSemester: 0,
        courseID: "",
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    showSnackbar("Courses submitted successfully");
  } catch (error) {
    console.error("Error submitting courses:", error);
    showSnackbar("Failed to submit courses", "error");
  } finally {
    loading.value = false;
  }
};

const handleImportExcel = (courseIndex: number) => {
  const onImportSuccess = (studentIDs: string[]) => {
    // Add new IDs while avoiding duplicates
    const existingIDs = courses.value[courseIndex].studentIDs;
    const newIDs = studentIDs.filter((id) => !existingIDs.includes(id));

    if (newIDs.length > 0) {
      courses.value[courseIndex].studentIDs.push(...newIDs);
      showSnackbar(`Successfully imported ${newIDs.length} student IDs`);
    } else {
      showSnackbar("No new student IDs to import", "info");
    }
  };

  return { onImportSuccess };
};

const removeCourse = (index: number) => {
  courses.value.splice(index, 1);
  showSnackbar("Course removed");
};
</script>

<template>
  <v-container class="max-w-7xl mx-auto py-8">
    <v-card class="mb-8">
      <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
        <h1 class="text-h4 font-weight-bold">Course Management</h1>
        <v-text-field
          v-model="searchTerm"
          prepend-inner-icon="mdi-magnify"
          label="Search courses"
          density="compact"
          hide-details
          class="max-w-xs"
        ></v-text-field>
      </v-card-title>

      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(course, index) in courses"
            :key="course.id"
            :title="`Course ${course.id}`"
            class="mb-4"
          >
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="course.name"
                    label="Course Name*"
                    variant="outlined"
                    :rules="[(v) => !!v || 'Course name is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="course.professorID"
                    label="Professor ID*"
                    variant="outlined"
                    type="ID"
                    :rules="[(v) => !!v || 'Professor ID is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="course.creditNumber"
                    label="Credit Number*"
                    variant="outlined"
                    type="number"
                    min="0"
                    :rules="[(v) => v > 0 || 'Credit number must be greater than 0']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="course.nSemester"
                    label="Semester Number*"
                    variant="outlined"
                    type="number"
                    min="1"
                    :rules="[(v) => v > 0 || 'Semester number is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="course.courseID"
                    label="Course ID*"
                    variant="outlined"
                    :rules="[(v) => !!v || 'Course ID is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-date-picker
                    v-model="course.startDate"
                    label="Start Date"
                    variant="outlined"
                  ></v-date-picker>
                </v-col>

                <v-col cols="12" md="6">
                  <v-date-picker
                    v-model="course.endDate"
                    label="End Date"
                    variant="outlined"
                  ></v-date-picker>
                </v-col>

                <v-col cols="12">
                  <v-card variant="outlined" class="pa-4">
                    <div class="d-flex align-center justify-space-between mb-4">
                      <h3 class="text-h6">Student IDs</h3>
                      <ImportExcel
                        :onImportSuccess="handleImportExcel(index).onImportSuccess"
                        columnName="MSSV"
                        hasHeader
                      />
                    </div>

                    <div class="mb-4">
                      <v-chip-group>
                        <v-chip
                          v-for="(ID, IDIndex) in course.studentIDs"
                          :key="IDIndex"
                          closable
                          @click:close="removeStudentID(index, IDIndex)"
                        >
                          {{ ID }}
                        </v-chip>
                      </v-chip-group>
                    </div>

                    <v-text-field
                      v-model="IDInput"
                      label="Add Student ID"
                      variant="outlined"
                      append-inner-icon="mdi-plus"
                      @click:append-inner="addStudentID(index, IDInput)"
                      @keyup.enter="addStudentID(index, IDInput)"
                    ></v-text-field>
                  </v-card>
                </v-col>

                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="error"
                    variant="outlined"
                    class="mr-2"
                    @click="removeCourse(index)"
                  >
                    Remove Course
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <div class="d-flex justify-end gap-4">
      <v-btn
        @click="addNewCourse"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-plus"
      >
        Add Course
      </v-btn>
      <v-btn @click="handleConfirm" color="primary" :loading="loading">
        Submit All Courses
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.v-expansion-panel {
  margin-bottom: 1rem !important;
}
</style>
