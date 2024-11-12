<template>
  <v-container class="overflow-x-auto">
    <v-row class="flex-nowrap gap-4">
      <v-col
        v-for="course in response"
        :key="course.id"
        cols="auto"
        class="w-85 p-4 bg-surface rounded-lg shadow flex flex-col"
      >
        <!-- Header -->
        <v-card-title>
          <v-tooltip bottom>
            <template #activator="{ props }">
              <h3
                v-bind="props"
                class="text-lg font-sans font-bold truncate"
              >
                {{ course.name }}
              </h3>
            </template>
            <span>{{ course.name }}</span>
          </v-tooltip>
        </v-card-title>

        <!-- Learning Outcomes -->
        <v-card-text class="relative flex-1">
          <LearningOutcomes :outcomes="course.learningOutcomes" />
        </v-card-text>

        <!-- Footer Section -->
        <v-card-actions class="mt-auto flex-col">
          <p class="text-xs text-text-secondary mb-2 font-sans">
            Last Accessed: {{ formatDate(course.lastAccessed) }}
          </p>

          <!-- Progress Bar -->
          <v-progress-linear
            v-model="course.percentageComplete"
            height="15"
            class="mb-4 rounded-lg"
          >
            <template #default>
              <strong class="text-secondary">
                {{ String(Math.ceil(Number(course.percentageComplete))) }}%
              </strong>
            </template>
          </v-progress-linear>

          <!-- Action Buttons -->
          <div class="flex gap-2 w-full">
            <v-btn
              color="primary"
              class="flex-1 px-4 py-1 text-on-primary rounded-md font-sans"
            >
              Resume
            </v-btn>
            <v-btn
              color="secondary"
              class="flex-1 px-4 py-1 text-on-secondary rounded-md font-sans"
            >
              View Course
            </v-btn>
          </div>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { CourseRecent } from '@/types/Course';
import { CourseRecentData } from '@/constants/course';

export default {
  name: 'Cards',
  setup() {
    const response = ref<CourseRecent[]>(CourseRecentData);

    // Format date to DD/MM/YYYY
    const formatDate = (dateString: string): string => {
      try {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return 'Invalid Date';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Error';
      }
    };

    return {
      response,
      formatDate
    };
  }
};
</script>
