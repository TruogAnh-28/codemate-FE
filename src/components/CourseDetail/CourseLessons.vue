<template>
  <v-card class="p-6">
    <div v-for="lesson in lessons" :key="lesson.id" class="mb-6">
      <v-row class="mb-4">
        <v-col cols="12" md="8" class="border-b-2">
          <div class="font-bold text-xl">{{ lesson.name }}</div>
          <div class="text-gray-600">{{ lesson.description }}</div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="flex justify-center items-center border-b-2"
        >
          <!-- Tooltip for icon -->
          <v-tooltip bottom v-for="button in actionButtons" :key = button.index >
            <template v-slot:activator="{ props }">
              <v-btn
              variant="text"
                :icon="button.icon"
                :@click="() => button.function(button.arg(lesson))"
                v-bind="props"
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
import { Document, Lesson, CourseDetail} from "@/types/Course";

const props = defineProps<{
  lessons: Lesson[];
}>();



const showDocuments = (documentList: Document[] | string) => {
  if (Array.isArray(documentList)) {
    console.log("Showing documents for lesson:", documentList);
  } else {
    console.error("Invalid argument for showDocuments:", documentList);
  }
};

const bookmarkLesson = (lessonId: string | Document[]) => {
  if (typeof lessonId === "string") {
    console.log("Bookmark lesson:", lessonId);
  } else {
    console.error("Invalid argument for bookmarkLesson:", lessonId);
  }
};

const downloadDocuments = (lessonId: string | Document[]) => {
  if (typeof lessonId === "string") {
    console.log("Downloading documents for lesson:", lessonId);
  } else {
    console.error("Invalid argument for downloadDocuments:", lessonId);
  }
};

const openFeedbackModal = (lessonId: string | Document[]) => {
  if (typeof lessonId === "string") {
    console.log("Opening feedback modal for lesson:", lessonId);
  } else {
    console.error("Invalid argument for openFeedbackModal:", lessonId);
  }
};

const actionButtons = [
  {index: 0, icon: "mdi-file-document", function: showDocuments, arg: (lesson: Lesson) => lesson.documents, value:"Show Documents"},
  {index: 1, icon: "mdi-bookmark-outline", function: bookmarkLesson, arg: (lesson: Lesson) => lesson.id, value: "Bookmark Lesson"},
  {index: 2, icon: "mdi-download", function: downloadDocuments, arg: (lesson: Lesson) => lesson.id, value:"Download Documents"},
  {index: 3, icon: "mdi-comment-text-outline", function: openFeedbackModal, arg: (lesson: Lesson) => lesson.id, value: "Feedback Lesson"}
]
</script>

<style scoped>
/* Additional styling if needed */
</style>
