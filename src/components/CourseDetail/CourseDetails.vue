<template>
  <v-col cols="12" md="6">
    <div class="d-flex align-center mb-2 text-body-small-2">
      <v-icon size="18" color="primary" class="mr-1">mdi-calendar</v-icon>
      <span v-if="course?.course_start_date !== '' && course?.course_end_date !== ''">
        {{ formatStart_EndDate(course?.course_start_date || "") }} to
        {{ formatStart_EndDate(course?.course_end_date || "") }}
      </span>
      <span v-else>N/A</span>
    </div>
    <div class="d-flex align-center mb-2 text-body-small-2">
      <v-icon size="18" color="primary" class="mr-1"
        >mdi-book-open-variant</v-icon
      >
      <span>{{ course?.course_courseID }}</span>
    </div>
    <div class="d-flex align-center mb-2 text-body-small-2">
      <v-icon size="18" color="primary" class="mr-1">mdi-account</v-icon>
      <span>Professor: {{ professor_information?.professor_name }}</span>
    </div>
  </v-col>
</template>

<script lang="ts" setup>
import { coursesService } from "@/services/courseslistServices";
import { CourseDetailResponse, ProfessorInformation, GetCourseDetailProfessorResponse } from "@/types/Course";
import { formatStart_EndDate } from "@/utils/functions/time";

const props = defineProps<{
  course: CourseDetailResponse | GetCourseDetailProfessorResponse | null;
}>();
const professor_information = ref<ProfessorInformation | null>(null);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const fetchProfessorInformation = async () => {
  if (props.course?.course_id) {
    const response = await coursesService.getProfessorForCourse(
      { showError, showSuccess },
      props.course?.course_id
    );
    if (response && "data" in response && response.data) {
      professor_information.value = response.data as ProfessorInformation;
      console.log(professor_information.value);
    }
  }
};
onMounted(() => {
  fetchProfessorInformation();
});
</script>
