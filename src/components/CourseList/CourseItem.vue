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
                <h3 class="text-lg font-bold text-wrap mb-1">
                  {{ course.name }}
                </h3>
                <p class="text-sm text-grey-darken-1">
                  {{ course.startDate }} to {{ course.endDate }}
                </p>
              </div>

              <!-- Avatar Stack -->
              <AvatarStack :students="course.studentList" :max-visible="3" />
            </div>

            <!-- Learning Outcomes -->
            <div class="flex-shrink-0 min-w-[200px]">
              <LearningOutcomes :outcomes="course.learningOutcomes" />
            </div>

            <!-- Right Side Content -->
            <div class="d-flex flex-column justify-space-between align-end">
              <div class="text-end mb-4">
                <p class="text-sm mb-1">
                  <strong>Professor:</strong> {{ course.professor }}
                </p>
                <p
                  :class="[ 'text-sm', course.status === 'Completed' ? 'text-success' : 'text-warning' ]"
                >
                  {{ course.status }}
                </p>
              </div>

              <v-btn
                color="secondary"
                :to="`/courselist/course/${course.id}`"
                rounded
              >
                View Course
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref } from 'vue';
import { CourseReviewData } from '@/constants/course';
import { CourseReview } from '@/types/Course';

export default {
  name: 'CourseList',
  setup() {
    const courses = ref<CourseReview[]>(CourseReviewData);

    return {
      courses
    };
  }
};
</script>
