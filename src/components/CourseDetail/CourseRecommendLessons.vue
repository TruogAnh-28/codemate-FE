<template>
  <v-dialog
    :model-value="showModal"
    @update:model-value="$emit('update:show-modal', $event)"
    max-width="800"
    class="rounded-lg"
  >
    <v-card class="pa-6">
      <div class="d-flex justify-space-between align-center mb-6">
        <h2 class="text-body-large-1 font-weight-bold">
          Learning Path for
          <span class="text-heading-4 text-secondary-variant">
            {{ props.course?.course_name }}
          </span>
          with the goal is: <span class="text-body-large-medium text-secondary">{{ student_goal }}</span>
        </h2>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeModal()"
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

      <div v-else-if="orderedLessons.length === 0" class="text-center pa-4">
        <p>No recommended lessons available at the moment.</p>
      </div>

      <div v-else class="learning-timeline">
        <v-timeline align="start" side="end">
          <v-timeline-item
            v-for="(lesson, index) in orderedLessons"
            :key="lesson.lesson_id"
            :dot-color="getDotColor(index)"
            fill-dot
            class="mb-6"
          >
            <template v-slot:icon>
              <v-icon size="20" color="white">
                mdi-numeric-{{ index + 1 }}-circle
              </v-icon>
            </template>

            <v-card class="elevation-2 pa-6 pb-6">
              <div class="d-flex justify-space-between align-center mb-2">
                <h3 class="lesson-title text-h6 font-weight-medium">
                  {{ lesson.lesson_title }}
                </h3>
                <v-chip
                  :color="getStatusColor(lesson)"
                  size="medium"
                  class="ml-2 text-body-small-bold flex items-center px-8"
                >
                  {{ getStatusText(lesson) }}
                </v-chip>
              </div>

              <div class="d-flex align-center mb-3">
                <v-icon size="small" class="mr-1">mdi-calendar-range</v-icon>
                <span class="text-body-2">
                  {{ formatDate(lesson.start_date) }} - {{ formatDate(lesson.end_date) }}
                </span>
              </div>

              <v-progress-linear
                :model-value="calculateProgress(lesson)"
                height="8"
                rounded
                color="primary"
                class="mb-3"
              ></v-progress-linear>

              <div class="lesson-description text-body-2 text-grey-darken-1 mb-3">
                {{ lesson.explain }}
              </div>
              
              <div class="lesson-actions">
                <v-tooltip 
                  v-for="button in actionButtons(lesson)" 
                  :key="button.index" 
                  bottom
                >
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      variant="text"
                      :icon="button.icon"
                      @click="handleButtonClick(button, lesson)"
                      v-bind="activatorProps"
                      :aria-label="button.value"
                      :class="button.class"
                      class="btn-hover mr-2"
                    ></v-btn>
                  </template>
                  <span>{{ button.value }}</span>
                </v-tooltip>
              </div>
            </v-card>
          </v-timeline-item>
        </v-timeline>
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
import { format as dateFnsFormat, parseISO } from 'date-fns';
import { CourseDetailResponse, GetRecommendedLessonsResponse } from "@/types/Course";
const props = defineProps<{
  showModal: boolean;
  course: CourseDetailResponse | null;
}>();

const emit = defineEmits<{
  "update:show-modal": [value: boolean];
  close: [];
}>();

const closeModal = () => {
  emit("update:show-modal", false);
  emit("close");
};
const loading = ref(true);
const error = ref<string | null>(null);
const showFeedbackModal = ref(false);
const selectedLessonId = ref<string | undefined>(undefined);
const recommendedLessons = ref<GetRecommendedLessonsResponse[]>([]);
const student_goal = ref<string | null>(null);
const courseName = props.course?.course_name;
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const router = useRouter();
const fetchRecommendedLessons = async () => {
  try {
    loading.value = true;
    error.value = null;
    if (props.course?.course_id) {
      const response = await coursesService.getRecommendedLessons(
        { showError, showSuccess },
        props.course.course_id
      );
      if (response && "data" in response && response.data) {
        recommendedLessons.value = response.data.lessons;
        student_goal.value = response.data.student_goal;
      } else {
        showError("Failed to fetch recommended lessons");
      }
    }
  } catch (err) {
    error.value = "You haven't had any learning paths for this course yet.";
  } finally {
    loading.value = false;
  }
};

const orderedLessons = computed(() => {
  // Create a copy of recommendedLessons and sort by the 'order' field
  return [...recommendedLessons.value].sort((a, b) => a.order - b.order)
})

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
    `Feedback received for lesson ${feedbackData.lessonId}:,${feedbackData.feedback}`
  );
  showFeedbackModal.value = false;
  selectedLessonId.value = undefined;
};

const actionButtons = (recommendedLesson: GetRecommendedLessonsResponse) => {
  return [
    {
      index: 0,
      icon: recommendedLesson.bookmark ? "mdi-bookmark" : "mdi-bookmark-outline",
      value: recommendedLesson.bookmark ? "Unbookmark Lesson" : "Bookmark Lesson",
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
const getDotColor = (index: number): string => {
  return index === 0 ? 'primary' : 'grey'
}

const getStatusColor = (lesson: GetRecommendedLessonsResponse): string => {
  const today = new Date("2025-06-20")
  const start = new Date(lesson.start_date)
  const end = new Date(lesson.end_date)
  
  if (today < start) return 'grey'
  if (today > end) return 'success'
  return 'primary'
}

const getStatusText = (lesson: GetRecommendedLessonsResponse): string => {
  const today = new Date("2025-06-20")
  const start = new Date(lesson.start_date)
  const end = new Date(lesson.end_date)
  
  if (today < start) return 'Upcoming'
  if (today > end) return 'Completed'
  return 'In Progress'
}

const calculateProgress = (lesson: GetRecommendedLessonsResponse): number => {
  const today = new Date("2025-06-20")
  const start = new Date(lesson.start_date)
  const end = new Date(lesson.end_date)
  
  if (today <= start) return 0
  if (today >= end) return 100
  
  const total = end.getTime() - start.getTime()
  const progress = today.getTime() - start.getTime()
  return (progress / total) * 100
}
const handleButtonClick = (
  button: any,
  recommendedLesson: GetRecommendedLessonsResponse
) => {
  switch (button.index) {
    case 1:
      openFeedbackModal(recommendedLesson.id);
      break;
    case 2:
      router.push({
        path: `/lessonRecommend/${recommendedLesson.id}`,
        query: { courseName: courseName },
      });

      break;
    default:
      console.error("Invalid button index:", button.index);
  }
};

const formatDate = (dateString: string) => {
  try {
    return dateFnsFormat(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return dateString; // Fallback to original string if parsing fails
  }
};

// const bookmarkLesson = async (lesson: GetRecommendedLessonsResponse) => {
//   const response = await coursesService.bookmarkLesson(
//     showError,
//     User.id,
//     lesson.course_id,
//     lesson.lesson_id
//   );

//   if (response?.valueOf) {
//     lesson.bookmark = !lesson.bookmark;
//     const message = lesson.bookmark
//       ? "Lesson Bookmarked Successfully!"
//       : "Lesson Unbookmarked Successfully!";
//     showSuccess(message);
//   } else {
//     showError("Failed to bookmark lesson.");
//   }
// };

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

// Close the dialog
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
.timeline-container {
  position: relative;
  padding: 20px 0;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
  padding-left: 40px;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-content {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  position: relative;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.lesson-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.lesson-dates {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.lesson-description {
  margin-bottom: 10px;
}

.lesson-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
