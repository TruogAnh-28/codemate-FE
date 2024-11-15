<template>
  <v-card class="p-6">
    <div v-for="lesson in lessons" :key="lesson.id" class="mb-6">
      <v-row class="mb-4 m-0">
        <v-col cols="12" md="8" class="border-b-2">
          <div class="font-bold text-body-large-1">{{ lesson.name }}</div>
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
            v-for="button in actionButtons(lesson)"
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

  <FeedbackLesson
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
import { Lesson, Document } from "@/types/Course";

defineProps<{
  lessons: Lesson[];
}>();
interface FeedbackData {
  lessonId: string;
  feedback: string;
}

const showDocumentsModal = ref(false);
const showFeedbackModal = ref(false);
const selectedLessonId = ref<string | undefined>(undefined);
const selectedDocuments = ref<Document[]>([]);

const handleButtonClick = (button: any, lesson: Lesson) => {
  switch (button.index) {
    case 0:
      showDocuments(lesson.documents);
      break;
    case 1:
      handleBookmark(lesson);
      break;
    case 2:
      downloadDocuments(lesson.id);
      break;
    case 3:
      openFeedbackModal(lesson.id);
      break;
    default:
      console.error("Invalid button index:", button.index);
  }
};

// Action functions
const showDocuments = (documentList: Document[] | string) => {
  if (Array.isArray(documentList)) {
    selectedDocuments.value = documentList;
    showDocumentsModal.value = true;
  } else {
    console.error("Invalid argument for showDocuments:", documentList);
  }
};

const handleBookmark = (lesson: Lesson) => {
  lesson.bookmarked = !lesson.bookmarked;
  console.log(
    `${lesson.bookmarked ? "Bookmarked" : "Unbookmarked"} lesson:`,
    lesson.id
  );
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

const handleFeedbackSubmitted = (feedbackData: FeedbackData): void => {
  console.log(
    `Feedback received for lesson ${feedbackData.lessonId}:`,
    feedbackData.feedback
  );
  showFeedbackModal.value = false;
  selectedLessonId.value = undefined;
};

const actionButtons = (lesson: Lesson) => [
  {
    index: 0,
    icon: "mdi-file-document",
    value: "Show Documents",
    class: "text-text-primary",
  },
  {
    index: 1,
    icon: lesson.bookmarked ? "mdi-bookmark" : "mdi-bookmark-outline",
    value: lesson.bookmarked ? "Unbookmark Lesson" : "Bookmark Lesson",
    class: lesson.bookmarked ? "text-error" : "text-text-primary",
  },
  {
    index: 2,
    icon: "mdi-download",
    value: "Download Documents",
    class: "text-text-primary",
  },
  {
    index: 3,
    icon: "mdi-comment-text-outline",
    value: "Feedback Lesson",
    class: "text-text-primary",
  },
];
</script>

<style scoped>
.v-row.m-0 {
  margin: 0 !important;
}
</style>
