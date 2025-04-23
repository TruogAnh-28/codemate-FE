<template>
  <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
    <div
      v-for="stat in filteredStats"
      :key="stat.id"
      class="stat-card bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      <div class="flex justify-between">
        <div class="flex flex-col">
          <v-icon :icon="stat.icon" size="36" :color="stat.color" class="mb-4"></v-icon>
          <p class="text-gray-600">{{ stat.label }}</p>
        </div>
        <h4 class="text-heading-3 mb-2" :class="stat.textColor">
          {{ stat.value }}
        </h4>
      </div>
      <!-- <div class="flex justify-center center">
        <v-btn
          variant="text"
          color="primary"
          class="px-4 py-2 mt-2 font-medium hover:bg-blue-50 transition-colors"
          :to="stat.to"
        >
          Tap to view
          <v-icon end icon="mdi-arrow-right" class="ml-1" />
        </v-btn>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { GetDashboardProfessorResponse } from "@/types/Dashboard";

const props = defineProps<{ dashboardData: GetDashboardProfessorResponse }>();

// Filter out the 'exercises' statistic
const filteredStats = computed(() => [
  {
    id: "courses",
    label: "Total Courses",
    icon: "mdi-book-open-variant",
    value: props.dashboardData.nCourses || 0,
    color: "error",
    textColor: "text-error",
    to: "/professor-courselist",
  },
  {
    id: "lessons",
    label: "Total Lessons",
    icon: "mdi-school",
    value: props.dashboardData.nLessons || 0,
    color: "warning",
    textColor: "text-warning",
    to: "/professor-courselist",
  },
  {
    id: "students",
    label: "Total Students",
    icon: "mdi-account-group",
    value: props.dashboardData.nStudents || 0,
    color: "success",
    textColor: "text-success",
    to: "/professor-progress",
  },
]);
</script>

<style scoped>
.stat-card {
  transition: transform 0.5s ease;
}

.stat-card:hover {
  transform: translateY(-10px) !important;
}
</style>