<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col cols="12" md="8">
        <CourseMainContent
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
import { CourseDetailResponse } from "@/types/Course";
import { coursesService } from "@/services/courseslistServices";
import { User } from "@/constants/user";
import { Tab } from "@/components/CourseDetail/CourseMainContent.vue";

const props = defineProps<{
  id: string;
}>();
const id = props.id;
const course = ref<CourseDetailResponse | null>(null);
const activeTab = ref("description");
const dialog = ref(false);
const showError = inject("showError") as (message: string) => void;

const tabs = ref<Tab[]>([
  {
    label: "Description",
    value: "description",
    tooltip: "Loading professor's name...",
  },
  {
    label: "Lessons",
    value: "lessons",
    tooltip: "Loading professor's name...",
  },
  {
    label: "Exercises",
    value: "exercises",
    tooltip: "Loading professor's name...",
  },
]);

const fetchCourseDetail = async () => {
  const response = (await coursesService.fetchCourseDetail(
    showError,
    id,
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

watch(
  () => course.value,
  (newCourse: CourseDetailResponse | null) => {
    if (newCourse && newCourse.course_professor) {
      const professorName = newCourse.course_professor.professor_name;
      tabs.value = [
        {
          label: "Description",
          value: "description",
          tooltip: `This is the Learning Outcomes uploaded by your Professor: ${professorName}`,
        },
        {
          label: "Lessons",
          value: "lessons",
          tooltip: `Course's lessons with documents uploaded by your Professor: ${professorName}`,
        },
        {
          label: "Exercises",
          value: "exercises",
          tooltip: `Course's exercises uploaded by your Professor: ${professorName}`,
        },
      ];
    }
  }
);

onMounted(() => {
  fetchCourseDetail();
});
</script>
