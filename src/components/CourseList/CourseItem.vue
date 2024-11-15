<template>
  <v-container>
    <v-row>
      <v-col v-for="course in courses" :key="course.id" cols="12" class="mb-6">
        <v-card class="rounded-lg shadow-md">
          <div class="d-flex p-4 gap-4">
            <!-- Course Image -->
            <v-img
              class="flex-shrink-0"
              :max-width="300"
              :max-height="200"
              :src="course.image"
              cover
            >
              <template v-slot:error>
                <v-img
                  :max-width="300"
                  :max-height="200"
                  src="../../assets/default-course-avt.svg"
                  alt="Course Avatar"
                  cover
                />
              </template>
            </v-img>

            <!-- Middle Content -->
            <div class="flex-grow-1 min-w-0">
              <!-- Course Title and Date -->
              <div class="mb-4">
                <h3 class="text-body-large-1 font-bold text-wrap mb-1">
                  {{ course.name }}
                </h3>
                <p class="text-body-small-1 text-text-tetiary">
                  {{ course.startDate }} to {{ course.endDate }}
                </p>
              </div>

              <!-- Avatar Stack -->
              <AvatarStack :students="course.studentList" :max-visible="3" />
            </div>

            <div class="flex-shrink-0 min-w-[200px]">
              <LearningOutcomes :outcomes="course.learningOutcomes" />
            </div>

            <div class="d-flex flex-column justify-space-between align-end">
              <div class="text-end mb-2">
                <p class="text-body-base-4 mb-4">
                  <strong>Professor:</strong> {{ course.professor }}
                </p>
                <v-chip
                  :color="renderStatusLabel(course.status)"
                  outlined
                  small
                  class="text-body-small-1"
                >
                  <v-icon left size="18" class="mr-2">mdi-check-circle</v-icon>
                  {{ course.status }}
                </v-chip>
              </div>
            </div>
            <v-btn
              color="secondary"
              :to="`/courselist/course/${course.id}`"
              rounded
            >
              View Course
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { CourseReviewData } from "@/constants/course";
import { CourseReview } from "@/types/Course";
import { renderStatusLabel } from "@/utils/functions/render";

const courses = ref<CourseReview[]>(CourseReviewData);
</script>
