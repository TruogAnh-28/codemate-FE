<template>
  <v-card class="p-6" v-if="lessons.length > 0">
    <div v-for="lesson in lessons" :key="lesson.id" class="mb-6">
      <v-row class="mb-4 m-0">
        <v-col cols="12" md="8" class="border-b-2">
          <div class="font-bold text-body-large-1">{{ lesson.title }}</div>
          <div class="text-text-tetiary text-body-base-1">
            {{ lesson.description }}
          </div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="flex justify-center items-center border-b-2"
        >
          <v-tooltip
            bottom
            v-for="button in getActionButtons(lesson)"
            :key="button.index"
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                variant="text"
                :icon="button.icon"
                @click="handleButtonClick(button, lesson)"
                v-bind="activatorProps"
                :class="button.class"
              ></v-btn>
            </template>
            <span>{{ button.value }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>
  </v-card>
  <v-card v-else>
    <v-card-title class="text-heading-4 font-semibold">Lessons:</v-card-title>
    <v-card-text>No lessons available</v-card-text>
  </v-card>

  <!-- Only show feedback modal for students -->
  <FeedbackLesson
    v-if="isStudent"
    :lessonId="selectedLessonId"
    :showModal="showFeedbackModal"
    @update:showModal="updateFeedbackModal"
    @feedback-submitted="handleFeedbackSubmitted"
  />

  <ShowDocumentsModal
    :showModal="showDocumentsModal"
    @update:showModal="showDocumentsModal = $event"
    :documents="selectedDocuments"
  />
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import {
  DocumentOriginalResponse,
  LessonOriginalResponse,
  CourseDetailResponse,
  GetDocumentsProfessor,
  GetLessonProfessor,
  GetCourseDetailProfessorResponse
} from "@/types/Course";
import { coursesService } from "@/services/courseslistServices";

// Props type union to handle both course types
type CourseProps = {
  course: CourseDetailResponse | GetCourseDetailProfessorResponse;
};

const props = defineProps<CourseProps>();

// Auth and role
const role = computed(() => useAuthStore().getUser().role);
const isStudent = computed(() => role.value === 'student');
const isProfessor = computed(() => role.value === 'professor');

// Refs
const showDocumentsModal = ref(false);
const showFeedbackModal = ref(false);
const selectedLessonId = ref<string | undefined>(undefined);
const selectedDocuments = ref<DocumentOriginalResponse[] | GetDocumentsProfessor[]>([]);
const lessons = ref<LessonOriginalResponse[] | GetLessonProfessor[]>([]);

// Injected utilities
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Methods
const handleButtonClick = (button: any, lesson: any) => {
  switch (button.index) {
    case 0:
      showDocuments(isStudent ? lesson.documents : lesson.documents);
      break;
    case 1:
      downloadDocuments(lesson.id);
      break;
    case 2:
      if (isStudent) {
        openFeedbackModal(lesson.id);
      }
      break;
    default:
      console.error("Invalid button index:", button.index);
  }
};

const showDocuments = (documentList: any[] | string) => {
  if (Array.isArray(documentList)) {
    selectedDocuments.value = documentList;
    showDocumentsModal.value = true;
  } else {
    console.error("Invalid argument for showDocuments:", documentList);
  }
};

const fetchLessons = async () => {
  if (isProfessor.value && 'lessons' in props.course) {
    lessons.value = props.course.lessons;
  } else if (isStudent.value) {
    const response = await coursesService.getLessonsForCourse(
      { showError, showSuccess },
      props.course.course_id
    );
    if (response) {
      lessons.value = response;
    }
  }
};

const downloadDocuments = (lessonId: string) => {
  console.log("Downloading documents for lesson:", lessonId);
};

const updateFeedbackModal = (value: boolean): void => {
  showFeedbackModal.value = value;
};

const openFeedbackModal = (lessonId: string): void => {
  selectedLessonId.value = lessonId;
  showFeedbackModal.value = true;
};

const handleFeedbackSubmitted = (feedbackData: { lessonId: string; feedback: string }): void => {
  console.log(
    `Feedback received for lesson ${feedbackData.lessonId}:`,
    feedbackData.feedback
  );
  showFeedbackModal.value = false;
  selectedLessonId.value = undefined;
};

const getActionButtons = (lesson: any) => {
  const baseButtons = [
    {
      index: 0,
      icon: "mdi-file-document",
      value: "Show Documents",
      class: "text-text-primary",
    },
    {
      index: 1,
      icon: "mdi-download",
      value: "Download Documents",
      class: "text-text-primary",
    }
  ];

  // Add feedback button only for students
  if (isStudent.value) {
    baseButtons.push({
      index: 2,
      icon: "mdi-comment-text-outline",
      value: "Feedback Lesson",
      class: "text-text-primary",
    });
  }
  else {
    baseButtons.push({
      index: 2,
      icon: "mdi-pencil",
      value: "Feedback Lesson",
      class: "text-text-primary",
    });
  }

  return baseButtons;
};

onMounted(() => {
  fetchLessons();
});
</script>

<style scoped>
.v-row.m-0 {
  margin: 0 !important;
}
</style>