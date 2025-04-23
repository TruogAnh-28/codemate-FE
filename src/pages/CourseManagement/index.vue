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
  </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject } from "vue";
import {
  coursesService,
  PaginationParams,
} from "@/services/courseslistServices";
import debounce from "@/composables/useDebounce";
import {
  CoursesAdminListResponse,
  ProfessorInformation,
  UpdateCourseRequest,
} from "@/types/Course";
import { AuthConfig } from "@/services/authenServices";
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
