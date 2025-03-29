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
        <v-icon color="primary" size="x-large" class="mr-4">mdi-book-education-outline</v-icon>
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
            @click="showFeedbackModal = true"
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
          <p class="text-body-large-bold mb-0">Start Date: <span class="text-secondary">{{ lesson.start_date }}</span></p>
          <p class="text-body-large-bold mb-0">End Date: <span class="text-secondary">{{ lesson.end_date }}</span></p>
          <p class="text-body-large-medium mb-0 text-secondary-variant">{{ lesson.duration_notes }}</p>
        </v-sheet>
      </v-card-text>
      
      <v-card-text class="px-6 pt-4 pb-6">
        <v-row>
          <v-col cols="6">
            <!-- Recommend Section -->
            <div class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-lightbulb-outline</v-icon>
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Recommend</h3>
              </div>
              <v-sheet rounded="lg" elevation="0" class="pa-4 bg-grey-lighten-4 border-left-primary">
                <p class="text-body-1 mb-0">{{ lesson.recommend_content }}</p>
              </v-sheet>
            </div>
            
            <!-- Explain Section -->
            <div>
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Explain</h3>
              </div>
              <v-sheet rounded="lg" elevation="0" class="pa-4 bg-grey-lighten-4">
                <p class="text-body-1 mb-0">{{ lesson.explain }}</p>
              </v-sheet>
            </div>
          </v-col>
          
          <!-- Learning Outcomes Section - Improved to show all content -->
          <v-col cols="6">
            <div class="d-flex align-center mb-2">
              <v-icon color="error" class="mr-2">mdi-certificate-outline</v-icon>
              <h3 class="text-subtitle-1 font-weight-bold mb-0 text-error">Learning Outcomes</h3>
            </div>
            <v-sheet rounded="lg" elevation="1" class="pa-4 bg-error-lighten-5 border-left-error learning-outcomes-sheet">
              <v-list density="compact" class="bg-transparent pa-0">
                <v-list-item
                  v-for="(outcome, index) in parsedLearningOutcomes(lesson.learning_outcomes)"
                  :key="index"
                  prepend-icon="mdi-check-circle"
                  class="px-0 py-1"
                  :class="{'mb-2': index !== parsedLearningOutcomes(lesson.learning_outcomes).length - 1}"
                >
                  <v-list-item-title class="text-body-1 learning-outcome-text">{{ outcome }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

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
                <span class="text-h6 font-weight-bold white--text">{{ index + 1 }}</span>
              </v-avatar>
              <v-chip size="small" label color="primary" variant="outlined" class="ml-auto">
                Module
              </v-chip>
            </div>
          </div>
          
          <v-card-text class="pa-4">
            <h3 class="text-subtitle-1 font-weight-medium mb-2">{{ module.title }}</h3>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
              <span>Estimated time: 30min</span>
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
    <FeedbackLesson
    v-if="showFeedbackModal"
    :lessonId="lessonId"
    :showModal="showFeedbackModal"
    @update:showModal="updateFeedbackModal"
    @feedback-submitted="handleFeedbackSubmitted"
  />
  </v-container>
</template>

<script lang="ts" setup>
import { lessonsService } from "@/services/recommendLesson";
import { Lesson, Module } from "@/types/Lesson";
import { renderStatusLabel } from "@/utils/functions/render";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { aiGenerateServices } from "@/services/aiGenerateServices";
import { useCourseStore } from "@/stores/courseStore";
import { RecommendLessonMonitor } from "@/types/AI_generate";
import { ref, computed, onMounted, defineProps } from "vue";

// Define props explicitly
const props = defineProps<{
  lessonId: string;
}>();
const showFeedbackModal = ref(false);
const updateFeedbackModal = (value: boolean): void => {
  showFeedbackModal.value = value;
};

const openFeedbackModal = (lessonId: string): void => {
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
};

const lesson = ref<Lesson | null>(null);
const showDialog = ref(false);
const selectedModule = ref<Module>({} as Module);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const monitorData = ref<RecommendLessonMonitor>({
  can_proceed: false,
  needs_repeat: false,
  needs_review_prior: false,
  issues_analysis: {
    significant_issues: [],
    total_issues_count: 0,
    increasing_issues: [],
    most_frequent_type: "",
  },
  recommendations: [],
});
const showAnalystModal = ref(false);
const handleModalClose = () => {
  isModalClosed.value = true;
  showAnalystModal.value = false;
};
const courseStore = useCourseStore.getState();
const breadcrumbsStore = useBreadcrumbsStore();

// State management
const isModalClosed = ref(false);
const hasMonitorResults = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);

const shouldShowLessonContent = computed(() => {
  return lesson.value && isModalClosed.value && hasMonitorResults.value;
});

function openDialog(module: Module) {
  selectedModule.value = module;
  showDialog.value = true;
}

const parsedLearningOutcomes = (learning_outcomes: string[]) => {
  try {
    // Return the array directly if they're already strings
    if (learning_outcomes && Array.isArray(learning_outcomes)) {
      // Only try to parse if an item appears to be a JSON string
      const outcomes = learning_outcomes.map(outcome => {
        if (typeof outcome === 'string' && (outcome.startsWith('{') || outcome.startsWith('['))) {
          try {
            return JSON.parse(outcome);
          } catch {
            return outcome;
          }
        }
        return outcome;
      }).flat();
      
      // Ensure we're returning an array of strings
      return outcomes.map(outcome => {
        if (typeof outcome === 'object' && outcome !== null) {
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

console.log(props.lessonId);
const fetchMonitor = async () => {
  loading.value = true;
  error.value = null;
  try {
    if (courseStore.courseDetails === null) {
      throw new Error("Course details not available.");
    }
    let courseId =
      "id" in courseStore.courseDetails
        ? courseStore.courseDetails.id
        : courseStore.courseDetails?.course_id;

    const response = await aiGenerateServices.getMonitorRecommendLesson(
      { showError, showSuccess },
      courseId,
      props.lessonId
    );
    if (response && "data" in response && response.data) {
      monitorData.value = response.data as RecommendLessonMonitor;
      hasMonitorResults.value = true;
    } else {
      throw new Error("No monitor data received from the server.");
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load monitor data.";
  } finally {
    loading.value = false;
  }
};

const retryFetch = () => {
  loading.value = true;
  error.value = null;
  Promise.all([fetchRecommendedLesson(), fetchMonitor()]).finally(() => {
    loading.value = false;
  });
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchRecommendedLesson(), fetchMonitor()]);
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
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.05);
}

.module-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-header {
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
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