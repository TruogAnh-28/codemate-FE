<template>
  <v-img
    :src="getAvatarCourseUrl(courseImage ?? '')"
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
import { CourseDetailResponse, GetCourseDetailProfessorResponse } from "@/types/Course";
const props = defineProps<{
  course: CourseDetailResponse | GetCourseDetailProfessorResponse | null;
}>();
const courseImage = computed(() => {
  if (!props.course) return null;
  return ("course_image" in props.course) ? props.course.course_image : props.course.course_image_url;
});
</script>
