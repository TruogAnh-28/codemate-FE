<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col cols="12" md="8">
        <!-- Add the CourseDetailActions component -->
        <CourseDetailActionsProfessor
          v-if="course"
          :courseId="id"
          :courseName="course.course_name"
          :course_outcomes="course.course_learning_outcomes"
          @update:course="fetchCourseDetail"
        />

        <CourseMainContent
          :course="course"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
          @refreshCourse="fetchCourseDetail"
          :tabs="tabs"
        />
      </v-col>
      <v-col cols="12" md="4">
        <ProgressStatsProfessor v-if="course" :course="course" />

        <!-- Add the new StudentList component -->
        <StudentsList :students="students" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { GetCourseDetailProfessorResponse, ProfessorInformation } from "@/types/Course";
import { coursesService as professorCoursesService } from "@/services/Professor/CourseServices";
import { coursesService } from "@/services/courseslistServices";
import { Tab } from "@/components/CourseDetail/CourseMainContent.vue";
import { StudentOfCourseListModal } from "@/types/Course";

const props = defineProps<{
  id: string;
}>();

const course = ref<GetCourseDetailProfessorResponse | null>(null);
const professor_information = ref<ProfessorInformation | null>(null);
const students = ref<StudentOfCourseListModal[]>();
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
  console.log("Fetching course details...");
  const response = await professorCoursesService.fetchCourseDetail(
    { showError, showSuccess },
    props.id
  );
  if (response && "data" in response && response.data) {
    console.log("Course details fetched successfully");
    course.value = response.data as GetCourseDetailProfessorResponse;
  }
};

const fetchProfessorInformation = async () => {
  const response = await professorCoursesService.getProfessorForCourse(
    { showError, showSuccess },
    props.id
  );
  if (response) {
    professor_information.value = response;
  }
};

const fetchStudents = async () => {
  const response = await coursesService.getStudentsForCourse(
    { showError, showSuccess },
    props.id
  );
  if (response && "data" in response && response.data) {
    students.value = response.data as StudentOfCourseListModal[];
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
  fetchStudents();
});
</script>