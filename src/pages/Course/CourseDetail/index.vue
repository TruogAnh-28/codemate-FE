<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col cols="12" md="8">
        <CourseMainContent
          :course-info="getCourseInformationFromCoursesListPage"
          :course="course"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
          :tabs="tabs"
        />
      </v-col>
      <v-col cols="12" md="4">
        <CourseSidebar
          :course="course"
          :dialog="dialog"
          @open-recommendation="openRecommendationModal"
          @update:dialog="dialog = $event"
          @submit-goal="handleGoalSubmission"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useCourseStore } from "@/stores/courseStore";
import { CourseDetailResponse } from "@/types/Course";
import { coursesService } from "@/services/courseslistServices";
import { User } from "@/constants/user";

const store = useCourseStore();
const getCourseInformationFromCoursesListPage = computed(
  () => store.getCourseDetails
);
const course = ref<CourseDetailResponse | null>(null);
const activeTab = ref("description");
const dialog = ref(false);
const showError = inject("showError") as (message: string) => void;

const tabs = [
  {
    label: "Description",
    value: "description",
    tooltip: `This is the Learning Outcomes which uploaded by your Professor: ${getCourseInformationFromCoursesListPage.value?.professor.professor_name}`,
  },
  {
    label: "Lessons",
    value: "lessons",
    tooltip: `Course's lessons with documents which uploaded by your Professor: ${getCourseInformationFromCoursesListPage.value?.professor.professor_name}`,
  },
  {
    label: "Exercises",
    value: "exercises",
    tooltip: `Course's exercises which uploaded by your Professor:  ${getCourseInformationFromCoursesListPage.value?.professor.professor_name}`,
  },
];

const fetchCourseDetail = async () => {
  const response = (await coursesService.fetchCourseDetail(
    showError,
    User.course_id,
    User.id
  )) as CourseDetailResponse;
  if (response) {
    course.value = response;
  }
};

const openRecommendationModal = () => {
  dialog.value = true;
};

const handleGoalSubmission = (goal: string) => {
  console.log("Learning Goal Submitted:", goal);
  dialog.value = false;
};

onMounted(() => {
  store.loadCourseDetails();
  fetchCourseDetail();
});
</script>
