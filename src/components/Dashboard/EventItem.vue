<template>
  <v-list-item class="w-full px-4 py-3">
    <div class="flex w-full items-start">
      <v-icon 
        :icon="isClosingSoon ? 'mdi-alert-circle' : 'mdi-calendar-clock'" 
        size="32" 
        class="flex-shrink-0 mr-4 mt-0.5" 
        :color="isClosingSoon ? 'error' : 'primary'" 
      />
      <div class="flex flex-col flex-grow min-w-0">
        <div class="flex items-center gap-2">
            <span class="text-body-2 text-primary font-medium">[{{ item.course_nSemester }}]</span>
            <span class="text-body-1 font-medium truncate">{{ item.course_name }}</span>
            <span class="text-body-2 text-gray-600">({{ item.course_courseID }}): </span>
            <span 
              class="text-body-1 mt-1"
              :class="isClosingSoon ? 'text-error' : 'text-primary-darken-1'"
            >{{ item.exercise_name }}</span>
          </div>
        <div 
          class="text-caption"
          :class="isClosingSoon ? 'text-error' : 'text-gray-500'"
        >
          Due: {{ item.exercise_time_open }} - {{ item.exercise_time_close }}
          <span v-if="isClosingSoon" class="font-medium ml-2">
            (Closing soon!)
          </span>
        </div>
      </div>
    </div>
  </v-list-item>
</template>

<script setup lang="ts">
import { UpcomingEvent } from "@/types/Dashboard";

const props = defineProps<{ data: UpcomingEvent }>();
const item = props.data;

// Calculate if the event is closing within 3 days
const isClosingSoon = computed(() => {
  const closeDate = new Date(item.exercise_time_close);
  const today = new Date();
  const diffTime = closeDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
});
</script>