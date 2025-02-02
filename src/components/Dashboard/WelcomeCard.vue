<template>
  <v-card
    class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 overflow-hidden"
    elevation="3"
  >
    <div
      class="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full transform -translate-y-16 translate-x-16"
    />
    <div
      class="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100/30 rounded-full transform translate-y-12 -translate-x-8"
    />

    <v-card-text class="relative z-10 p-6">
      <div class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-heading-1 font-semibold text-gray-800">
            Welcome back,
          </h2>
          <p class="text-heading-4 text-blue-600 font-medium">
            {{ studentName }}
          </p>
        </div>

        <p class="text-gray-600 leading-relaxed">
          Glad to see you again! Keep up the momentum in your
          <span class="font-medium">{{ recentCourse.course }}</span> course.
        </p>

        <v-btn
          variant="text"
          color="primary"
          class="px-4 py-2 mt-2 font-medium hover:bg-blue-50 transition-colors"
          :to="`/courselist/course/${recentCourse.course_id}`"
        >
          Tap to learn
          <v-icon end icon="mdi-arrow-right" class="ml-1" />
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { dashboardService } from "@/services/dashboardService";
import { useAuthStore } from "@/stores/auth";
import { GetRecentCourseResponse } from "@/types/Dashboard";
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const recentCourse = ref<GetRecentCourseResponse>({
  course: "",
  course_id: "",
  last_accessed: "",
});
const studentName = useAuthStore().getUser()?.name;
const fetchRecentCourse = async () => {
  const response = await dashboardService.fetchRecentCourse({
    showError,
    showSuccess,
  });
  if (response && "data" in response && response.data) {
    recentCourse.value = response.data as GetRecentCourseResponse;
  }
};
onMounted(() => {
  fetchRecentCourse();
});
</script>
