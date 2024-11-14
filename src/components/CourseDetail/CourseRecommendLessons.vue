<template>
  <v-card class="p-6">
    <div v-for="lesson in recommendedLessons" :key="lesson.id" class="mb-6">
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
          <!-- Tooltip for each action button -->
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
import {
  CourseDetail,
  Document,
  Lesson,
  RecommendedLesson,
} from "@/types/Course";

// Props declaration
const props = defineProps<{
  course: CourseDetail;
}>();

// Function to get recommended lessons based on the recommendedLessons field
const recommendedLessons = computed(() => {
  const recommendedLessonIds = new Set(
    props.course.recommendedLessons.map((rl: RecommendedLesson) => rl.lessonId)
  );
  return props.course.lessons.filter((lesson: Lesson) =>
    recommendedLessonIds.has(lesson.id)
  );
});

// Function types for action buttons
type ActionButtonFunction = (arg: string) => void;

// Type definition for action buttons
interface ActionButton {
  index: number;
  icon: string;
  function: ActionButtonFunction;
  arg: (lesson: Lesson) => string;
  value: string;
}

const bookmarkLesson = (lessonId: string) => {
  console.log("Bookmark lesson:", lessonId);
};

const openFeedbackModal = (lessonId: string) => {
  console.log("Opening feedback modal for lesson:", lessonId);
};

const navigateToLessonDetails = (lessonId: string) => {
  console.log("Navigating to lesson details for lesson:", lessonId);
};

// Function to handle button clicks
const handleButtonClick = (button: ActionButton, lesson: Lesson) => {
  const arg = button.arg(lesson);
  button.function(arg);
};

// Update the action buttons array to ensure proper argument passing
const actionButtons: ActionButton[] = [
  {
    index: 1,
    icon: "mdi-bookmark-outline",
    function: bookmarkLesson,
    arg: (lesson: Lesson) => lesson.id,
    value: "Bookmark Lesson",
  },
  {
    index: 3,
    icon: "mdi-comment-text-outline",
    function: openFeedbackModal,
    arg: (lesson: Lesson) => lesson.id,
    value: "Feedback Lesson",
  },
  {
    index: 4,
    icon: "mdi-information-outline",
    function: navigateToLessonDetails,
    arg: (lesson: Lesson) => lesson.id,
    value: "View Details",
  },
];
</script>

<style scoped>
/* Additional styling if needed */
</style>
