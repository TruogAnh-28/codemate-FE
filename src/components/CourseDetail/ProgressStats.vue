<template>
  <v-card class="rounded-lg shadow-lg">
    <v-card-text>
      <h4 class="text-heading-4 font-semibold mb-4">Progress Statistics</h4>
      <v-list>
        <v-list-item
          v-for="(stat, index) in progressStats"
          :key="index"
          class="flex items-center justify-between py-3 border-b border-gray-200"
        >
          <template v-slot:prepend>
            <v-icon :color="stat.color" size="32" class="mr-3">
              {{ stat.icon }}
            </v-icon>
          </template>
          <v-list-item-title class="text-body-large-1 font-medium text-gray-800 flex-grow">
            {{ stat.label }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-body-large-4 text-right text-gray-600">
            {{ stat.value }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { CourseDetailResponse } from "@/types/Course";
import { formatTime } from "@/utils/functions/time";

const props = defineProps<{
  course: CourseDetailResponse;
}>();

function calculateTotalExercises(course: CourseDetailResponse): number {
  return course.lessons.reduce((total, lesson) => total + lesson.exercises.length, 0);
}

const progressStats = computed(() => [
  {
    label: "Completed Lessons",
    value: `${props.course.completed_lessons}/${props.course.lessons.length}`,
    icon: "mdi-book-check",
    color: "success",
  },
  {
    label: "Time Spent",
    value: `${formatTime(props.course.time_spent)}`,
    icon: "mdi-clock",
    color: "info",
  },
  {
    label: "Assignments Done",
    value: `${props.course.assignments_done}/${calculateTotalExercises(props.course)}`,
    icon: "mdi-file-check",
    color: "primary",
  },
]);
</script>
