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
          @open-course-recommendations="openCourseRecommendationsModal"
          @update:dialog="dialog = $event"
          @submit-goal="handleGoalSubmission"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { CourseDetailResponse, ProfessorInformation } from "@/types/Course";
import { coursesService } from "@/services/courseslistServices";
import { Tab } from "@/components/CourseDetail/CourseMainContent.vue";

const props = defineProps<{
  id: string;
}>();
const id = props.id;
const course = ref<CourseDetailResponse | null>(null);
const professor_information = ref<ProfessorInformation | null>(null);
const activeTab = ref("description");
const dialog = ref(false);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

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
  const response = await coursesService.fetchCourseDetail(
    { showError, showSuccess },
    id
  );
  if (response && "data" in response && response.data) {
    course.value = response.data as CourseDetailResponse;
  }
};

const fetchProfessorInformation = async () => {
  const response = await coursesService.getProfessorForCourse(
    { showError, showSuccess },
    id
  );
  if (response) {
    professor_information.value = response;
  }
};

const openRecommendationModal = () => {
  dialog.value = true;
};

const openCourseRecommendationsModal = () => {

};

const handleGoalSubmission = (goal: string) => {
  console.log("Learning Goal Submitted:", goal);
  dialog.value = false;
};

watch(
  () => professor_information.value,
  (professor_information_new: ProfessorInformation | null) => {
    if (professor_information_new && professor_information_new.professor_name) {
      const professorName = professor_information_new.professor_name;
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
  fetchProfessorInformation();
});
</script>
