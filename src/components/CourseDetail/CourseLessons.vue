<template>
  <v-card class="p-6">
    <div v-for="lesson in lessons" :key="lesson.id" class="mb-6">
      <v-row class="mb-4">
        <v-col cols="12" md="8" class="border-b-2">
          <div class="font-bold text-xl">{{ lesson.name }}</div>
          <div class="text-text-tetiary">{{ lesson.description }}</div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="flex justify-center items-center border-b-2"
        >
          <!-- Tooltip for icon -->
          <v-tooltip bottom v-for="button in actionButtons" :key="button.index">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                variant="text"
                :icon="button.icon"
                @click="handleButtonClick(button, lesson)"
                v-bind="activatorProps"
              ></v-btn>
            </template>
            <span>{{ button.value }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { Document, Lesson } from "@/types/Course";

defineProps<{
  lessons: Lesson[];
}>();

// Handle action button clicks
const handleButtonClick = (button: any, lesson: Lesson) => {
  const arg = button.arg(lesson);
  button.function(arg);
};

const showDocuments = (documentList: Document[] | string) => {
  if (Array.isArray(documentList)) {
    console.log("Showing documents for lesson:", documentList);
  } else {
    console.error("Invalid argument for showDocuments:", documentList);
  }
};

const bookmarkLesson = (lessonId: string) => {
  console.log("Bookmark lesson:", lessonId);
};

const downloadDocuments = (lessonId: string) => {
  console.log("Downloading documents for lesson:", lessonId);
};

const openFeedbackModal = (lessonId: string) => {
  console.log("Opening feedback modal for lesson:", lessonId);
};

// Define action buttons array
const actionButtons = [
  { index: 0, icon: "mdi-file-document", function: showDocuments, arg: (lesson: Lesson) => lesson.documents, value: "Show Documents" },
  { index: 1, icon: "mdi-bookmark-outline", function: bookmarkLesson, arg: (lesson: Lesson) => lesson.id, value: "Bookmark Lesson" },
  { index: 2, icon: "mdi-download", function: downloadDocuments, arg: (lesson: Lesson) => lesson.id, value: "Download Documents" },
  { index: 3, icon: "mdi-comment-text-outline", function: openFeedbackModal, arg: (lesson: Lesson) => lesson.id, value: "Feedback Lesson" }
];
</script>

<style scoped>
/* Additional styling if needed */
</style>
