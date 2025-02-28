<template>
  <v-container class="overflow-hidden">
    <v-slide-group
      v-model="model"
      class="pa-4"
      show-arrows
      v-bind="slideGroupProps"
    >
      <v-slide-group-item
        v-for="course in sortedCourses"
        :key="course.id"
        class="flex justify-center"
      >
        <v-card
          class="course-card mx-2 rounded-lg shadow-lg bg-surface"
          :elevation="6"
          outlined
        >
          <!-- Header -->
          <v-card-title>
            <v-tooltip bottom>
              <template #activator="{ props }">
                <h3
                  v-bind="props"
                  class="text-heading-5 font-sans font-bold truncate"
                >
                  {{ course.name }}
                </h3>
              </template>
              <span>{{ course.name }}</span>
            </v-tooltip>
          </v-card-title>

          <!-- Learning Outcomes -->
          <v-card-text class="relative flex-1">
            <LearningOutcomes :outcomes="course.learning_outcomes" :nameCourse="course.name"/>
          </v-card-text>

          <!-- Footer Section -->
          <v-card-actions class="flex-col items-end">
            <p
              class="text-body-small-1 text-text-tetiary mb-2 font-sans mr-auto"
            >
              Last Accessed: {{ formatDateTime(course.last_accessed) }}
            </p>

            <!-- Progress Bar -->
            <v-progress-linear
              v-model="course.percentage_complete"
              height="15"
              class="mb-4 rounded-lg"
            >
              <template #default>
                <strong class="text-secondary">
                  {{ String(Math.ceil(Number(course.percentage_complete))) }}%
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
                :to="`/courselist/course/${course.id}`"
              >
                View Course
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-container>
</template>

<script lang="ts" setup>
import { CoursesListResponse } from "@/types/Course";
import { formatDateTime } from "@/utils/functions/time";

const props = defineProps<{
  response: CoursesListResponse[];
}>();

const model = ref(0);

const slideGroupProps = {
  multiple: false,
  hideDelimiters: false,
  transition: "slide-x-reverse-transition",
};

const sortedCourses = computed(() => {
  return [...props.response].sort((a, b) => {
    const dateA = new Date(a.last_accessed).getTime();
    const dateB = new Date(b.last_accessed).getTime();
    return dateB - dateA;
  });
});
</script>

<style scoped>
.v-slide-group {
  display: flex;
  overflow-x: hidden;
  width: 100%;
  justify-content: center;
}

.v-slide-group-item {
  display: flex;
  justify-content: center;
}

.course-card {
  width: 500px;
  transition: transform 0.3s ease-in-out;
}

.v-card:hover {
  transform: scale(1.05);
}

.v-slide-group-item + .v-slide-group-item {
  margin-left: 16px;
}
</style>
