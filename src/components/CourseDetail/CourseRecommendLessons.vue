<template>
  <v-card class="p-6">
    <div v-for="lesson in recommendedLessons" :key="lesson.id" class="mb-6">
      <v-row class="mb-4">
        <v-col cols="12" md="8" class="border-b-2">
          <div class="font-bold text-xl">{{ lesson.name }}</div>
          <div class="text-text-tetiary">{{ lesson.description }}</div>
        </v-col>
        <v-col cols="12" md="4" class="flex justify-center items-center border-b-2">
          <!-- Tooltip for each action button -->
          <v-tooltip bottom v-for="button in actionButtons(lesson)" :key="button.index">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                variant="text"
                :icon="button.icon"
                @click="handleButtonClick(button, lesson)"
                v-bind="activatorProps"
                :aria-label="button.value"
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
</template>

<script lang="ts" setup>
import { CourseDetail, Lesson, RecommendedLesson } from '@/types/Course';

const props = defineProps<{
  course: CourseDetail;
}>();

const showFeedbackModal = ref(false);
const selectedLessonId = ref<string | undefined>(undefined);

const updateFeedbackModal = (value: boolean): void => {
  showFeedbackModal.value = value;
};

const openFeedbackModal = (lessonId: string): void => {
  selectedLessonId.value = lessonId;
  showFeedbackModal.value = true;
};

const handleFeedbackSubmitted = (feedbackData: { lessonId: string; feedback: string }): void => {
  console.log(`Feedback received for lesson ${feedbackData.lessonId}:`, feedbackData.feedback);
  showFeedbackModal.value = false;
  selectedLessonId.value = undefined;
};

const recommendedLessons = computed(() => {
  const recommendedLessonIds = new Set(
    props.course.recommendedLessons.map((rl: RecommendedLesson) => rl.lessonId)
  );
  return props.course.lessons.filter((lesson: Lesson) =>
    recommendedLessonIds.has(lesson.id)
  );
});

const actionButtons = (lesson: Lesson) => {
  const recommendedLesson = props.course.recommendedLessons.find(
    (rl: RecommendedLesson) => rl.lessonId === lesson.id
  );

  if (!recommendedLesson) return [];

  return [
    {
      index: 0,
      icon: recommendedLesson.bookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline',
      value: recommendedLesson.bookmarked ? 'Unbookmark Lesson' : 'Bookmark Lesson',
      class: recommendedLesson.bookmarked ? 'text-error' : "text-text-primary",
    },
    {
      index: 1,
      icon: 'mdi-comment-text-outline',
      value: 'Feedback Lesson',
      class: "text-text-primary",
    },
    {
      index: 2,
      icon: 'mdi-information-outline',
      value: 'View Details',
      class: "text-text-primary",
    },
  ];
};

const handleButtonClick = (button: any, lesson: Lesson) => {
  const recommendedLesson = props.course.recommendedLessons.find(
    (rl: RecommendedLesson) => rl.lessonId === lesson.id
  );

  if (!recommendedLesson) {
    console.error('No recommended lesson found for this lesson');
    return;
  }

  switch (button.index) {
    case 0:
      recommendedLesson.bookmarked = !recommendedLesson.bookmarked;
      console.log(`${recommendedLesson.bookmarked ? 'Bookmarked' : 'Unbookmarked'} lesson:`, lesson.id);
      break;
    case 1:
      openFeedbackModal(lesson.id);
      break;
    case 2:
      console.log('Navigating to lesson details for lesson:', lesson.id);
      break;
    default:
      console.error('Invalid button index:', button.index);
  }
};
</script>
