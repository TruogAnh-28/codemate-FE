<template>
  <v-layout class="bg-gray-50 min-h-screen">
    <v-main class="px-6 py-8">
      <!-- Header Section -->
      <div class="max-w-7xl mx-auto mb-6 ">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <h1 class="text-3xl font-bold text-gray-900">Course Feedback Management</h1>
            <!-- Course Selector -->
            <v-select
              v-model="selectedCourseId"
              :items="courses?.course_name_list || []"
              item-title="course_name"
              item-value="course_id"
              label="Select Course"
              variant="outlined"
              density="comfortable"
              class="w-64 rounded-lg"
              hide-details
            ></v-select>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <v-card class="max-w-7xl mx-auto rounded-xl border border-gray-100" elevation="3">
        <v-data-table
          :headers="headers"
          :items="feedbacks"
          :items-per-page="10"
          :loading="loading"
          class="elevation-0"
        >
          <template v-slot:item.category="{ item }">
            <v-chip
              :color="getCategoryColor(item.category)"
              :text-color="getCategoryColor(item.category)"
              variant="outlined"
              size="small"
              class="font-medium"
            >
              {{ item.category.replace("_", " ").toUpperCase() }}
            </v-chip>
          </template>

          <template v-slot:item.created_at="{ item }">
            {{ formatDateTime(item.created_at) }}
          </template>

          <template v-slot:item.rate="{ item }">
            <v-rating
              v-model="item.rate"
              readonly
              density="compact"
              size="small"
              color="warning"
            ></v-rating>
          </template>

          <template v-slot:item.student_info="{ item }">
            <div class="flex flex-col">
              <span class="font-medium">{{ item.student_name }}</span>
              <span class="text-sm text-gray-500">{{ item.student_email }}</span>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { feedbackServices } from "@/services/Professor/FeedbackServices";
import { progressServices } from "@/services/Professor/ProgressServices";
import { GetListFeedbackProfessorResponse } from "@/types/Feedback";
import { GetCoursesListResponse } from "@/types/ProgressTracking";
import { formatDateTime } from "@/utils/functions/time";

const feedbacks = ref<GetListFeedbackProfessorResponse[]>([]);
const courses = ref<GetCoursesListResponse>();
const selectedCourseId = ref<string>("");
const loading = ref(false);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const getCategoryColor = (category: string) => {
  const colors = {
    performance: "primary",
    bug_report: "error",
    feature_request: "warning",
    user_interface: "info",
    others: "secondary",
  };
  return colors[category as keyof typeof colors];
};

const fetchCourses = async () => {
  try {
    const response = await progressServices.fetchCoursesList({
      showError,
      showSuccess,
    });

    if ("data" in response && response.data) {
      courses.value = response.data as GetCoursesListResponse;
      // Set default course to first course in list
      if (courses.value.course_name_list.length > 0 && !selectedCourseId.value) {
        selectedCourseId.value = courses.value.course_name_list[0].course_id;
      }
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

const fetchFeedbacks = async () => {
  if (!selectedCourseId.value) return;
  
  loading.value = true;
  try {
    const response = await feedbackServices.fetchFeedbackProfessor(
      { showError, showSuccess },
      selectedCourseId.value
    );

    if ("data" in response && response.data) {
      feedbacks.value = response.data as GetListFeedbackProfessorResponse[];
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
  } finally {
    loading.value = false;
  }
};

const headers = [
  { title: "Student", key: "student_info", align: "start" as const },
  { title: "Feedback Title", key: "title" },
  { title: "Feedback Description", key: "description" },
  { title: "Category", key: "category", align: "center" as const },
  { title: "Rating", key: "rate", align: "center" as const, sortable: true },
  { title: "Created At", key: "created_at", align: "center" as const, sortable: true },
];

// Watch for changes in selectedCourseId
watch(selectedCourseId, () => {
  fetchFeedbacks();
});

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
:deep(.v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

:deep(.v-data-table) {
  border-radius: 12px;
  overflow: hidden;
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