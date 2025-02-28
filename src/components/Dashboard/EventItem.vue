<template>
  <v-list-item class="w-full px-4 py-3">
    <div class="flex w-full items-start">
      <v-icon icon="mdi-calendar-clock" size="32" class="flex-shrink-0 mr-4 mt-0.5" color="primary" />
      <div class="flex flex-col flex-grow min-w-0">
        <div class="flex items-center gap-2">
            <span class="text-body-2 text-primary font-medium">[{{ item.course_nSemester }}]</span>
            <span class="text-body-1 font-medium truncate">{{ item.course_name }}</span>
            <span class="text-body-2 text-gray-600">({{ item.course_courseID }}): </span>
            <span class="text-body-1 text-primary-darken-1 mt-1">{{ item.exercise_name }}</span>
          </div>
        <div class="text-caption text-gray-500">Due: {{ item.exercise_time_open }} - {{ item.exercise_time_close }}</div>
      </div>
    </div>
  </v-list-item>
</template>

<script setup lang="ts">
import { UpcomingEvent } from "@/types/Dashboard";
const props = defineProps<{ data: UpcomingEvent }>();
const item = props.data
</script>
