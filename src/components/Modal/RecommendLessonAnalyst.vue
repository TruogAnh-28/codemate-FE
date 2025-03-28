<template>
  <v-dialog
    v-model="isModalVisible"
    max-width="950"
    persistent
    class="learning-recommendation-modal"
  >
    <v-card class="pa-0 rounded-xl overflow-hidden shadow-lg">
      <!-- Header with Gradient -->
      <v-card-title class="header-gradient text-white pa-6">
        <span class="text-h5 font-weight-bold"
          >Learning Recommendation Analysis</span
        >
        <v-spacer></v-spacer>
        <v-btn icon small @click="closeModal" class="text-white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Content -->
      <v-card-text class="pa-6 max-h-[65vh] overflow-y-auto bg-gray-50">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-10">
          <v-progress-circular
            indeterminate
            color="primary"
            size="40"
          ></v-progress-circular>
          <p class="mt-4 text-gray-600">Loading analysis data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-10">
          <v-icon color="red" size="48">mdi-alert-circle</v-icon>
          <p class="mt-4 text-gray-600">{{ error }}</p>
          <v-btn color="primary" variant="flat" class="mt-4" @click="retryFetch">
            Retry
          </v-btn>
        </div>

        <!-- Data Available State -->
        <div v-else class="space-y-6">
          <!-- Main Recommendation -->
          <v-alert
            :type="getAlertType()"
            variant="tonal"
            class="rounded-lg shadow-sm"
            elevation="1"
          >
            <template v-slot:text>
              <span class="font-medium text-base">{{
                getMainRecommendation()
              }}</span>
            </template>
          </v-alert>

          <!-- Significant Issues -->
          <v-expansion-panels
            variant="accordion"
            flat
            class="rounded-lg bg-white shadow-sm"
          >
            <v-expansion-panel elevation="0">
              <v-expansion-panel-title class="py-3 px-4">
                <span class="font-semibold text-base text-gray-800">
                  Significant Issues ({{
                    monitorData.issues_analysis.total_issues_count
                  }}
                  total)
                </span>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="px-4 pb-4">
                <v-table dense class="modern-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Severity</th>
                      <th>Frequency</th>
                      <th>Impact on Goals</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(issue, index) in monitorData.issues_analysis
                        .significant_issues"
                      :key="index"
                      class="hover:bg-gray-100 transition-colors"
                    >
                      <td>{{ issue.type }}</td>
                      <td class="text-wrap max-w-xs">
                        {{ issue.description }}
                      </td>
                      <td>
                        <v-chip
                          :color="getSeverityColor(issue.severity)"
                          size="small"
                          variant="flat"
                          class="font-medium"
                        >
                          {{ issue.severity }}
                        </v-chip>
                      </td>
                      <td>{{ issue.frequency }}</td>
                      <td class="text-wrap max-w-sm">
                        {{ issue.impact_on_goals }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Recommendations -->
          <v-expansion-panels
            variant="accordion"
            flat
            class="rounded-lg bg-white shadow-sm"
          >
            <v-expansion-panel elevation="0">
              <v-expansion-panel-title class="py-3 px-4">
                <span class="font-semibold text-base text-gray-800"
                  >Recommendations</span
                >
              </v-expansion-panel-title>
              <v-expansion-panel-text class="px-4 pb-4">
                <div class="space-y-4">
                  <div
                    v-for="(
                      recommendation, index
                    ) in monitorData.recommendations"
                    :key="index"
                    class="p-4 bg-gray-50 rounded-lg shadow-inner"
                  >
                    <h4 class="font-semibold text-gray-800 mb-2">
                      Action: {{ recommendation.action }}
                    </h4>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Reason:</span>
                      {{ recommendation.reason }}
                    </p>
                    <p class="text-sm text-gray-600 mt-1">
                      <span class="font-medium">Details:</span>
                      {{ recommendation.details }}
                    </p>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Increasing Issues -->
          <div
            v-if="monitorData.issues_analysis.increasing_issues.length"
            class="mt-6"
          >
            <h3 class="font-semibold text-base text-gray-800 mb-3">
              Increasing Issues
            </h3>
            <v-chip-group column>
              <v-chip
                v-for="issue in monitorData.issues_analysis.increasing_issues"
                :key="issue"
                color="orange"
                variant="flat"
                class="mb-2 mr-2 text-sm font-medium shadow-sm"
              >
                {{ issue }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-6 bg-white border-t" v-if="!loading && !error">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          class="font-medium"
          @click="closeModal"
        >
          Close
        </v-btn>
        <v-btn
          v-if="shouldShowActionButton()"
          :color="getActionButtonColor()"
          variant="flat"
          class="font-medium px-6"
          @click="handlePrimaryAction"
        >
          {{ getActionButtonText() }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { aiGenerateServices } from "@/services/aiGenerateServices";
import { useCourseStore } from "@/stores/courseStore";
import { RecommendLessonMonitor } from "@/types/AI_generate";
import { ref } from "vue";

const props = defineProps({
  recommend_lesson_id: {
    type: String,
    required: true,
  },
});
console.log("recommend_lesson_id", props.recommend_lesson_id);

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

const emit = defineEmits(["close", "proceed", "review", "repeat"]);
const isModalVisible = ref(true);
const loading = ref(true); // Loading state
const error = ref<string | null>(null); // Error state

const closeModal = () => {
  isModalVisible.value = false;
  emit("close");
};

const getAlertType = () => {
  if (monitorData.value.can_proceed) return "success";
  if (monitorData.value.needs_repeat) return "error";
  if (monitorData.value.needs_review_prior) return "warning";
  return "info";
};

const getMainRecommendation = () => {
  const recommendation = monitorData.value.recommendations[0];
  return recommendation?.reason || "No specific recommendation available";
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "high":
      return "red";
    case "medium":
      return "yellow";
    case "low":
      return "blue";
    default:
      return "grey";
  }
};

const shouldShowActionButton = () => {
  return !monitorData.value.can_proceed;
};

const getActionButtonColor = () => {
  if (monitorData.value.needs_repeat) return "red";
  if (monitorData.value.needs_review_prior) return "orange";
  return "blue";
};

const getActionButtonText = () => {
  if (monitorData.value.needs_repeat) return "Repeat Lesson";
  if (monitorData.value.needs_review_prior) return "Review Prior Lessons";
  return "Take Action";
};

const handlePrimaryAction = () => {
  if (monitorData.value.needs_repeat) emit("repeat");
  else if (monitorData.value.needs_review_prior) emit("review");
  emit("proceed");
  closeModal();
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const fetchMonitor = async () => {
  loading.value = true;
  error.value = null;
  try {
    const getCourse = useCourseStore.getState().courseDetails;
    console.log("getCourse", getCourse);
    if (getCourse) {
      const response = await aiGenerateServices.getMonitorRecommendLesson(
        { showError, showSuccess },
        "id" in getCourse ? getCourse.id : getCourse.course_id,
        props.recommend_lesson_id
      );
      if (response && "data" in response && response.data) {
        monitorData.value = response.data as RecommendLessonMonitor;
      } else {
        throw new Error("No data received from the server.");
      }
    } else {
      throw new Error("Course details not available.");
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load analysis data.";
  } finally {
    loading.value = false;
  }
};

const retryFetch = () => {
  fetchMonitor(); // Retry fetching data
};

onMounted(() => {
  fetchMonitor();
});
</script>

<style scoped>
.learning-recommendation-modal {
  @apply font-sans;
}

.header-gradient {
  background: linear-gradient(90deg, #3b82f6, #1e3a8a);
}

.shadow-lg {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.shadow-sm {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.border-t {
  border-top: 1px solid #e5e7eb;
}

.text-wrap {
  white-space: normal;
  word-break: break-word;
}

.max-w-xs {
  max-width: 16rem;
}

.max-w-sm {
  max-width: 24rem;
}

.modern-table th {
  @apply text-left text-sm font-semibold text-gray-700 py-3 border-b border-gray-200;
}

.modern-table td {
  @apply text-sm text-gray-600 py-3 border-b border-gray-100;
}

.hover\:bg-gray-100:hover {
  background-color: #f9fafb;
}

.transition-colors {
  transition: background-color 0.2s ease;
}
</style>