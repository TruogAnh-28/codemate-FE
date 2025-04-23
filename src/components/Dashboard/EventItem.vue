<template>
  <v-list-item class="w-full px-4 py-3">
    <div class="flex w-full items-start">
      <div 
        class="flex-shrink-0 mr-4 mt-0.5 rounded-full p-2 flex items-center justify-center"
        :class="isClosingSoon ? 'bg-red-100' : getEventBackgroundClass(item)"
      >
        <v-icon 
          :icon="isClosingSoon ? 'mdi-alert-circle' : getEventIcon(item)" 
          size="24" 
          :color="isClosingSoon ? 'error' : getEventIconColor(item)" 
        />
      </div>
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
import { computed } from 'vue';

const props = defineProps<{ data: UpcomingEvent }>();
const item = props.data;

const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date();
  const [timePart, datePart] = dateString.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);
  const [day, month, year] = datePart.split('/').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

// Calculate if the event is closing within 3 days
const isClosingSoon = computed(() => {
  if (!item.exercise_time_close) return false;
  
  const closeDate = parseDate(item.exercise_time_close);
  const today = new Date();
  const diffTime = closeDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
});

const getEventIcon = (event: UpcomingEvent | null): string => {
  if (!event) return 'mdi-calendar-blank';
  
  switch (event.exercise_type) {
    case 'quiz':
      return 'mdi-help-circle-outline';
    case 'code':
      return 'mdi-code-tags';
    case 'original':
      return 'mdi-pencil';
    default:
      return 'mdi-calendar-clock';
  }
};

const getEventIconColor = (event: UpcomingEvent | null): string => {
  if (!event) return 'gray';
  
  switch (event.exercise_type) {
    case 'quiz':
      return 'orange-darken-2';
    case 'code':
      return 'blue-darken-2';
    case 'original':
      return 'purple-darken-2';
    default:
      return 'green-darken-2';
  }
};

const getEventBackgroundClass = (event: UpcomingEvent | null): string => {
  if (!event) return 'bg-gray-100';
  
  switch (event.exercise_type) {
    case 'quiz':
      return 'bg-orange-100';
    case 'code':
      return 'bg-blue-100';
    case 'original':
      return 'bg-purple-100';
    default:
      return 'bg-green-100';
  }
};
</script>