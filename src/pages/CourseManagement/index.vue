<template>
  <v-layout class="bg-gray-50">
    <v-main class="px-6 py-8">
      <!-- Header Section -->
      <div class="mx-auto mb-6 max-w-7xl">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h4 font-weight-bold gradient-text">
            Course Management
          </h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            :to="'/add-course'"
            class="px-6"
          >
            Add Course
          </v-btn>
        </div>
      </div>

      <!-- Filter Section -->
      <v-card class="max-w-7xl mx-auto mb-6 rounded-xl" elevation="1">
        <v-card-text>
          <v-row class="align-center">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="searchQuery"
                placeholder="Search by course name or ID"
                variant="outlined"
                density="comfortable"
                hide-details
                prepend-inner-icon="mdi-magnify"
                clearable
                label="Search"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-select
                v-model="filterCredit"
                :items="[1, 2, 3, 4, 5]"
                label="Credits"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-text-field
                v-model="filterSemester"
                label="Semester"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-text-field
                v-model="filterStartDate"
                label="Start Date"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-text-field
                v-model="filterEndDate"
                label="End Date"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
                type="date"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Data Table -->
      <v-card class="max-w-7xl mx-auto rounded-xl" elevation="1">
        <v-data-table
          :headers="headers"
          :items="courses"
          :loading="loading"
          :items-per-page="pageSize"
          class="elevation-0 enhanced-table"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              variant="outlined"
              size="small"
              class="font-weight-medium text-capitalize"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                size="small"
                color="primary"
                variant="text"
                icon="mdi-pencil"
                @click="openEditDialog(item)"
              ></v-btn>
              <v-btn
                size="small"
                color="success"
                variant="text"
                icon="mdi-account-multiple-plus"
                @click="openAddStudentsDialog(item)"
                title="Add Students"
              ></v-btn>
              <v-btn
                size="small"
                color="error"
                variant="text"
                icon="mdi-delete"
                @click="confirmDelete(item)"
              ></v-btn>
            </div>
          </template>

          <template v-slot:bottom>
            <div class="d-flex align-center justify-space-between pa-4">
              <div class="d-flex align-center">
                <span class="mr-4">Rows per page:</span>
                <v-select
                  v-model="pageSize"
                  :items="[5, 10, 15, 20]"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="w-20"
                  @update:model-value="handlePageSizeChange"
                ></v-select>
              </div>
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                @update:model-value="handlePageChange"
              ></v-pagination>
            </div>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-4">No courses found</div>
          </template>
        </v-data-table>
      </v-card>
    </v-main>

    <!-- Edit Course Dialog -->
    <v-dialog v-model="editDialog" max-width="800px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-h5 py-4 px-6">
          Edit Course
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closeEditDialog"
            class="float-right"
          ></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-4">
          <v-form ref="editForm" @submit.prevent="updateCourse">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCourse.courseID"
                  label="Course ID"
                  variant="outlined"
                  density="comfortable"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCourse.name"
                  label="Course Name"
                  variant="outlined"
                  density="comfortable"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCourse.class_name"
                  label="Class Name"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col v-if="availableProfessors.length > 0" cols="12" md="6">
                <v-select
                  v-model="editedCourse.professor_id"
                  :items="availableProfessors"
                  item-title="name"
                  item-value="id"
                  label="Professor"
                  variant="outlined"
                  density="comfortable"
                  :loading="loadingProfessors"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCourse.n_credit"
                  label="Credits"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  min="1"
                  max="5"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCourse.start_date"
                  label="Start Date"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCourse.end_date"
                  label="End Date"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedCourse.n_semester"
                  label="Semester"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editedCourse.status"
                  :items="statusOptions.map((status) => status.text)"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeEditDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="updateCourse"
            :loading="updating"
            variant="elevated"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 py-4">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete the course
          <strong>{{ courseToDelete?.name }}</strong
          >? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteCourse"
            :loading="deleting"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Students Dialog -->
    <v-dialog v-model="addStudentsDialog" max-width="800px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-h5 py-4 px-6">
          Add Students to Course
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closeAddStudentsDialog"
            class="float-right"
          ></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-4">
          <p class="mb-4">
            Adding students to: <strong>{{ selectedCourse?.name }}</strong> (ID:
            {{ selectedCourse?.courseID }})
          </p>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="studentSearchQuery"
                label="Search students by name or student ID"
                placeholder="Type to search..."
                variant="outlined"
                density="comfortable"
                clearable
                prepend-inner-icon="mdi-magnify"
                @update:model-value="searchStudents"
                @click:clear="
                  studentSearchQuery = '';
                  searchStudents();
                "
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-card variant="outlined" class="pa-0">
                <v-card-title
                  class="py-3 px-4 text-subtitle-1 bg-grey-lighten-4"
                >
                  Available Students
                  <v-chip class="ml-2" size="small" color="primary">{{
                    filteredStudents.length
                  }}</v-chip>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="px-0 pt-0 pb-0">
                  <v-list
                    v-if="filteredStudents.length > 0"
                    height="300"
                    class="overflow-y-auto"
                  >
                    <v-list-item
                      v-for="student in filteredStudents"
                      :key="student.id"
                      :value="student.id"
                      @click="toggleStudentSelection(student)"
                    >
                      <template v-slot:prepend>
                        <v-checkbox
                          v-model="selectedStudents"
                          :value="student.ms"
                          hide-details
                          class="mr-2"
                        ></v-checkbox>
                      </template>
                      <v-list-item-title>
                        {{ student.name || student.fullname }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Student ID: {{ student.ms }} | Email:
                        {{ student.email }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                  <div v-else class="pa-4 text-center text-body-1">
                    <span v-if="loadingStudents">Loading students...</span>
                    <span v-else
                      >No students found. Try a different search term.</span
                    >
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-if="selectedStudents.length > 0">
            <v-col cols="12">
              <v-card variant="outlined" class="pa-0 mt-2">
                <v-card-title
                  class="py-3 px-4 text-subtitle-1 bg-grey-lighten-4"
                >
                  Selected Students
                  <v-chip class="ml-2" size="small" color="success">{{
                    selectedStudents.length
                  }}</v-chip>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="px-0 pt-0 pb-0">
                  <v-chip-group class="pa-4">
                    <v-chip
                      v-for="studentId in selectedStudents"
                      :key="studentId"
                      closable
                      @click:close="removeStudentSelection(studentId)"
                      class="ma-1"
                    >
                      {{ getStudentNameById(studentId) }} ({{ studentId }})
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeAddStudentsDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            @click="addStudentsToCourse"
            :loading="addingStudents"
            :disabled="selectedStudents.length === 0"
            variant="elevated"
          >
            Add Students
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject, computed } from "vue";
import {
  coursesService,
  PaginationParams,
} from "@/services/courseslistServices";
import { usersService } from "@/services/usersServices";
import debounce from "@/composables/useDebounce";
import {
  CoursesAdminListResponse,
  ProfessorInformation,
  UpdateCourseRequest,
  StudentOfCourseListModal,
} from "@/types/Course";
import { AuthConfig } from "@/services/authenServices";
import { GetAllUsersResponse } from "@/types/User"; // Add this import
import "../table.css";

// Filter variables
const searchQuery = ref("");
const filterCredit = ref<number | undefined>(undefined);
const filterSemester = ref<string>("");
const filterStartDate = ref<string>("");
const filterEndDate = ref<string>("");

const courses = ref<CoursesAdminListResponse[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalRows = ref(0);
const totalPages = ref(0);

// Edit dialog variables
const editDialog = ref(false);
const editedCourse = ref<UpdateCourseRequest>({});
const editForm = ref(null);
const updating = ref(false);
const professors = ref<ProfessorInformation[]>([]);
const loadingProfessors = ref(false);

// Delete dialog variables
const deleteDialog = ref(false);
const courseToDelete = ref<CoursesAdminListResponse | null>(null);
const deleting = ref(false);

// Add Students dialog variables
const addStudentsDialog = ref(false);
const selectedCourse = ref<CoursesAdminListResponse | null>(null);
const students = ref<GetAllUsersResponse[]>([]);
const filteredStudents = ref<GetAllUsersResponse[]>([]);
const selectedStudents = ref<string[]>([]);
const studentSearchQuery = ref("");
const loadingStudents = ref(false);
const addingStudents = ref(false);
const existingCourseStudents = ref<StudentOfCourseListModal[]>([]);
const existingStudentIds = ref<string[]>([]);

// Update headers to include actions column
const headers = [
  { title: "Course ID", key: "courseID", align: "start" as "start" },
  { title: "Name", key: "name" },
  { title: "Class Name", key: "class_name", align: "center" as "center" },
  { title: "Credits", key: "nCredit", align: "center" as "center" },
  { title: "Semester", key: "nSemester", align: "center" as "center" },
  { title: "Start Date", key: "start_date" },
  { title: "End Date", key: "end_date" },
  { title: "Status", key: "status", align: "center" as "center" },
  {
    title: "Actions",
    key: "actions",
    align: "center" as "center",
    sortable: false,
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    new: "primary",
    in_progress: "warning",
    completed: "success",
  };
  return colors[status as keyof typeof colors] || "gray";
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchCourses();
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchCourses();
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const fetchCourses = async () => {
  loading.value = true;
  try {
    const params: AuthConfig & PaginationParams = {
      page: currentPage.value,
      page_size: pageSize.value,
      showError,
      showSuccess,
    };

    if (searchQuery.value) {
      params.search_query = searchQuery.value;
    }

    if (filterCredit.value !== undefined && filterCredit.value !== null) {
      params.nCredit = filterCredit.value;
    }

    if (filterSemester.value !== "" && filterSemester.value !== null) {
      params.nSemester = Number(filterSemester.value);
    }

    if (filterStartDate.value !== "" && filterStartDate.value !== null) {
      params.start_date = filterStartDate.value;
    }

    if (filterEndDate.value !== "" && filterEndDate.value !== null) {
      params.end_date = filterEndDate.value;
    }

    const response = await coursesService.fetchAdminCoursesList({ ...params });
    if (response.data) {
      courses.value = response.data.content;
      totalRows.value = response.data.totalRows;
      totalPages.value = response.data.totalPages;
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    loading.value = false;
  }
};

const statusOptions = [
  { text: "New", value: "new" },
  { text: "In Progress", value: "in Progress" },
  { text: "Completed", value: "completed" },
];

const openEditDialog = async (item: CoursesAdminListResponse) => {
  // Create a deep copy and map properties to match UpdateCourseRequest interface
  //   // Fetch professors for the course
  await fetchProfessors(item.id);

  editedCourse.value = {
    courseID: item.courseID,
    name: item.name,
    class_name: item.class_name,
    n_credit: item.nCredit,
    n_semester: item.nSemester,
    status:
      item.status == "new"
        ? "New"
        : item.status == "in Progress"
        ? "In Progress"
        : "Completed",
    start_date: item.start_date,
    end_date: item.end_date,
  };

  if (!professors.value.length) {
    showError("No professors available for this course");
    return;
  } else if (professors.value.length === 1) {
    // If only one professor is available, set it as the default
    editedCourse.value.professor_id = professors.value[0].professor_id;
  }

  // Open dialog
  editDialog.value = true;
};

// Replace the availableProfessors computed property
const availableProfessors = computed(() => {
  // Filter out the current professor
  return professors.value
    .filter((prof) => prof.professor_id !== editedCourse.value.professor_id)
    .map((prof) => ({
      id: prof.professor_id,
      name: prof.professor_name,
    }));
});

// Modify fetchProfessors function
const fetchProfessors = async (courseId: string) => {
  loadingProfessors.value = true;
  try {
    const response = await coursesService.getProfessorForCourse(
      { showError, showSuccess },
      courseId
    );
    if (response && response.data) {
      const rawData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      professors.value = rawData.map((prof) => ({
        professor_id: prof.professor_id,
        professor_name: prof.professor_name,
        professor_email: prof.professor_email,
        professor_avatar: prof.professor_avatar,
      }));

      // If no professors or only one professor (the current one), we'll handle it in the computed property
      console.log("Professors fetched:", professors.value);
    } else {
      professors.value = [];
    }
  } catch (error) {
    console.error("Error fetching professors:", error);
    professors.value = [];
  } finally {
    loadingProfessors.value = false;
  }
};
// Close edit dialog
const closeEditDialog = () => {
  editDialog.value = false;
  editedCourse.value = {};
};

// Update course
const updateCourse = async () => {
  updating.value = true;
  try {
    const courseId = courses.value.find(
      (course) => course.courseID === editedCourse.value.courseID
    )?.id;
    console.log("status", editedCourse.value.status);
    const updateData = {
      name: editedCourse.value.name,
      professor_id: editedCourse.value.professor_id,
      start_date: editedCourse.value.start_date,
      end_date: editedCourse.value.end_date,
      status:
        editedCourse.value.status === "New"
          ? "new"
          : editedCourse.value.status === "In Progress"
          ? "in Progress"
          : "completed",
      n_credit: editedCourse.value.n_credit,
      n_semester: editedCourse.value.n_semester,
      class_name: editedCourse.value.class_name,
    };
    if (!courseId) {
      showError("Course ID not found");
      return;
    }
    console.log("Updating course with ID:", courseId);
    console.log("Update data:", updateData);
    await coursesService.updateCourseForAdmin(
      { showError, showSuccess },
      courseId,
      updateData
    );

    showSuccess("Course updated successfully");
    closeEditDialog();
    fetchCourses(); // Refresh the table
  } catch (error) {
    console.error("Error updating course:", error);
    showError("Failed to update course");
  } finally {
    updating.value = false;
  }
};

// Confirm delete dialog
const confirmDelete = (item: CoursesAdminListResponse) => {
  courseToDelete.value = item;
  deleteDialog.value = true;
};

// Delete course
const deleteCourse = async () => {
  if (!courseToDelete.value) return;

  deleting.value = true;
  try {
    await coursesService.deleteCourse(
      { showError, showSuccess },
      courseToDelete.value.id
    );

    showSuccess("Course deleted successfully");
    deleteDialog.value = false;
    fetchCourses(); // Refresh the table
  } catch (error) {
    console.error("Error deleting course:", error);
    showError("Failed to delete course");
  } finally {
    deleting.value = false;
  }
};

// Add Students functions
const openAddStudentsDialog = async (item: CoursesAdminListResponse) => {
  selectedCourse.value = item;
  selectedStudents.value = []; // Reset selected students
  addStudentsDialog.value = true;

  // First, fetch students that are already in the course
  await fetchExistingCourseStudents(item.id);

  // Then fetch all students and filter out existing ones
  await fetchStudents();
};

const closeAddStudentsDialog = () => {
  addStudentsDialog.value = false;
  selectedCourse.value = null;
  selectedStudents.value = [];
  studentSearchQuery.value = "";
  existingCourseStudents.value = [];
  existingStudentIds.value = [];
};

// Fetch existing students in the course
const fetchExistingCourseStudents = async (courseId: string) => {
  loadingStudents.value = true;
  try {
    const response = await coursesService.getStudentsForCourse(
      { showError, showSuccess },
      courseId
    );

    if (response && response.data) {
      existingCourseStudents.value = Array.isArray(response.data)
        ? response.data
        : [response.data];
      console.log("Existing course students:", existingCourseStudents.value);
      // Extract student IDs from existing course students
      existingStudentIds.value = existingCourseStudents.value
        .map((student) => student.student_mssv || "")
        .filter((id) => id !== "");

      console.log("Existing students in course:", existingCourseStudents.value);
      console.log("Existing student IDs:", existingStudentIds.value);
    }
  } catch (error) {
    console.error("Error fetching existing course students:", error);
    showError("Failed to load current course students");
    existingCourseStudents.value = [];
    existingStudentIds.value = [];
  }
};

// Fetch all available students function
const fetchStudents = async () => {
  loadingStudents.value = true;
  try {
    const response = await usersService.getAllUsers(
      { role: "student" },
      { showError, showSuccess }
    );

    if (response && response.data) {
      console.log("All students fetched:", response.data);
      // Filter out students who are already in the course
      students.value = response.data.filter(
        (student: { ms: string }) =>
          !existingStudentIds.value.includes(student.ms)
      );

      console.log("Available students (not yet in course):", students.value);
      applyStudentFilter(); // Apply initial filter
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    showError("Failed to load students");
  } finally {
    loadingStudents.value = false;
  }
};

// Search students (with debounce)
const searchStudents = debounce.useDebounceFn(() => {
  applyStudentFilter();
}, 300);

// Apply student filter based on search query
const applyStudentFilter = () => {
  // Check if studentSearchQuery is null or undefined before using trim()
  const query = studentSearchQuery.value?.trim?.() || "";

  if (!query) {
    // If no search query, show all students
    filteredStudents.value = students.value;
  } else {
    filteredStudents.value = students.value.filter((student) => {
      return (
        (student.name &&
          student.name.toLowerCase().includes(query.toLowerCase())) ||
        (student.fullname &&
          student.fullname.toLowerCase().includes(query.toLowerCase())) ||
        (student.ms && student.ms.toLowerCase().includes(query.toLowerCase()))
      );
    });
  }
};

// Toggle student selection
const toggleStudentSelection = (student: GetAllUsersResponse) => {
  const index = selectedStudents.value.findIndex((id) => id === student.ms);
  if (index === -1) {
    selectedStudents.value.push(student.ms);
  } else {
    selectedStudents.value.splice(index, 1);
  }
};

// Remove student from selection
const removeStudentSelection = (studentId: string) => {
  const index = selectedStudents.value.findIndex((id) => id === studentId);
  if (index !== -1) {
    selectedStudents.value.splice(index, 1);
  }
};

// Get student name by ID for display in chips
const getStudentNameById = (studentId: string) => {
  const student = students.value.find((s) => s.ms === studentId);
  return student ? student.name || student.fullname : studentId;
};

// Add selected students to course
const addStudentsToCourse = async () => {
  if (!selectedCourse.value || selectedStudents.value.length === 0) return;

  addingStudents.value = true;
  try {
    console.log("Adding students to course:", selectedStudents.value);
    await coursesService.addMoreStudentsToCourse(
      { showError, showSuccess },
      selectedCourse.value.id,
      selectedStudents.value
    );

    showSuccess(
      `Successfully added ${selectedStudents.value.length} student(s) to the course`
    );
    closeAddStudentsDialog();
  } catch (error) {
    console.error("Error adding students to course:", error);
    showError("Failed to add students to the course");
  } finally {
    addingStudents.value = false;
  }
};

// Watch for changes in student search query
watch(studentSearchQuery, () => {
  searchStudents();
});

// Debounced fetchCourses function
const debouncedFetchCourses = debounce.useDebounceFn(fetchCourses, 500);

// Watch all filter variables and reset to page 1 on change
watch(
  [searchQuery, filterCredit, filterSemester, filterStartDate, filterEndDate],
  () => {
    currentPage.value = 1; // Reset to page 1 on filter change
    debouncedFetchCourses();
  },
  { deep: true }
);

onMounted(() => {
  fetchCourses(); // Initial fetch without debounce
});
</script>

<style scoped>
:deep(.v-data-table) {
  border-radius: 12px;
}

:deep(.v-data-table__thead) {
  background-color: rgb(249, 250, 251);
}

:deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  text-transform: none !important;
  white-space: nowrap;
}

:deep(.v-data-table-footer) {
  background-color: rgb(249, 250, 251);
}
</style>
