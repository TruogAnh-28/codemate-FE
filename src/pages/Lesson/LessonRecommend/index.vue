<template>
  <v-container fluid class="px-12" v-if="lesson">
    <!-- Breadcrumbs -->
    <v-breadcrumbs
      class="ma-0 pa-0 mb-4"
      :items="breadcrumbsStore.breadcrumbs"
      divider="/"
    ></v-breadcrumbs>

    <!-- Main Header Card -->
    <v-card class="border-card mb-6 overflow-hidden" elevation="3">
      <div class="card-header pa-6 d-flex align-center">
        <v-icon color="primary" size="x-large" class="mr-4"
          >mdi-book-education-outline</v-icon
        >
        <div>
          <h2 class="text-h5 font-weight-bold">{{ lesson.name }}</h2>
          <p class="text-subtitle-2 text-medium-emphasis mb-0">
            {{ lesson.modules.length }} modules to complete
          </p>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          <v-chip
            class="px-4 py-2 mr-4"
            :color="renderStatusLabel(lesson.status)"
            prepend-icon="mdi-checkbox-marked-circle"
            elevation="1"
          >
            {{ lesson.status }}
          </v-chip>
          <!-- New Analyst Button -->
          <v-btn
            color="primary"
            variant="tonal"
            class="text-none rounded-lg"
            prepend-icon="mdi-chart-bar"
            @click="showAnalystModal = true"
          >
            View Analysis
          </v-btn>
          <!-- Feedback Button -->
          <v-btn
            color="error"
            variant="tonal"
            class="text-none rounded-lg ml-4"
            prepend-icon="mdi-comment-text-outline"
            @click="openFeedbackModal(lesson.name)"
          >
            Feedback
          </v-btn>
        </div>
      </div>

      <!-- Add a part to display start date, end date and duration notes of lesson  -->
      <v-divider></v-divider>
      <v-card-text class="px-6 pt-4 pb-6">
        <div class="d-flex align-center mb-2">
          <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
          <h3 class="text-subtitle-1 font-weight-bold mb-0">Expected Time</h3>
        </div>
        <v-sheet rounded="lg" elevation="0" class="pa-4 bg-grey-lighten-4">
          <p class="text-body-large-bold mb-0">
            Start Date:
            <span class="text-secondary">{{ lesson.start_date }}</span>
          </p>
          <p class="text-body-large-bold mb-0">
            End Date: <span class="text-secondary">{{ lesson.end_date }}</span>
          </p>
          <p class="text-body-large-medium mb-0 text-secondary-variant">
            {{ lesson.duration_notes }}
          </p>
        </v-sheet>
      </v-card-text>

      <v-card-text class="px-6 pt-4 pb-6">
        <v-row>
          <v-col cols="6">
            <!-- Recommend Section -->
            <div class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2"
                  >mdi-lightbulb-outline</v-icon
                >
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Recommend</h3>
              </div>
              <v-sheet
                rounded="lg"
                elevation="0"
                class="pa-4 bg-grey-lighten-4 border-left-primary"
              >
                <p class="text-body-1 mb-0">{{ lesson.recommend_content }}</p>
              </v-sheet>
            </div>

            <!-- Explain Section -->
            <div>
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2"
                  >mdi-information-outline</v-icon
                >
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Explain</h3>
              </div>
              <v-sheet
                rounded="lg"
                elevation="0"
                class="pa-4 bg-grey-lighten-4"
              >
                <p class="text-body-1 mb-0">{{ lesson.explain }}</p>
              </v-sheet>
            </div>
          </v-col>

          <!-- Learning Outcomes Section - Improved to show all content -->
          <v-col cols="6">
            <div class="d-flex align-center mb-2">
              <v-icon color="error" class="mr-2"
                >mdi-certificate-outline</v-icon
              >
              <h3 class="text-subtitle-1 font-weight-bold mb-0 text-error">
                Learning Outcomes
              </h3>
            </div>
            <v-sheet
              rounded="lg"
              elevation="1"
              class="pa-4 bg-error-lighten-5 border-left-error learning-outcomes-sheet"
            >
              <v-list density="compact" class="bg-transparent pa-0">
                <v-list-item
                  v-for="(outcome, index) in parsedLearningOutcomes(
                    lesson.learning_outcomes
                  )"
                  :key="index"
                  prepend-icon="mdi-check-circle"
                  class="px-0 py-1"
                  :class="{
                    'mb-2':
                      index !==
                      parsedLearningOutcomes(lesson.learning_outcomes).length -
                        1,
                  }"
                >
                  <v-list-item-title
                    class="text-body-1 learning-outcome-text"
                    >{{ outcome }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Modules Section -->
    <!-- Modules Section -->
    <div class="mb-4 d-flex align-center">
      <v-icon color="primary" size="large" class="mr-2">mdi-view-grid-outline</v-icon>
      <h2 class="text-h5 font-weight-bold mb-0">Modules</h2>
    </div>

    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(module, index) in lesson.modules"
        :key="module.module_id"
      >
        <v-card
          @click="openDialog(module)"
          class="module-card rounded-xl border-card h-100"
          elevation="2"
        >
          <div class="module-header pa-4">
            <div class="d-flex align-center">
              <v-avatar
                :color="`primary-${(index % 3) + 1}`"
                class="mr-3"
                size="42"
              >
                <span class="text-h6 font-weight-bold white--text">{{
                  index + 1
                }}</span>
              </v-avatar>
              <v-chip
                size="small"
                label
                color="primary"
                variant="outlined"
                class="ml-auto"
              >
                Module
              </v-chip>
            </div>
          </div>

          <v-card-text class="pa-4">
            <h3 class="text-subtitle-1 font-weight-medium mb-2">
              {{ module.title }}
            </h3>
            <div class="d-flex align-center mb-2">
              <v-progress-linear
                v-if="module.progress !== undefined"
                color="primary"
                :model-value="module.progress"
                height="6"
                rounded
                class="mr-2"
              ></v-progress-linear>
              <span class="text-caption text-medium-emphasis">{{ module.progress }}% </span>
            </div>
            <!-- Display module objectives if available -->
            <div v-if="module.objectives && module.objectives.length > 0" class="mt-2">
              <div class="text-caption font-weight-medium text-primary mb-1">
                Objectives:
              </div>
              <div class="text-caption text-medium-emphasis mb-1" v-for="(objective, objIndex) in module.objectives.slice(0, 3)" :key="objIndex">
                • {{ objective }}
              </div>
              <div v-if="module.objectives.length > 3" class="text-caption text-primary">
                +{{ module.objectives.length - 3 }} more
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0">
            <v-btn
              :to="`/lessonRecommend/${lessonId}/module/${module.module_id}/Quiz`"
              color="primary"
              variant="tonal"
              class="text-none rounded-lg"
              block
              prepend-icon="mdi-play-circle-outline"
              @click="addActivity(module.title)"
            >
              Start Module
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modified RecommendLessonAnalyst with v-model -->
    <RecommendLessonAnalyst
      :recommend_lesson_id="lessonId"
      v-model="showAnalystModal"
      @close="handleModalClose"
      @proceed="handleModalClose"
      @review="handleModalClose"
      @repeat="handleModalClose"
    />
    <FeedbackCard
      @open-feedback="openFeedbackModal"
      type="course"
      :courseId="getCourseId(courseStore.courseDetails)"
      ref="feedbackCardRef"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { lessonsService } from "@/services/recommendLesson";
import { Lesson, Module } from "@/types/Lesson";
import { renderStatusLabel } from "@/utils/functions/render";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useCourseStore } from "@/stores/courseStore";
import { useTimeSpentStore } from "@/stores/timeSpentStore";
import FeedbackCard from "@/components/Dashboard/FeedbackCard.vue";
import { CourseDetailResponse, CoursesListResponse } from "@/types/Course";
import { dashboardService } from "@/services/dashboardService";
// Define props explicitly
const props = defineProps<{
  lessonId: string;
}>();
const feedbackCardRef = ref<InstanceType<typeof FeedbackCard> | null>(null);

// Type guard to check if courseDetails is of type CourseDetailResponse
const getCourseId = (
  courseDetails: CourseDetailResponse | CoursesListResponse | null
): string => {
  if (
    courseDetails &&
    "course_id" in courseDetails &&
    courseDetails.course_id
  ) {
    return courseDetails.course_id;
  } else if (courseDetails && "id" in courseDetails) {
    return courseDetails.id;
  }
  return "";
};

const openFeedbackModal = (lessonTitle?: string): void => {
  // Don't set showFeedbackModal here since the dialog is controlled inside the component
  nextTick(() => {
    if (feedbackCardRef.value) {
      // Get the lesson name and append "Recommend Lesson" to make it clear
      const title =
        lessonTitle + " Recommend Lesson" ||
        (lesson.value ? lesson.value.name + " Recommend Lesson" : "");
      feedbackCardRef.value.setLessonTitle(title);
    }
  });
};

const lesson = ref<Lesson | null>(null);
const showDialog = ref(false);
const selectedModule = ref<Module>({} as Module);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const showAnalystModal = ref(false);
const handleModalClose = () => {
  isModalClosed.value = true;
  showAnalystModal.value = false;
};
const courseStore = useCourseStore.getState();
const breadcrumbsStore = useBreadcrumbsStore();

// State management
const isModalClosed = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);

function openDialog(module: Module) {
  selectedModule.value = module;
  showDialog.value = true;
}

const addActivity = async (moduleName: string) => {
  try {
    const add_feedback = await dashboardService.addActivity(
      { showError, showSuccess },
      {
        type: "access_module",
        description: "Accessed Module: " + moduleName,
      }
    );
    if (add_feedback) {
      showSuccess("Accessed Module: " + moduleName);
    } else {
      throw new Error("Failed to add activity.");
    }
  } catch (error) {
    showError("Failed to add activity");
  }
};

const parsedLearningOutcomes = (learning_outcomes: string[]) => {
  try {
    // Return the array directly if they're already strings
    if (learning_outcomes && Array.isArray(learning_outcomes)) {
      // Only try to parse if an item appears to be a JSON string
      const outcomes = learning_outcomes
        .map((outcome) => {
          if (
            typeof outcome === "string" &&
            (outcome.startsWith("{") || outcome.startsWith("["))
          ) {
            try {
              return JSON.parse(outcome);
            } catch {
              return outcome;
            }
          }
          return outcome;
        })
        .flat();

      // Ensure we're returning an array of strings
      return outcomes.map((outcome) => {
        if (typeof outcome === "object" && outcome !== null) {
          return JSON.stringify(outcome);
        }
        return String(outcome);
      });
    }
    return learning_outcomes || [];
  } catch (e) {
    console.error("Error processing learning outcomes:", e);
    return [];
  }
  // const firstOutcome = learning_outcomes[0];
  // if (
  //   typeof firstOutcome === "string" &&
  //   firstOutcome.startsWith("{") &&
  //   firstOutcome.endsWith("}")
  // ) {
  //   try {
  //     return learning_outcomes.map((outcome) => JSON.parse(outcome)).flat();
  //   } catch (e) {
  //     console.error("Error parsing learning outcomes as JSON:", e);
  //     return learning_outcomes;
  //   }
  // }
  // return learning_outcomes;
};

const fetchRecommendedLesson = async () => {
  try {
    const response = await lessonsService.fetchRecommendedLesson(
      { showError, showSuccess },
      props.lessonId // Use props.lessonId instead of route.params
    );
    if (response && "data" in response && response.data) {
      lesson.value = response.data as Lesson;
      if (lesson.value) {
        breadcrumbsStore.setBreadcrumbs([
          {
            title: courseStore.courseDetails
              ? "name" in courseStore.courseDetails
                ? courseStore.courseDetails.name
                : courseStore.courseDetails.course_name
              : "Unknown Course",
            disabled: true,
          },
          { title: lesson.value.name, disabled: true },
        ]);
      }
    } else {
      throw new Error("No lesson data received from the server.");
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load lesson data.";
  }
};
const timeSpentStore = useTimeSpentStore();

onMounted(() => {
  timeSpentStore.startTracking();
});

onBeforeUnmount(async () => {
  timeSpentStore.stopTracking();
  await timeSpentStore.updateTimeSpent(
    { showError, showSuccess },
    props.lessonId
  );
  console.log("Time spent:", timeSpentStore.timeSpentInSeconds, "seconds");
  console.log("Formatted time:", timeSpentStore.formattedTimeSpent);
});

onMounted(async () => {
  loading.value = true;
  await fetchRecommendedLesson();
  loading.value = false;
});
</script>

<style scoped>
.border-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.border-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  background: linear-gradient(
    to right,
    rgba(var(--v-theme-primary), 0.05),
    transparent
  );
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.05);
}

.module-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-header {
  background: linear-gradient(
    to right,
    rgba(var(--v-theme-primary), 0.05),
    transparent
  );
}

.primary-1 {
  background-color: var(--v-theme-primary) !important;
}

.primary-2 {
  background-color: #6200ea !important;
}

.primary-3 {
  background-color: #3949ab !important;
}

.border-left-primary {
  border-left: 4px solid var(--v-theme-primary);
}

.border-left-error {
  border-left: 4px solid var(--v-theme-error);
}

:deep(.v-list-item__prepend) {
  padding-right: 8px !important;
}

:deep(.v-list-item__prepend .v-icon) {
  color: var(--v-theme-error) !important;
  opacity: 0.7;
}

/* Added styles for learning outcomes */
.learning-outcomes-sheet {
  max-height: 100%;
  overflow-y: auto;
}

.learning-outcome-text {
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
}

:deep(.v-list-item__content) {
  overflow: visible;
  white-space: normal;
}

:deep(.v-list-item-title) {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
}
</style>
