<template>
  <v-row no-gutters align="center" class="p-6">
    <v-col cols="4" md="4" class="flex justify-center items-center pr-4">
      <div class="image-container">
        <v-img
            class="flex-shrink-0 course-image"
            width="300px"
            height="200px"
            :src="course.course_image"
            cover
         >
          <template v-slot:error>
            <CourseInitialAvatar :course-name="course.course_name"  />
          </template>
        </v-img>
    </div>
    </v-col>

    <v-col cols="8" md="8">
      <div class="text-heading-3 font-weight-bold mb-2">
        {{ course.course_name || "Course Not Available" }}
      </div>

      <v-row v-if="course" class="d-flex align-center">
        <CourseProgress v-if="isCourseDetail" :course="course as CourseDetailResponse" />
        <CourseDetails :course="course" />
      </v-row>
      <v-row v-else>
        <v-col>No course information available</v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { CourseDetailResponse, GetCourseDetailProfessorResponse } from "@/types/Course"

const props = defineProps<{
  course: CourseDetailResponse | GetCourseDetailProfessorResponse 
}>()

const isCourseDetail = computed(() => props.course !== null && 'course_percentage_complete' in props.course)
</script>
<style scoped>
.image-container {
  width: 300px;
  
  border-radius: 8px;
}
.image-container:hover .course-image {
  transform: scale(1.05);
}
</style>