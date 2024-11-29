<template>
  <v-dialog
    :model-value="showModal"
    @update:model-value="$emit('update:show-modal', $event)"
    max-width="800"
    class="rounded-lg"
    :persistent="true"
  >
    <v-card class="p-6">
      <div class="d-flex justify-space-between align-center mb-6">
        <h2 class="text-body-large-1 font-weight-bold">
          Recommended Lessons for
          <span class="text-heading-4 text-secondary-variant">{{
            courseName
          }}</span>
        </h2>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="$emit('close')"
          class="text-body-small"
        ></v-btn>
      </div>
      <div v-if="loading" class="d-flex justify-center align-center pa-4">
        <v-progress-circular
          indeterminate
          size="50"
          color="primary"
        ></v-progress-circular>
      </div>

      <div v-else-if="error" class="text-center pa-4">
        <p class="text-error">{{ error }}</p>
        <v-btn color="primary" @click="fetchRecommendedLessons">Retry</v-btn>
      </div>

      <div v-else-if="recommendedLessons.length === 0" class="text-center pa-4">
        <p>No recommended lessons available at the moment.</p>
      </div>

      <div
        v-else
        v-for="lesson in recommendedLessons"
        :key="lesson.lesson_id"
        class="mb-8"
      >
        <v-row class="mb-4 m-0">
          <v-col cols="12" md="8" class="border-b-2 pb-4">
            <div class="font-bold text-body-large-1">{{ lesson.title }}</div>
            <div class="text-text-tetiary text-body-base-1">
              {{ lesson.description }}
            </div>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="flex justify-center items-center border-b-2 pb-4"
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
                  :aria-label="button.value"
                  :class="button.class"
                  class="btn-hover"
                ></v-btn>
              </template>
              <span>{{ button.value }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>

  <FeedbackLesson
    v-if="showFeedbackModal"
    :lessonId="selectedLessonId"
    :showModal="showFeedbackModal"
    @update:showModal="updateFeedbackModal"
    @feedback-submitted="handleFeedbackSubmitted"
  />
</template>

<script lang="ts" setup>
import { coursesService } from "@/services/courseslistServices";
import { User } from "@/constants/user";
import { CourseDetailResponse, GetRecommendedLessonsResponse } from "@/types/Course";
const props = defineProps<{
  showModal: boolean;
  course: CourseDetailResponse | null;
}>();

defineEmits<{
  "update:show-modal": [value: boolean];
  close: [];
}>();

const loading = ref(true);
const error = ref<string | null>(null);
const showFeedbackModal = ref(false);
const selectedLessonId = ref<string | undefined>(undefined);
const recommendedLessons = ref<GetRecommendedLessonsResponse[]>([]);
const courseName = ref<string>("");
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const router = useRouter();
const fetchRecommendedLessons = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await coursesService.getRecommendedLessons(
      showError,
      User.id,
      props.course?.course_id ?? ""
    );
    if (response) {
      recommendedLessons.value = response;
      courseName.value = response[0].course_name;
    } else {
      showError("Failed to fetch recommended lessons");
    }
  } catch (err) {
    error.value = "An error occurred while loading recommendations";
    console.error("Error fetching recommended lessons:", err);
  } finally {
    loading.value = false;
  }
};

const updateFeedbackModal = (value: boolean): void => {
  showFeedbackModal.value = value;
};

const openFeedbackModal = (lessonId: string): void => {
  selectedLessonId.value = lessonId;
  showFeedbackModal.value = true;
};

const handleFeedbackSubmitted = (feedbackData: {
  lessonId: string;
  feedback: string;
}): void => {
  console.log(
    "Feedback received for lesson ${feedbackData.lessonId}:, feedbackData.feedback"
  );
  showFeedbackModal.value = false;
  selectedLessonId.value = undefined;
};

const actionButtons = (recommendedLesson: GetRecommendedLessonsResponse) => {
  return [
    {
      index: 0,
      icon: recommendedLesson.bookmark
        ? "mdi-bookmark"
        : "mdi-bookmark-outline",
      value: recommendedLesson.bookmark
        ? "Unbookmark Lesson"
        : "Bookmark Lesson",
      class: recommendedLesson.bookmark ? "text-error" : "text-text-primary",
    },
    {
      index: 1,
      icon: "mdi-comment-text-outline",
      value: "Feedback Lesson",
      class: "text-text-primary",
    },
    {
      index: 2,
      icon: "mdi-information-outline",
      value: "View Details",
      class: "text-text-primary",
    },
  ];
};

const handleButtonClick = (
  button: any,
  recommendedLesson: GetRecommendedLessonsResponse
) => {
  switch (button.index) {
    case 0:
      bookmarkLesson(recommendedLesson);
      break;
    case 1:
      openFeedbackModal(recommendedLesson.lesson_id);
      break;
    case 2:
      router.push("/lessonRecommend/${recommendedLesson.lesson_id}");
      break;
    default:
      console.error("Invalid button index:", button.index);
  }
};

const bookmarkLesson = async (lesson: GetRecommendedLessonsResponse) => {
  const response = await coursesService.bookmarkLesson(
    showError,
    User.id,
    lesson.course_id,
    lesson.lesson_id
  );

  if (response?.valueOf) {
    lesson.bookmark = !lesson.bookmark;
    const message = lesson.bookmark
      ? "Lesson Bookmarked Successfully!"
      : "Lesson Unbookmarked Successfully!";
    showSuccess(message);
  } else {
    showError("Failed to bookmark lesson.");
  }
};

watch(
  () => props.showModal,
  (newValue: boolean) => {
    if (newValue) {
      fetchRecommendedLessons();
    }
  }
);

onMounted(() => {
  if (props.showModal) {
    fetchRecommendedLessons();
  }
});
</script>

<style scoped>
.v-row.m-0 {
  margin: 0 !important;
}

.v-dialog {
  margin: 24px;
}

.v-card {
  display: block;
  min-height: 200px;
  width: 100%;
}

.v-btn {
  transition: transform 0.3s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}

.btn-hover {
  transition: transform 0.2s ease-in-out;
}

.v-btn:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.v-tooltip {
  font-size: 14px;
}

.v-card {
  padding: 2rem;
}

.v-row.mb-4 {
  margin-bottom: 1.5rem;
}

.v-col.border-b-2 {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}
</style>
