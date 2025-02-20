<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col cols="12" md="8">
        <!-- Add the CourseDetailActions component -->
        <CourseDetailActionsProfessor
          v-if="course"
          :courseId="id"
          :courseName="course.course_name"
          @update:course="fetchCourseDetail"
        />
        
        <CourseMainContent
          :course="course"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
          :tabs="tabs"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, watch } from 'vue';
import { GetCourseDetailProfessorResponse, ProfessorInformation } from "@/types/Course";
import { coursesService } from "@/services/Professor/CourseServices";
import { Tab } from "@/components/CourseDetail/CourseMainContent.vue";
import CourseDetailActionsProfessor from '@/components/CourseDetail/CourseDetailActionsProfessor.vue';

const props = defineProps<{
  id: string;
}>();

const course = ref<GetCourseDetailProfessorResponse | null>(null);
const professor_information = ref<ProfessorInformation | null>(null);
const activeTab = ref("description");
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
    props.id
  );
  if (response && "data" in response && response.data) {
    course.value = response.data as GetCourseDetailProfessorResponse;
  }
};

const fetchProfessorInformation = async () => {
  const response = await coursesService.getProfessorForCourse(
    { showError, showSuccess },
    props.id
  );
  if (response) {
    professor_information.value = response;
  }
};

watch(
  () => professor_information.value,
  (professor_information_new: ProfessorInformation | null) => {
    if (!professor_information_new?.professor_name) return;

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
  },
  { immediate: true }
);

onMounted(() => {
  fetchCourseDetail();
  fetchProfessorInformation();
});
</script>