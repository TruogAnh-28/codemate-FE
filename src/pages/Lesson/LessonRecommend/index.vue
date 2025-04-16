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
            :color="renderStatusColor(lesson.status)"
            :prepend-icon="
              lesson.status === 'completed'
                ? 'mdi-check-circle'
                : 'mdi-circle-slice-8'
            "
            elevation="1"
          >
            {{ renderStatusLabel(lesson.status) }}
          </v-chip>
          <!-- New Analyst Button -->
          <v-btn
            color="primary"
            variant="tonal"
            class="text-none rounded-lg"
            prepend-icon="mdi-chart-bar"
            @click="showAnalystModal = true"
            :loading="isRegenerating"
            :disabled="isRegenerating"
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

      <!-- Expected Time Section -->
      <v-divider></v-divider>
      <v-card-text class="px-6 pt-4 pb-6">
        <div class="d-flex align-center mb-2">
          <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
          <h3 class="text-subtitle-1 font-weight-bold mb-0">Expected Time</h3>
        </div>
        <v-sheet rounded="lg" elevation="0" class="pa-4 bg-grey-lighten-4">
          <p class="text-body-1 font-weight-medium mb-1">
            <!-- Changed class -->
            Start Date:
            <span class="text-secondary">{{
              formatDate(lesson.start_date)
            }}</span>
          </p>
          <p class="text-body-1 font-weight-medium mb-1">
            <!-- Changed class -->
            End Date:
            <span class="text-secondary">{{
              formatDate(lesson.end_date)
            }}</span>
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            <!-- Changed class -->
            {{ lesson.duration_notes }}
          </p>
        </v-sheet>
      </v-card-text>

      <v-card-text class="px-6 pt-0 pb-6">
        <!-- Reduced top padding -->
        <v-row>
          <v-col cols="12" md="6">
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
                class="pa-4 bg-grey-lighten-4 border-left-primary formatted-content"
              >
                <!-- Use v-for to render each line -->
                <p
                  v-for="(line, index) in formattedRecommendContent"
                  :key="`rec-${index}`"
                  class="mb-1"
                >
                  {{ line }}
                </p>
                <!-- Display message if content is empty -->
                <p
                  v-if="!formattedRecommendContent.length"
                  class="text-medium-emphasis text-body-2"
                >
                  No specific recommendations provided for this lesson yet.
                </p>
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
                class="pa-4 bg-grey-lighten-4 formatted-content"
              >
                <!-- Use v-for to render each line -->
                <p
                  v-for="(line, index) in formattedExplain"
                  :key="`exp-${index}`"
                  class="mb-1"
                >
                  {{ line }}
                </p>
                <!-- Display message if content is empty -->
                <p
                  v-if="!formattedExplain.length"
                  class="text-medium-emphasis text-body-2"
                >
                  No explanation provided for this lesson yet.
                </p>
              </v-sheet>
            </div>
          </v-col>

          <!-- Learning Outcomes Section - Improved to show all content -->
          <v-col cols="12" md="6">
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
                  v-if="parsedOutcomes.length > 0"
                  v-for="(outcome, index) in parsedOutcomes"
                  :key="index"
                  prepend-icon="mdi-check-circle"
                  class="px-0 py-1 mb-1"
                >
                  <v-list-item-title class="text-body-1 learning-outcome-text">
                    {{ outcome }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-else>
                  <v-list-item-title class="text-medium-emphasis text-body-2">
                    No learning outcomes defined for this lesson.
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Modules Section -->
    <div class="mb-4">
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" size="large" class="mr-2"
          >mdi-view-grid-outline</v-icon
        >
        <h2 class="text-h5 font-weight-bold mb-0">Modules</h2>
      </div>

      <!-- Module Type Legend -->
      <div class="d-flex align-center flex-wrap mt-2 mb-4 module-legend">
        <div class="d-flex align-center mr-6">
          <v-avatar color="primary" size="small" class="mr-2">
            <span class="text-caption white--text">1</span>
          </v-avatar>
          <span class="text-body-2">Core Modules</span>
        </div>
        <div class="d-flex align-center">
          <v-avatar color="warning" size="small" class="mr-2">
            <v-icon size="x-small" color="white">mdi-star</v-icon>
          </v-avatar>
          <span class="text-body-2">Supplementary Content</span>
        </div>

        <!-- Optional: Add a filter button -->
        <v-spacer></v-spacer>
        <v-btn-toggle
          v-model="moduleFilter"
          color="primary"
          density="comfortable"
          rounded="pill"
          variant="outlined"
        >
          <v-btn value="all" variant="text">All</v-btn>
          <v-btn value="core" variant="text">Core</v-btn>
          <v-btn value="supplementary" variant="text">Supplementary</v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <v-row>
      <!-- Empty state when filtering shows no results -->
      <v-col
        v-if="filteredModules.length === 0"
        cols="12"
        class="text-center pa-6"
      >
        <v-sheet rounded class="pa-6 bg-grey-lighten-4">
          <v-icon size="large" class="mb-2" color="grey"
            >mdi-filter-off-outline</v-icon
          >
          <p class="text-body-1 mb-0">No modules match the selected filter.</p>
        </v-sheet>
      </v-col>

      <!-- Use filteredModules instead of lesson.modules -->
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(module, index) in filteredModules"
        :key="module.module_id"
      >
        <v-card
          class="module-card rounded-xl border-card h-100 d-flex flex-column"
          elevation="2"
          :class="{ 'supplementary-module': isSupplementaryModule(module) }"
        >
          <div
            class="module-header pa-4"
            :class="{ 'supplementary-header': isSupplementaryModule(module) }"
          >
            <div class="d-flex align-center">
              <!-- For regular modules -->
              <v-avatar
                v-if="!isSupplementaryModule(module)"
                :color="getModuleAvatarColor(index)"
                class="mr-3"
                size="42"
              >
                <span class="text-h6 font-weight-bold white--text">{{
                  lesson.modules.indexOf(module) + 1
                }}</span>
              </v-avatar>

              <!-- For supplementary modules -->
              <v-avatar v-else color="warning" class="mr-3" size="42">
                <v-icon color="white">mdi-star</v-icon>
              </v-avatar>

              <v-chip
                v-if="isSupplementaryModule(module)"
                size="small"
                color="warning"
                variant="flat"
                label
                class="ml-2"
                prepend-icon="mdi-star-outline"
              >
                Supplementary
              </v-chip>
              <v-chip
                size="small"
                label
                :color="isSupplementaryModule(module) ? 'warning' : 'primary'"
                variant="outlined"
                class="ml-auto"
              >
                {{ isSupplementaryModule(module) ? "Extra" : "Module" }}
              </v-chip>
            </div>
          </div>

          <v-card-text class="pa-4 flex-grow-1">
            <h3 class="text-subtitle-1 font-weight-medium mb-2">
              {{ module.title }}
            </h3>
            <div class="d-flex align-center mb-2">
              <v-progress-linear
                v-if="module.progress !== undefined"
                :color="isSupplementaryModule(module) ? 'warning' : 'primary'"
                :model-value="module.progress"
                height="6"
                rounded
                class="mr-2"
              ></v-progress-linear>
              <span class="text-caption text-medium-emphasis"
                >{{ module.progress ?? 0 }}%
              </span>
            </div>
            <!-- Display module objectives -->
            <div
              v-if="module.objectives && module.objectives.length > 0"
              class="mt-3"
            >
              <div
                class="text-caption font-weight-medium"
                :class="
                  isSupplementaryModule(module)
                    ? 'text-warning'
                    : 'text-primary'
                "
              >
                Objectives:
              </div>
              <div
                class="text-caption text-medium-emphasis mb-1"
                v-for="(objective, objIndex) in module.objectives.slice(0, 3)"
                :key="objIndex"
              >
                • {{ objective }}
              </div>
              <div
                v-if="module.objectives.length > 3"
                class="text-caption"
                :class="
                  isSupplementaryModule(module)
                    ? 'text-warning'
                    : 'text-primary'
                "
              >
                +{{ module.objectives.length - 3 }} more
              </div>
            </div>
            <div v-else class="mt-3">
              <p class="text-caption text-medium-emphasis">
                No objectives defined.
              </p>
            </div>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0 mt-auto">
            <v-btn
              :to="`/lessonRecommend/${lessonId}/module/${module.module_id}/Quiz`"
              :color="isSupplementaryModule(module) ? 'warning' : 'primary'"
              variant="tonal"
              class="text-none rounded-lg"
              block
              prepend-icon="mdi-play-circle-outline"
              @click="addActivity(module.title)"
            >
              {{
                isSupplementaryModule(module)
                  ? "Explore Content"
                  : "Start Module"
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- RecommendLessonAnalyst Modal -->
    <RecommendLessonAnalyst
      :recommend_lesson_id="lessonId"
      v-model="showAnalystModal"
      @close="handleModalClose"
      @proceed="handleModalClose"
      @review="handleModalClose"
      @repeat="handleModalClose"
      @regenerate="handleRegenerate"
    />
    <!-- Feedback Modal -->
    <FeedbackCard
      @open-feedback="openFeedbackModal"
      type="course"
      :courseId="getCourseId(courseDetails)"
      ref="feedbackCardRef"
    />
  </v-container>
  <v-container
    v-else-if="loading"
    class="d-flex justify-center align-center"
    style="height: 80vh"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
  </v-container>
  <v-container v-else class="text-center mt-10">
    <v-alert type="error" variant="tonal" prominent border="start">
      {{ error || "Failed to load lesson data. Please try again later." }}
    </v-alert>
  </v-container>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  inject,
  nextTick,
} from "vue";
import { lessonsService } from "@/services/recommendLesson";
import { Lesson, RegenerateRecommendLesson} from "@/types/Lesson";
import { renderStatusColor, renderStatusLabel } from "@/utils/functions/render";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useCourseStore } from "@/stores/courseStore";
import { useTimeSpentStore } from "@/stores/timeSpentStore";
import FeedbackCard from "@/components/Dashboard/FeedbackCard.vue";
import RecommendLessonAnalyst from "@/components/Modal/RecommendLessonAnalyst.vue";
import { CourseDetailResponse, CoursesListResponse } from "@/types/Course";
import { dashboardService } from "@/services/dashboardService";
import { RecommendLessonMonitor } from "@/types/AI_generate";
import { Module } from "@/types/Lesson";

// --- Helper Functions ---
const formatTextLines = (text: string | undefined | null): string[] => {
  if (!text) return [];
  const textAsString = String(text);
  return textAsString
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    // Check if date is valid before formatting
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return String(dateString);
  }
};

const isSupplementaryModule = (module: Module) => {

  // Also check if module title doesn't follow "Module X: ..." pattern
  if (module.title && typeof module.title === "string") {
    const modulePattern = /^Module\s+\d+\s*:/i;
    return !modulePattern.test(module.title);
  }

  return false;
};

// Optional: Update the existing getModuleAvatarColor function to handle supplementary modules
const getModuleAvatarColor = (index: number) => {
  const colors = ["primary", "secondary", "accent"];
  return colors[index % colors.length];
};

const moduleFilter = ref("all"); // Options: "all", "core", "supplementary"

// Add this computed property
const filteredModules = computed(() => {
  if (!lesson.value || !lesson.value.modules) return [];

  if (moduleFilter.value === "all") {
    return lesson.value.modules;
  } else if (moduleFilter.value === "core") {
    return lesson.value.modules.filter(
      (module) => !isSupplementaryModule(module)
    );
  } else if (moduleFilter.value === "supplementary") {
    return lesson.value.modules.filter((module) =>
      isSupplementaryModule(module)
    );
  }

  return lesson.value.modules;
});
// --- End Helper Functions ---

// Define props explicitly
const props = defineProps<{
  lessonId: string;
}>();

// Injectables for notifications
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Component Refs
const feedbackCardRef = ref<InstanceType<typeof FeedbackCard> | null>(null);

// Reactive State
const lesson = ref<Lesson | null>(null);
const showAnalystModal = ref(false);
const isModalClosed = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);
const isRegenerating = ref(false);
const regenerateRecommendLessonValue = ref<RegenerateRecommendLesson | null>(
  null
);

// Stores
const courseStore = useCourseStore;
const { courseDetails } = courseStore.getState();
const breadcrumbsStore = useBreadcrumbsStore();
const timeSpentStore = useTimeSpentStore();

// Computed Properties
const formattedRecommendContent = computed(() =>
  formatTextLines(lesson.value?.recommend_content)
);
const formattedExplain = computed(() => formatTextLines(lesson.value?.explain));
const parsedOutcomes = computed(() =>
  parsedLearningOutcomes(lesson.value?.learning_outcomes)
);

// Methods
const getCourseId = (
  courseDetails: CourseDetailResponse | CoursesListResponse | null
): string => {
  if (courseDetails && "course_id" in courseDetails && courseDetails.course_id)
    return courseDetails.course_id;
  if (courseDetails && "id" in courseDetails) return courseDetails.id;
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

// Keep if module detail dialog is planned
// function openDialog(module: Module) {
//   selectedModule.value = module;
//   showDialog.value = true;
// }

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

const parsedLearningOutcomes = (
  learning_outcomes: string[] | undefined | null
): string[] => {
  if (
    !learning_outcomes ||
    !Array.isArray(learning_outcomes) ||
    learning_outcomes.length === 0
  ) {
    return [];
  }
  try {
    const outcomes = learning_outcomes
      .map((outcome) => {
        if (typeof outcome === "string") {
          // Basic check for JSON-like strings
          const trimmed = outcome.trim();
          if (
            (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
            (trimmed.startsWith("[") && trimmed.endsWith("]"))
          ) {
            try {
              // Attempt to parse, could return object/array/string/number/boolean
              const parsed = JSON.parse(trimmed);
              // Flatten if it parsed into an array
              return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              // If parsing fails, return the original string wrapped in an array
              return [outcome];
            }
          }
        }
        // Return non-strings or non-JSON strings wrapped in an array
        return [outcome];
      })
      .flat(); // Flatten the array of arrays

    // Ensure all elements are strings
    return outcomes
      .map((outcome) => {
        if (typeof outcome === "object" && outcome !== null) {
          return JSON.stringify(outcome); // Stringify objects/arrays that weren't strings initially
        }
        return String(outcome); // Convert numbers/booleans/null/undefined to string
      })
      .filter((s) => s.trim().length > 0); // Filter out empty strings
  } catch (e) {
    console.error("Error processing learning outcomes:", e, learning_outcomes);
    // Fallback: return original strings that are not empty
    return learning_outcomes.filter(
      (o) => typeof o === "string" && o.trim().length > 0
    );
  }
};

const fetchRecommendedLesson = async () => {
  loading.value = true; // Set loading at the start
  error.value = null;
  try {
    console.log(`Fetching lesson data for ID: ${props.lessonId}`);
    const response = await lessonsService.fetchRecommendedLesson(
      { showError, showSuccess },
      props.lessonId
    );
    console.log("Lesson fetch response:", response);

    if (response && "data" in response && response.data) {
      lesson.value = response.data as Lesson;
      if (lesson.value) {
        // Set Breadcrumbs
        const courseName = courseDetails
          ? "name" in courseDetails
            ? courseDetails.name
            : courseDetails.course_name
          : "Course"; // Fallback name
        breadcrumbsStore.setBreadcrumbs([
          {
            title: courseName,
            disabled: false,
            href: `/courselist/course/${getCourseId(courseDetails)}`,
          }, // Link back to course
          { title: lesson.value.name, disabled: true },
        ]);
        console.log("Lesson data loaded:", lesson.value);
      } else {
        // This case should ideally not happen if status is 200 and data exists
        console.error("Lesson data received but is null/undefined");
        throw new Error("Received empty lesson data from the server.");
      }
    } else {
      const errorMessage =
        response && response.message
          ? response.message
          : "No lesson data received or request failed.";
      console.error("Failed to fetch lesson:", errorMessage, response);
      throw new Error(errorMessage);
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load lesson data.";
    console.error("Exception during lesson fetch:", err);
    error.value = message;
    // Optionally show error notification
    showError(message);
  } finally {
    loading.value = false; // Ensure loading is reset
  }
};

// --- Modal Handling ---
const handleModalClose = () => {
  isModalClosed.value = true; // If needed
  showAnalystModal.value = false;
};

// --- Regeneration Logic ---
const handleRegenerate = async (analysisResult: RecommendLessonMonitor) => {
  console.log("Regenerate requested from modal with analysis:", analysisResult);
  showAnalystModal.value = false; // Close the modal first
  await regenerateRecommendLesson(analysisResult);
};

const regenerateRecommendLesson = async (
  analysisResult: RecommendLessonMonitor
) => {
  isRegenerating.value = true;
  error.value = null; // Clear previous errors specific to regeneration
  try {
    console.log(`Calling regenerate API for lesson ${props.lessonId}`);
    const response = await lessonsService.regenerateRecommendedLesson(
      { showError, showSuccess },
      props.lessonId,
      {
        // Ensure the body matches the backend API structure
        recommend_lesson_id: props.lessonId,
        analysis_result: analysisResult,
      }
    );
    console.log("Regenerate API response:", response);

    if (response && response.data) {
      // IMPORTANT: The backend might return the updated content directly,
      // or you might need to re-fetch. Re-fetching is safer.
      await fetchRecommendedLesson(); // Re-fetch the lesson to show updated content/modules
      showSuccess("Lesson content regenerated and updated successfully.");
      // If response.data contains specific regenerated info, you can store it:
      regenerateRecommendLessonValue.value =
        response.data as RegenerateRecommendLesson;
    } else {
      const message =
        response && response.message
          ? response.message
          : "Failed to regenerate lesson content.";
      throw new Error(message);
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred during regeneration.";
    console.error("Regeneration failed:", err);
    error.value = errorMessage; // Display error related to regeneration
    showError(errorMessage);
  } finally {
    isRegenerating.value = false;
  }
};
// --- End Regeneration Logic ---

// Lifecycle Hooks
onMounted(async () => {
  loading.value = true; // Set loading true initially
  await fetchRecommendedLesson(); // Fetch data on mount
  timeSpentStore.startTracking();
  // loading is set to false inside fetchRecommendedLesson's finally block
});

onBeforeUnmount(async () => {
  timeSpentStore.stopTracking();
  try {
    await timeSpentStore.updateTimeSpent(
      { showError, showSuccess },
      props.lessonId
    );
    console.log(
      `Time spent updated for lesson ${props.lessonId}: ${timeSpentStore.formattedTimeSpent}`
    );
  } catch (updateError) {
    console.error(
      `Failed to update time spent for lesson ${props.lessonId}:`,
      updateError
    );
    // Decide if user needs to see this error
    // showError("Could not save time spent data.");
  }
});
</script>

<style scoped>
/* Add styles for the formatted content */
.formatted-content p {
  margin-bottom: 0.5em; /* Add some space between lines/paragraphs */
  line-height: 1.6; /* Improve readability */
  white-space: pre-wrap; /* Ensures bullet points/indentation are preserved */
  word-wrap: break-word; /* Ensure long words break */
}

.formatted-content p:last-child {
  margin-bottom: 0;
}

/* Optional: Style for lists if backend consistently uses markers */
.formatted-content
  p:where(:starts-with("•"), :starts-with("*"), :starts-with("-")) {
  padding-left: 1.5em;
  text-indent: -1.5em;
}
.formatted-content
  p:where(:starts-with("1."), :starts-with("2."), :starts-with("3.")) {
  padding-left: 1.8em;
  text-indent: -1.8em;
  margin-left: 0.2em; /* Slight adjustment for numbers */
}

.border-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.1); /* Lighter border */
  overflow: hidden; /* Keep */
  transition: all 0.3s ease;
}

.border-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important; /* Softer shadow */
}

.card-header {
  background: linear-gradient(
    90deg,
    /* Changed direction */ rgba(var(--v-theme-primary), 0.06),
    /* Slightly stronger start */ transparent 70% /* Fade out */
  );
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1); /* Lighter border */
}

.module-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08); /* Subtle border */
}
.module-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.module-header {
  background: linear-gradient(
    to right,
    rgba(var(--v-theme-on-surface), 0.03),
    /* Use surface color variant */ transparent
  );
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Removed specific primary-1/2/3 colors, use function getModuleAvatarColor */

.border-left-primary {
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.border-left-error {
  border-left: 4px solid rgb(var(--v-theme-error));
}

:deep(.v-list-item) {
  min-height: auto; /* Allow items to shrink */
}
:deep(.v-list-item__prepend) {
  padding-right: 10px !important; /* Slightly more space */
  align-self: flex-start; /* Align icon top */
  margin-top: 4px; /* Adjust icon position */
}

:deep(.v-list-item__prepend .v-icon) {
  color: rgb(var(--v-theme-error)) !important;
  opacity: 0.8; /* Slightly more visible */
}

/* Styles for learning outcomes */
.learning-outcomes-sheet {
  max-height: 300px; /* Limit height if needed */
  overflow-y: auto; /* Add scroll if overflows */
}

.learning-outcome-text {
  white-space: normal;
  word-break: break-word;
  line-height: 1.6; /* Improved line height */
  font-size: 0.95rem; /* Adjust font size if needed */
}

/* Ensure text wrapping in list items */
:deep(.v-list-item__content) {
  overflow: visible;
  white-space: normal;
}

:deep(.v-list-item-title) {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
  line-height: 1.5; /* Ensure title line height */
}

.text-body-large-bold {
  /* Define if not globally available */
  font-size: 1rem;
  font-weight: bold;
}
.text-body-large-medium {
  /* Define if not globally available */
  font-size: 1rem;
  font-weight: 500;
}
.text-secondary-variant {
  /* Define if not globally available */
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.supplementary-module {
  border: 1px dashed rgba(var(--v-theme-warning), 0.7);
}

.supplementary-module:hover {
  border-color: rgba(var(--v-theme-warning), 1);
  box-shadow: 0 4px 12px rgba(var(--v-theme-warning), 0.2);
}

.supplementary-header {
  background: linear-gradient(
    to right,
    rgba(var(--v-theme-warning), 0.05),
    transparent
  );
  border-bottom: 1px dashed rgba(var(--v-theme-warning), 0.3);
}

/* Optional: Add a small indicator to easily identify supplementary modules */
.supplementary-module::before {
  content: "";
  position: absolute;
  top: -5px;
  right: -5px;
  width: 30px;
  height: 30px;
  background-color: rgb(var(--v-theme-warning));
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  z-index: 1;
  opacity: 0.9;
}

/* Add a subtle pattern to supplementary modules */
.supplementary-module {
  background-image: linear-gradient(
    45deg,
    rgba(var(--v-theme-warning), 0.03) 25%,
    transparent 25%,
    transparent 50%,
    rgba(var(--v-theme-warning), 0.03) 50%,
    rgba(var(--v-theme-warning), 0.03) 75%,
    transparent 75%,
    transparent
  );
  background-size: 10px 10px;
}
</style>
