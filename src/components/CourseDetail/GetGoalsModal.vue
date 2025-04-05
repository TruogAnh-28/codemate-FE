<template>
  <v-dialog v-model="internalDialog" max-width="800" class="rounded-lg">
    <div
      v-if="!isLearningPath"
      class="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <!-- Left Panel -->
      <div class="w-full md:w-1/2 p-6 border-r border-gray-200">
        <div class="flex items-center mb-4">
          <div class="p-2 rounded-full bg-primary-50 text-primary-600 mr-2">
            <CheckCircle size="24" />
          </div>
          <h3 class="text-heading-4 font-bold">Tell Us About Your Goals</h3>
        </div>

        <p class="text-gray-600 text-body-small-3 mb-6">
          Help us understand your learning goals so we can recommend the best lessons for
          you.
        </p>

        <v-alert
          v-if="learningGoal.length > 200"
          type="error"
          class="mb-4 font-medium"
          border="start"
          density="compact"
        >
          Please enter a learning goal that is less than 200 characters.
        </v-alert>

        <v-textarea
          v-model="learningGoal"
          label="What is your main learning goal?"
          placeholder="E.g., Master data analysis, Become proficient in machine learning..."
          class="mb-6 rounded-lg border-2 text-body-base-4 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          hide-details
          rows="3"
          maxlength="200"
          counter
        />

        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <div class="flex gap-4 w-full sm:w-auto sm:ml-auto">
            <v-btn
              variant="outlined"
              class="flex-1 sm:flex-none text-body-base-4"
              @click="cancel"
            >
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              class="flex-1 sm:flex-none rounded-lg text-white text-body-base-4"
              :disabled="learningGoal.length > 200 || isLoading"
              @click="submitGoal"
            >
              Get Recommendations
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="w-full md:w-1/2 p-6 bg-gray-50">
        <div v-if="isLoading" class="h-full flex flex-col items-center justify-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
            class="mb-4 loading-spinner"
          />
          <p class="loading-text">{{ loadingMessage }}</p>
        </div>

        <div
          v-else-if="suggestGoal && suggestGoal.length > 0"
          class="h-full overflow-y-auto pr-2"
        >
          <div
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4"
          >
            <h4 class="text-heading-5 font-semibold text-gray-800">Suggested Goals</h4>
            <v-btn
              variant="outlined"
              color="primary"
              class="font-medium text-body-base-4 w-full sm:w-auto"
              :disabled="isLoading"
              :loading="isLoading"
              @click="fetchSuggestGoals"
              prepend-icon="mdi-lightbulb-outline"
            >
              Re-suggest Goals
            </v-btn>
          </div>
          <div
            v-for="(goal, index) in suggestGoal"
            :key="index"
            class="bg-white p-5 rounded-lg mb-4 last:mb-0 shadow-sm border border-gray-100"
          >
            <p class="text-body-base-4 text-gray-800 mb-3 font-semibold">
              {{ goal.goal }}
            </p>

            <v-chip
              size="small"
              class="mb-3"
              :color="getProficiencyColor(goal.proficiency_level)"
              text-color="white"
              variant="flat"
            >
              {{ goal.proficiency_level }}
            </v-chip>

            <p class="text-body-small-3 text-gray-700 mb-4">
              {{ goal.explanation }}
            </p>

            <div class="mb-4">
              <p class="text-body-small-3 text-gray-800 font-medium mb-2">Key Lessons:</p>
              <div class="flex flex-wrap gap-2">
                <v-chip
                  v-for="(lesson, i) in goal.key_lessons"
                  :key="i"
                  size="small"
                  :color="getLessonChipColor(i)"
                  variant="flat"
                  class="font-medium"
                >
                  {{ lesson }}
                </v-chip>
              </div>
            </div>

            <v-btn
              variant="outlined"
              color="primary"
              class="font-medium"
              @click="learningGoal = goal.goal"
              size="small"
            >
              Use This Goal
            </v-btn>
          </div>
        </div>

        <div
          v-else
          class="h-full flex flex-col items-center justify-center text-gray-500"
        >
          <v-icon
            icon="mdi-lightbulb-outline"
            size="48"
            class="mb-4 text-gray-400"
          ></v-icon>
          <p class="text-center">Click "Suggest Goals" to see recommendations</p>
          <v-btn
            variant="outlined"
            color="primary"
            class="font-medium text-body-base-4 w-full sm:w-auto"
            :disabled="isLoading"
            :loading="isLoading"
            @click="fetchSuggestGoals"
            prepend-icon="mdi-lightbulb-outline"
          >
            Suggest Goals
          </v-btn>
        </div>
      </div>
    </div>
    <div
      v-if="isLearningPath"
      class="h-full flex flex-col items-center justify-center bg-white"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
        class="mb-4 loading-spinner"
      />
      <p class="text-gray-600 loading-text">{{ loadingLearningPath }}</p>
    </div>
  </v-dialog>
</template>

<script lang="ts" setup>
import CheckCircle from "@/assets/icons/check-circle.vue";
import { aiGenerateServices } from "@/services/aiGenerateServices";
import { useCourseStore } from "@/stores/courseStore";
import { SuggestedGoal } from "@/types/AI_generate";
import { ref, watch, inject } from "vue";
const props = defineProps<{ dialog: boolean }>();
const emit = defineEmits<{
  (e: "update:dialog", value: boolean): void;
  (e: "submitGoal", value: string): void;
}>();
const suggestGoal = ref<SuggestedGoal[] | null>(null);
const internalDialog = ref(props.dialog);
const courseStore = useCourseStore.getState();
const learningGoal = ref("");
const isLoading = ref(false);
const isLearningPath = ref(false);

watch(
  () => props.dialog,
  (newVal: boolean) => {
    internalDialog.value = newVal;
  }
);

watch(internalDialog, (newVal: boolean) => {
  emit("update:dialog", newVal);
});

const cancel = () => {
  internalDialog.value = false;
};

const submitGoal = () => {
  if (learningGoal.value.length <= 200) {
    emit("submitGoal", learningGoal.value);
    isLearningPath.value = true;

    let messageIndex = 0;
    const interval = setInterval(() => {
      loadingLearningPath.value =
        statusLearningPathMessages[messageIndex % statusLearningPathMessages.length];
      messageIndex++;
    }, 5000);

    return interval;
  }
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const statusMessages = [
  "Starting to request AI....",
  "Generating sample goals....",
  "Almost done....",
  "Initializing AI framework....",
  "Fetching data for analysis....",
  "Processing request....",
  "AI is learning....",
  "Fine-tuning models....",
  "Verifying results....",
  "Completion in progress....",
];

const statusLearningPathMessages = [
  "Starting to create learning path....",
  "Gathering educational resources....",
  "Analyzing learner's goals....",
  "Collecting relevant content....",
  "Organizing course materials....",
  "Mapping out learning modules....",
  "Identifying key learning objectives....",
  "Assessing current knowledge level....",
  "Designing personalized curriculum....",
  "Optimizing learning flow....",
  "Adding supporting exercises....",
  "Curating practice tests....",
  "Reviewing learning milestones....",
  "Tailoring path to learner preferences....",
  "Preparing assessment materials....",
  "Customizing feedback mechanisms....",
  "Finalizing resource recommendations....",
  "Building progression tracking....",
  "Aligning with learning standards....",
  "Learning path ready for launch....",
];
const loadingLearningPath = ref(statusLearningPathMessages[0]);
const loadingMessage = ref(statusMessages[0]);

const fetchSuggestGoals = async () => {
  isLoading.value = true;
  let messageIndex = 0;

  const interval = setInterval(() => {
    loadingMessage.value = statusMessages[messageIndex % statusMessages.length];
    messageIndex++;
  }, 5000);

  courseStore.loadCourseDetails();

  if (courseStore.courseDetails && "course_id" in courseStore.courseDetails) {
    try {
      const response = await aiGenerateServices.generateStudentGoals(
        {
          showError,
          showSuccess,
        },
        courseStore.courseDetails.course_id
      );
      if (response && "data" in response && response.data) {
        suggestGoal.value = (response.data.suggested_goals as unknown) as SuggestedGoal[];
        console.log("Suggested goals:", suggestGoal.value);
        console.log("response", response);
      }
    } catch (error) {
      console.error("Error fetching suggested goals:", error);
    } finally {
      clearInterval(interval);
      isLoading.value = false;
    }
  } else {
    clearInterval(interval);
    isLoading.value = false;
  }
};

const getProficiencyColor = (level: "Struggling" | "Average" | "Advanced") => {
  const colors: Record<string, string> = {
    Advanced: "deep-purple",
    Struggling: "red",
    Average: "orange",
  };
  return colors[level] || "blue";
};
const getLessonChipColor = (index: number) => {
  const colors = [
    "blue-lighten-1",
    "purple-lighten-1",
    "green-lighten-1",
    "amber-darken-2",
    "deep-orange-lighten-1",
    "cyan-darken-1",
  ];
  return colors[index % colors.length];
};
</script>

<style scoped>
.overflow-y-auto {
  max-height: 400px;
}
.loading-spinner {
  animation: pulse 1.5s infinite ease-in-out;
}

.loading-text {
  color: #4a5568;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeIn 0.6s forwards ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
