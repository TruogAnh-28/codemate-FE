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

import { GetCourseDetailProfessorResponse } from '@/types/Course';
const props = defineProps<{
  course: GetCourseDetailProfessorResponse;
}>();


const progressStats = computed(() => [
  {
    label: "Students",
    value: `${props.course.nStudents}`,
    icon: "mdi-account-school",
    color: "success",
  },
  {
    label: "Lessons",
    value: `${props.course.nLessons}`,
    icon: "mdi-book-open-variant",
    color: "info",
  },
  {
    label: "Exercises",
    value: `${props.course.nExercises}`,
    icon: "mdi-book",
    color: "primary",
  },
  {
    label: "Documents",
    value: `${props.course.nDocuments}`,
    icon: "mdi-file-document",
    color: "secondary",
  },
]);
</script>
