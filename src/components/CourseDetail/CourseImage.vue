<template>
  <v-img
    :src="getAvatarCourseUrl(course?.course_image ?? '')"
    :alt="course?.course_name"
    class="w-full h-full"
  >
    <template v-slot:error>
      <v-img
        height="400px"
        width="500px"
        src="../../assets/default-course-avt.svg"
      ></v-img>
    </template>
  </v-img>
</template>

<script lang="ts" setup>
import { getAvatarCourseUrl } from "@/utils/functions/functions";
import { CourseDetailResponse } from "@/types/Course";
defineProps<{
  course: CourseDetailResponse | null;
}>();
</script>
