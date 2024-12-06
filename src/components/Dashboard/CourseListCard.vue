<template>
  <v-card class="rounded-lg overflow-hidden" elevation="2">
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-body-large-1 font-semibold text-gray-800">Courses</h3>
        <v-btn variant="text" color="secondary" :to="'/courselist'">
          View Details
        </v-btn>
      </div>

      <div
        class="flex justify-between items-center py-3 border-b border-gray-200 font-medium text-gray-700"
      >
        <span class="w-1/3">Course Name</span>
        <span class="w-1/4">Members</span>
        <span class="w-1/4">Progress</span>
      </div>

      <div class="max-h-80 overflow-y-auto">
        <div
          v-for="course in courses.content"
          :key="course.id"
          class="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-0"
        >
          <!-- Avatar and Course Name Section -->
          <div class="flex items-center w-1/3 space-x-3">
            <!-- Course Avatar -->
            <v-img
              :max-width="100"
              height="70px"
              :src="course.image || '../../assets/default-course-avt.svg'"
              class="rounded-lg"
              cover
            >
              <template v-slot:error>
                <!-- Default Avatar on Error -->
                <v-img
                  src="../../assets/default-course-avt.svg"
                  alt="Course Avatar"
                  class="rounded-lg"
                  cover
                />
              </template>
            </v-img>

            <!-- Course Name -->
            <span class="font-medium text-gray-800">{{ course.name }}</span>
          </div>

          <!-- Members Section -->
          <div class="w-1/4">
            <AvatarStack :students="course.student_list" :maxVisible="3" />
          </div>

          <!-- Progress Section -->
          <div class="w-1/4">
            <v-progress-linear
              v-model="course.percentage_complete"
              height="15"
              class="mb-4 rounded-lg"
              color="secondary"
            >
              <template #default>
                <strong class="text-text-primary">
                  {{ String(Math.ceil(Number(course.percentage_complete))) }}%
                </strong>
              </template>
            </v-progress-linear>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import {  CoursesListPaginatedResponse } from "@/types/Course";
defineProps<{
  courses: CoursesListPaginatedResponse;
}>();

defineEmits<{
  (e: "view-details"): void;
}>();
</script>
