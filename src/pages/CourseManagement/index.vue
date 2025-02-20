<template>
  <v-layout class="bg-gray-50">
    <v-main class="px-6 py-8">
      <!-- Header Section -->
      <div class="mx-auto mb-6 max-w-7xl">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h4 font-weight-bold">Course Management</h1>
          <div class="d-flex align-center gap-4">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search by course name"
              variant="outlined"
              density="comfortable"
              hide-details
              class="rounded-lg w-80"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </div>
        </div>
      </div>

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
                  class="w-16"
                  @update:model-value="handlePageSizeChange"
                >
                </v-select>
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
import { ref, computed, onMounted, watch } from "vue";
import { coursesService } from "@/services/courseslistServices";
import debounce from "@/composables/useDebounce";
import { CoursesAdminListResponse } from "@/types/Course";

const courses = ref<CoursesAdminListResponse[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalRows = ref(0);
const totalPages = ref(0);

// Create a debounced search query
const searchQuery = ref("");
const debouncedSearchQuery = computed(() => debounce.useDebounce(searchQuery.value, 500));

// Watch for changes in the debounced search query.
watch(debouncedSearchQuery, () => {
  currentPage.value = 1; // Reset to first page when searching
  fetchCourses();
});

watch(searchQuery, () => {
  if (searchQuery.value === "") {
    currentPage.value = 1; // Reset to first page when query is cleared
    fetchCourses();
  }
});

const headers = [
  { title: "Course ID", key: "courseID", align: "start" as "start" },
  { title: "Name", key: "name" },
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
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      search_query: searchQuery.value,
      showError,
      showSuccess,
    };

    const response = await coursesService.fetchAdminCoursesList(params);
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

onMounted(() => {
  fetchCourses();
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
