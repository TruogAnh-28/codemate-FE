<template>
  <v-dialog
    v-model="isModalVisible"
    max-width="950"
    persistent
    class="learning-recommendation-modal"
  >
    <v-card class="pa-0 rounded-xl overflow-hidden shadow-lg">
      <!-- Header with Gradient -->
      <v-card-title class="header-gradient text-white pa-6 d-flex align-center">
        <v-icon color="white" class="mr-3" size="28">mdi-school</v-icon>
        <span class="text-h5 font-weight-bold">Learning Recommendation Analysis</span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="closeModal" class="text-black">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Content -->
      <v-card-text class="pa-0 max-h-[65vh] overflow-y-auto bg-gray-50">
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
          <v-icon color="error" size="48">mdi-alert-circle</v-icon>
          <p class="mt-4 text-gray-600">{{ error }}</p>
          <v-btn color="primary" variant="flat" class="mt-4" @click="retryFetch">
            Retry
          </v-btn>
        </div>

        <!-- Data Available State -->
        <div v-else>
          <!-- Main Recommendation Banner -->
          <div class="recommendation-banner px-6 py-8">
            <div class="d-flex align-center mb-4">
              <v-icon :color="getStatusColor()" size="36" class="mr-3">{{ getStatusIcon() }}</v-icon>
              <h2 class="text-h5 font-weight-bold" :class="`text-${getStatusColor()}`">
                {{ getStatusTitle() }}
              </h2>
            </div>
            <p class="text-body-1 recommendation-text">{{ getMainRecommendation() }}</p>
            
            <!-- Action Details -->
            <div v-if="getRecommendedDetails()" class="recommended-details mt-4 py-4 px-6 rounded-lg">
              <div class="d-flex align-center mb-2">
                <v-icon color="secondary" size="20" class="mr-2">mdi-information-outline</v-icon>
                <span class="font-weight-medium">Recommended Content:</span>
              </div>
              <p class="text-body-1 font-weight-medium ml-8">{{ getRecommendedDetails() }}</p>
            </div>
          </div>

          <!-- Issues Overview -->
          <div class="px-6 py-4 bg-white">
            <div class="d-flex justify-space-between align-center mb-4">
              <h3 class="text-h6 font-weight-bold text-primary-darker">Learning Issues Summary</h3>
              <v-chip color="error" variant="outlined" class="font-weight-medium">
                {{ monitorData.issues_analysis.total_issues_count }} total issues
              </v-chip>
            </div>
            
            <!-- Issue Types Distribution -->
            <div class="d-flex mb-6 flex-wrap gap-3">
              <v-chip
                v-for="issue in monitorData.issues_analysis.increasing_issues"
                :key="issue"
                color="warning"
                variant="elevated"
                class="py-2 px-4 text-body-2 font-weight-medium"
                prepend-icon="mdi-trending-up"
              >
                {{ issue }}
              </v-chip>
            </div>
          </div>

          <!-- Significant Issues -->
          <div class="px-6 py-4 bg-white border-t border-gray-100">
            <v-expansion-panels
              variant="accordion"
              flat
              class="rounded-lg shadow-sm"
            >
              <v-expansion-panel elevation="0" class="border rounded-lg">
                <v-expansion-panel-title class="py-4 px-4 bg-gray-50">
                  <div class="d-flex align-center">
                    <v-icon color="primary" class="mr-3">mdi-alert-circle-outline</v-icon>
                    <span class="font-weight-bold text-primary">Significant Learning Issues</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="px-4 py-4">
                  <div class="overflow-x-auto">
                    <v-table dense class="modern-table">
                      <thead>
                        <tr>
                          <th class="text-left">Type</th>
                          <th class="text-left">Description</th>
                          <th class="text-center">Severity</th>
                          <th class="text-center">Frequency</th>
                          <th class="text-left">Impact on Goals</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(issue, index) in monitorData.issues_analysis.significant_issues"
                          :key="index"
                          class="issue-row"
                        >
                          <td class="py-3">
                            <v-chip size="small" color="primary" variant="flat" class="text-capitalize">
                              {{ formatIssueType(issue.type) }}
                            </v-chip>
                          </td>
                          <td class="text-wrap max-w-xs py-3 font-weight-medium">
                            {{ issue.description }}
                          </td>
                          <td class="text-center py-3">
                            <v-chip
                              :color="getSeverityColor(issue.severity)"
                              size="small"
                              variant="elevated"
                              class="font-weight-medium text-white"
                            >
                              {{ issue.severity }}
                            </v-chip>
                          </td>
                          <td class="text-center py-3">
                            <span class="frequency-badge">{{ issue.frequency }}</span>
                          </td>
                          <td class="text-wrap max-w-sm py-3 text-body-2">
                            {{ issue.impact_on_goals }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- Recommendations -->
          <div class="px-6 py-4 bg-white border-t border-gray-100">
            <v-expansion-panels
              variant="accordion"
              flat
              class="rounded-lg shadow-sm"
            >
              <v-expansion-panel elevation="0" class="border rounded-lg">
                <v-expansion-panel-title class="py-4 px-4 bg-gray-50">
                  <div class="d-flex align-center">
                    <v-icon color="secondary" class="mr-3">mdi-lightbulb-outline</v-icon>
                    <span class="font-weight-bold text-secondary-darker">Detailed Recommendations</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="px-4 py-4">
                  <div class="space-y-4">
                    <div
                      v-for="(recommendation, index) in monitorData.recommendations"
                      :key="index"
                      class="p-5 rounded-lg recommendation-card"
                      :class="`recommendation-${recommendation.action}`"
                    >
                      <div class="d-flex align-center mb-3">
                        <v-icon :color="getActionColor(recommendation.action)" size="24" class="mr-3">
                          {{ getActionIcon(recommendation.action) }}
                        </v-icon>
                        <h4 class="text-h6 font-weight-bold" :class="`text-${getActionColor(recommendation.action)}`">
                          {{ formatAction(recommendation.action) }}
                        </h4>
                      </div>
                      <p class="text-body-1 mb-3 recommendation-reason">
                        {{ recommendation.reason }}
                      </p>
                      <div v-if="recommendation.details" class="mt-3 py-3 px-4 details-box rounded">
                        <span class="text-body-2 text-secondary-darker font-weight-medium">
                          {{ recommendation.details }}
                        </span>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-6 bg-white border-t" v-if="!loading && !error">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          class="font-weight-medium"
          @click="closeModal"
        >
          Close
        </v-btn>
        <v-btn
          v-if="shouldShowActionButton()"
          :color="getActionButtonColor()"
          variant="elevated"
          class="font-weight-medium px-6 text-white"
          prepend-icon="mdi-play"
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
const loading = ref(true); 
const error = ref<string | null>(null);

const closeModal = () => {
  isModalVisible.value = false;
  emit("close");
};

const getStatusColor = () => {
  if (monitorData.value.can_proceed) return "success";
  if (monitorData.value.needs_repeat) return "error";
  if (monitorData.value.needs_review_prior) return "warning";
  return "primary";
};

const getStatusIcon = () => {
  if (monitorData.value.can_proceed) return "mdi-check-circle";
  if (monitorData.value.needs_repeat) return "mdi-refresh";
  if (monitorData.value.needs_review_prior) return "mdi-book-open-page-variant";
  return "mdi-information";
};

const getStatusTitle = () => {
  if (monitorData.value.can_proceed) return "Ready to Proceed";
  if (monitorData.value.needs_repeat) return "Lesson Review Recommended";
  if (monitorData.value.needs_review_prior) return "Prior Content Review Needed";
  return "Learning Analysis";
};

const getMainRecommendation = () => {
  const recommendation = monitorData.value.recommendations[0];
  return recommendation?.reason || "No specific recommendation available";
};

const getRecommendedDetails = () => {
  const recommendation = monitorData.value.recommendations.find(r => r.action === "review_prior");
  return recommendation?.details || "";
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "primary";
    default:
      return "grey";
  }
};

const formatIssueType = (type: string) => {
  return type.replace(/_/g, " ");
};

const getActionColor = (action: string) => {
  switch (action) {
    case "repeat":
      return "error";
    case "review_prior":
      return "warning";
    case "proceed":
      return "success";
    default:
      return "primary";
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "repeat":
      return "mdi-refresh";
    case "review_prior":
      return "mdi-book-open-page-variant";
    case "proceed":
      return "mdi-check-circle";
    default:
      return "mdi-information";
  }
};

const formatAction = (action: string) => {
  switch (action) {
    case "repeat":
      return "Repeat Current Lesson";
    case "review_prior":
      return "Review Prior Lessons";
    case "proceed":
      return "Proceed to Next Lesson";
    default:
      return action.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  }
};

const shouldShowActionButton = () => {
  return true; // Always show action button for better UX
};

const getActionButtonColor = () => {
  if (monitorData.value.needs_repeat) return "error";
  if (monitorData.value.needs_review_prior) return "warning";
  if (monitorData.value.can_proceed) return "success";
  return "primary";
};

const getActionButtonText = () => {
  if (monitorData.value.needs_repeat) return "Repeat Lesson";
  if (monitorData.value.needs_review_prior) return "Review Prior Lessons";
  if (monitorData.value.can_proceed) return "Continue to Next Lesson";
  return "Take Action";
};

const handlePrimaryAction = () => {
  if (monitorData.value.needs_repeat) emit("repeat");
  else if (monitorData.value.needs_review_prior) emit("review");
  else emit("proceed");
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
        throw new Error("Please study the course content before proceeding. We will monitor your progress when your progress achieves over 80 percent!");
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
  fetchMonitor();
};

onMounted(() => {
  fetchMonitor();
});
</script>

<style scoped>
.learning-recommendation-modal {
  font-family: 'Roboto', sans-serif;
}

.header-gradient {
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-darker)) 100%);
}

.shadow-lg {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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
  max-width: 18rem;
}

.max-w-sm {
  max-width: 24rem;
}

.modern-table th {
  color: hsl(var(--primary-darker));
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 2px solid hsl(var(--primary) / 0.1);
}

.modern-table td {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.issue-row:hover {
  background-color: #f8f9ff;
  transition: background-color 0.2s ease;
}

.recommendation-banner {
  background-color: #f8f9ff;
  border-bottom: 1px solid #e5e7eb;
}

.recommendation-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #374151;
  max-width: 90%;
}

.recommended-details {
  background-color: rgba(3, 218, 198, 0.08);
  border-left: 4px solid hsl(var(--secondary));
}

.frequency-badge {
  display: inline-block;
  min-width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  background-color: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  font-weight: 600;
}

.recommendation-card {
  background-color: #fcfcfc;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.recommendation-repeat {
  border-left: 4px solid hsl(var(--error));
  background-color: hsl(var(--error) / 0.05);
}

.recommendation-review_prior {
  border-left: 4px solid hsl(var(--warning));
  background-color: hsl(var(--warning) / 0.05);
}

.recommendation-reason {
  color: #4b5563;
  line-height: 1.6;
}

.details-box {
  background-color: hsl(var(--secondary) / 0.08);
  border: 1px dashed hsl(var(--secondary-variant));
}

.gap-3 {
  gap: 0.75rem;
}

.text-primary {
  color: hsl(var(--primary)) !important;
}

.text-primary-darker {
  color: hsl(var(--primary-darker)) !important;
}

.text-secondary {
  color: hsl(var(--secondary)) !important;
}

.text-secondary-darker {
  color: hsl(var(--secondary-darker)) !important;
}

.text-error {
  color: hsl(var(--error)) !important;
}

.text-warning {
  color: hsl(var(--warning)) !important;
}

.text-success {
  color: hsl(var(--success)) !important;
}
</style>