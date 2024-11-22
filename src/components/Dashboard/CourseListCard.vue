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
          v-for="course in courses"
          :key="course.id"
          class="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-0"
        >
          <div class="flex items-center w-1/3 space-x-3">
            <v-img
              :max-width="50"
              :max-height="50"
              :src="course.image"
              class="rounded-lg"
              cover
            >
              <template v-slot:error>
                <v-img
                  :max-width="50"
                  :max-height="50"
                  src="../../assets/default-course-avt.svg"
                  alt="Course Avatar"
                  class="rounded-lg"
                  cover
                />
              </template>
            </v-img>
            <span class="font-medium text-gray-800">{{ course.name }}</span>
          </div>

          <div class="w-1/4">
            <AvatarStack :students="course.studentList" :maxVisible="3" />
          </div>

          <div class="w-1/4">
            <v-progress-linear
              v-model="course.percentageComplete"
              height="15"
              class="mb-4 rounded-lg"
              color="secondary"
            >
              <template #default>
                <strong class="text-text-primary">
                  {{ String(Math.ceil(Number(course.percentageComplete))) }}%
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
import {  CourseReview } from "@/types/Course";
defineProps<{
  courses:CourseReview[];
}>();

defineEmits<{
  (e: "view-details"): void;
}>();
</script>
