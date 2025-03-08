<template>
  <v-layout class="bg-gray-50">
    <v-main class="px-6 py-8">
      <!-- Header Section -->
      <div class="mx-auto mb-6 max-w-7xl">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h4 font-weight-bold gradient-text">Course Management</h1>
          <v-btn color="primary" prepend-icon="mdi-plus" :to="'/add-course'" class="px-6">
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
          class="elevation-0"
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
  </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { coursesService, PaginationParams } from "@/services/courseslistServices";
import debounce from "@/composables/useDebounce";
import { CoursesAdminListResponse } from "@/types/Course";
import { AuthConfig } from "@/services/authenServices";

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

const headers = [
  { title: "Course ID", key: "courseID", align: "start" as "start" },
  { title: "Name", key: "name" },
  { title: "Class Name", key: "class_name", align: "center" as "center" },
  { title: "Credits", key: "nCredit", align: "center" as "center" },
  { title: "Semester", key: "nSemester", align: "center" as "center" },
  { title: "Start Date", key: "start_date" },
  { title: "End Date", key: "end_date" },
  { title: "Status", key: "status", align: "center" as "center" },
];

const getStatusColor = (status: string) => {
  const colors = {
    new: "primary",
    in_progress: "warning",
    completed: "success",
    active: "success",
    inactive: "error",
    draft: "grey",
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
