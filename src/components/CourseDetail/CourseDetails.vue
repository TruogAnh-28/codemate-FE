<template>
  <v-col cols="12" md="6">
    <div class="d-flex align-center mb-2 text-body-small-2">
      <v-icon size="18" color="primary" class="mr-1">mdi-calendar</v-icon>
      <span>
        {{ formatStart_EndDate(course?.course_start_date || "")  }} to {{ formatStart_EndDate(course?.course_end_date || "") }}
      </span>
    </div>
    <div class="d-flex align-center mb-2 text-body-small-2">
      <v-icon size="18" color="primary" class="mr-1">mdi-book-open-variant</v-icon>
      <span>{{ course ? calculateTotalDocuments(course) : "N/A" }} Documents</span>
    </div>
    <div class="d-flex align-center mb-2 text-body-small-2">
      <v-icon size="18" color="primary" class="mr-1">mdi-account</v-icon>
      <span>{{ course?.course_professor.professor_name }}</span>
    </div>
  </v-col>
</template>

<script lang="ts" setup>
import { CourseDetailResponse } from "@/types/Course";
import { formatStart_EndDate } from "@/utils/functions/time";

defineProps<{
  course: CourseDetailResponse | null;
}>();

function calculateTotalDocuments(course: CourseDetailResponse): number {
  return course.lessons.reduce((total, lesson) => total + lesson.documents.length, 0);
}
</script>
