<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="closeModal"
    max-width="950"
    scrollable
    class="learning-recommendation-modal"
  >
    <v-card class="pa-0 rounded-xl overflow-hidden shadow-lg">
      <!-- Header with Gradient -->
      <v-card-title class="header-gradient text-black pa-5 d-flex align-center">
        <v-icon color="white" class="mr-3" size="28">mdi-school-outline</v-icon>
        <span class="text-h5 font-weight-bold">Learning Recommendation Analysis</span>
        <v-spacer></v-spacer>
        <v-btn icon flat density="compact" @click="closeModal" class="text-black">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Content -->
      <v-card-text class="pa-0 content-area bg-grey-lighten-5">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12 d-flex flex-column align-center justify-center fill-height">
          <v-progress-circular
            indeterminate
            color="primary"
            size="50"
            width="4"
          ></v-progress-circular>
          <p class="mt-4 text-medium-emphasis">Loading analysis data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-10 px-6 d-flex flex-column align-center justify-center fill-height">
          <v-icon color="error" size="48">mdi-alert-circle-outline</v-icon>
          <p class="mt-4 text-body-1 text-medium-emphasis">{{ error }}</p>
          <v-btn color="primary" variant="flat" class="mt-4" @click="retryFetch">
            <v-icon left>mdi-refresh</v-icon>
            Retry
          </v-btn>
        </div>

        <!-- No Data State (After Loading, if monitorData is still null) -->
         <div v-else-if="!monitorData" class="text-center py-10 px-6 d-flex flex-column align-center justify-center fill-height">
             <v-icon color="grey-lighten-1" size="48">mdi-information-off-outline</v-icon>
             <p class="mt-4 text-body-1 text-medium-emphasis">No analysis data available for this lesson yet.<br/>Analysis may require more progress.</p>
              <v-btn color="primary" variant="outlined" class="mt-4" @click="retryFetch">
                <v-icon left>mdi-refresh</v-icon>
                 Check Again
             </v-btn>
         </div>

        <!-- Data Available State -->
        <div v-else class="pa-6">
          <!-- Main Recommendation Banner -->
          <div class="recommendation-banner pa-5 mb-6 rounded-lg">
            <div class="d-flex align-center mb-3">
              <v-icon :color="getStatusColor()" size="32" class="mr-3">{{ getStatusIcon() }}</v-icon>
              <h2 class="text-h6 font-weight-bold" :class="`text-${getStatusColor()}`">
                {{ getStatusTitle() }}
              </h2>
            </div>
             <!-- Use formatting for main recommendation reason -->
            <div class="text-body-1 recommendation-text formatted-content">
                <p v-for="(line, index) in formatTextLines(getMainRecommendation)" :key="`main-rec-${index}`" class="mb-1">
                 {{ line }}
                </p>
                 <p v-if="!getMainRecommendation" class="text-medium-emphasis text-body-2 mb-0">
                    Analysis complete. Review details below.
                 </p>
            </div>

            <!-- Action Details (e.g., for review_prior) -->
            <div v-if="getReviewPriorDetails" class="recommended-details mt-4 py-3 px-4 rounded-lg">
              <div class="d-flex align-center mb-2">
                <v-icon color="secondary" size="20" class="mr-2">mdi-information-outline</v-icon>
                <span class="font-weight-medium text-secondary">Recommendation Detail (Review Prior):</span>
              </div>
              <!-- Use formatting for details -->
              <div class="text-body-2 font-weight-medium ml-8 formatted-content">
                 <p v-for="(line, index) in formatTextLines(getReviewPriorDetails)" :key="`detail-rec-${index}`" class="mb-1">
                  {{ line }}
                 </p>
              </div>
            </div>
          </div>

          <!-- Issues Overview -->
          <v-card variant="outlined" class="mb-6">
            <v-card-item class="py-3">
                 <v-card-title class="text-subtitle-1 font-weight-bold d-flex align-center">
                      <v-icon color="primary" start>mdi-format-list-checks</v-icon>
                      Learning Issues Summary
                      <v-spacer></v-spacer>
                        <v-chip color="error" variant="flat" size="small" class="font-weight-medium">
                            {{ monitorData.issues_analysis.total_issues_count }} total issues found
                        </v-chip>
                 </v-card-title>
            </v-card-item>
             <v-divider></v-divider>
             <v-card-text class="pt-4">
                 <!-- Issue Types Distribution -->
                <div v-if="monitorData.issues_analysis.increasing_issues?.length > 0" class="mb-4">
                    <div class="text-caption font-weight-medium text-warning-darken-2 mb-2">Areas Showing Increased Difficulty:</div>
                    <div class="d-flex flex-wrap" style="gap: 8px;">
                    <v-chip
                        v-for="issue in monitorData.issues_analysis.increasing_issues"
                        :key="issue"
                        color="warning"
                        variant="tonal"
                        size="small"
                        class="font-weight-medium"
                        prepend-icon="mdi-trending-up"
                    >
                        {{ issue }}
                    </v-chip>
                    </div>
                </div>
                 <div class="text-caption font-weight-medium text-primary-darken-2">Most Frequent Issue Type:
                    <v-chip color="primary" variant="text" size="small" class="ml-1 font-weight-bold text-capitalize">
                     {{ formatIssueType(monitorData.issues_analysis.most_frequent_type) || 'N/A' }}
                    </v-chip>
                 </div>
             </v-card-text>
          </v-card>


          <!-- Significant Issues & Recommendations Tabs -->
           <v-tabs v-model="tab" color="primary" align-tabs="center" class="mb-4" density="compact">
              <v-tab value="issues">
                  <v-icon start>mdi-alert-circle-outline</v-icon> Significant Issues
               </v-tab>
              <v-tab value="recommendations">
                   <v-icon start>mdi-lightbulb-on-outline</v-icon> Recommendations
              </v-tab>
           </v-tabs>

          <v-window v-model="tab">
                <v-window-item value="issues">
                     <v-card variant="outlined">
                       <v-card-text class="pa-0">
                         <div v-if="!monitorData.issues_analysis?.significant_issues?.length" class="text-center py-6 text-medium-emphasis">
                            No significant issues identified in this analysis.
                         </div>
                          <v-table v-else dense class="modern-table">
                            <thead>
                                <tr>
                                <th class="text-left" style="width: 15%;">Type / Severity</th>
                                <th class="text-left" style="width: 40%;">Description</th>
                                <th class="text-center" style="width: 10%;">Frequency</th>
                                <th class="text-left" style="width: 35%;">Impact on Goals</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="(issue, index) in monitorData.issues_analysis.significant_issues"
                                :key="`issue-${index}`"
                                class="issue-row"
                                >
                                <td class="py-3">
                                    <v-chip size="small" :color="getSeverityColor(issue.severity)" variant="flat" class="text-capitalize font-weight-medium mb-1" block>
                                    {{ formatIssueType(issue.type) }}
                                    </v-chip>
                                     <v-chip size="x-small" :color="getSeverityColor(issue.severity)" variant="tonal" label block>
                                    Severity: {{ issue.severity }}
                                    </v-chip>
                                </td>
                                <td class="text-wrap max-w-xs py-3">
                                    <div class="formatted-content text-body-2">
                                    <p v-for="(line, i) in formatTextLines(issue.description)" :key="`desc-${index}-${i}`" class="mb-1">
                                        {{ line }}
                                    </p>
                                    </div>
                                </td>
                                <td class="text-center py-3">
                                    <span class="frequency-badge">{{ issue.frequency }}</span>
                                </td>
                                <td class="text-wrap max-w-sm py-3">
                                    <div class="formatted-content text-caption">
                                    <p v-for="(line, i) in formatTextLines(issue.impact_on_goals)" :key="`impact-${index}-${i}`" class="mb-1">
                                        {{ line }}
                                    </p>
                                    </div>
                                </td>
                                </tr>
                            </tbody>
                          </v-table>
                       </v-card-text>
                     </v-card>
                </v-window-item>

                <v-window-item value="recommendations">
                  <div v-if="!monitorData.recommendations?.length" class="text-center py-6 text-medium-emphasis">
                     No specific recommendations generated based on this analysis.
                  </div>
                   <div v-else class="space-y-4">
                    <v-card
                      v-for="(recommendation, index) in monitorData.recommendations"
                      :key="`rec-card-${index}`"
                      variant="outlined"
                      class="recommendation-card"
                      :class="`recommendation-${recommendation.action}`"
                    >
                       <v-card-item class="py-3">
                            <div class="d-flex align-center">
                                <v-icon :color="getActionColor(recommendation.action)" size="24" class="mr-3">
                                {{ getActionIcon(recommendation.action) }}
                                </v-icon>
                                <span class="text-subtitle-1 font-weight-bold" :class="`text-${getActionColor(recommendation.action)}`">
                                {{ formatAction(recommendation.action) }}
                                </span>
                            </div>
                       </v-card-item>
                       <v-divider></v-divider>
                       <v-card-text class="pt-4">
                           <div class="text-body-2 mb-3 recommendation-reason formatted-content">
                                <p v-for="(line, i) in formatTextLines(recommendation.reason)" :key="`reason-${index}-${i}`" class="mb-1">
                                {{ line }}
                                </p>
                            </div>
                            <!-- Format Details -->
                            <div v-if="recommendation.details" class="mt-3 py-3 px-4 details-box rounded">
                               <div class="text-caption text-medium-emphasis font-weight-medium formatted-content">
                                <p v-for="(line, i) in formatTextLines(recommendation.details)" :key="`details-${index}-${i}`" class="mb-1">
                                    {{ line }}
                                </p>
                               </div>
                            </div>

                            <!-- Conditional Regenerate Button -->
                            <div v-if="recommendation.action === 'repeat'" class="mt-4 text-right">
                                <v-btn
                                color="error"
                                variant="elevated"
                                class="font-weight-medium px-5 text-white text-none"
                                prepend-icon="mdi-sync"
                                @click="triggerRegenerate"
                                >
                                Regenerate Lesson Content
                                </v-btn>
                            </div>
                       </v-card-text>
                    </v-card>
                  </div>
                </v-window-item>
          </v-window>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-4 bg-grey-lighten-4 border-t" v-if="!loading && !error && monitorData">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          class="font-weight-medium text-none"
          @click="closeModal"
        >
          Close
        </v-btn>
        <!-- Keep the primary action button, but it won't trigger regenerate -->
        <v-btn
          v-if="shouldShowPrimaryActionButton"
          :color="getActionButtonColor"
          variant="elevated"
          class="font-weight-medium px-5 text-white text-none"
          :prepend-icon="getActionButtonIcon"
          @click="handlePrimaryAction"
        >
          {{ getActionButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, inject } from "vue";
import { aiGenerateServices } from "@/services/aiGenerateServices";
import { useCourseStore } from "@/stores/courseStore";
import { RecommendLessonMonitor } from "@/types/AI_generate";

// --- Helper Function ---
const formatTextLines = (text: string | undefined | null): string[] => {
  if (!text) return [];
  const textAsString = String(text);
  return textAsString.split('\n').map(line => line.trim()).filter(line => line.length > 0);
};
// --- End Helper Function ---

const props = defineProps({
  recommend_lesson_id: {
    type: String,
    required: true,
  },
   modelValue: {
     type: Boolean,
     required: true,
   },
});

const emit = defineEmits(["close", "proceed", "review", "repeat", "regenerate", "update:modelValue"]);

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void; 

// Reactive State
const monitorData = ref<RecommendLessonMonitor | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const tab = ref('issues'); // Default tab

// // Computed for modal visibility
// const isModalVisible = computed({
//   get: () => props.modelValue,
//   set: (value) => emit("update:modelValue", value),
// });

// Methods
const closeModal = () => {
  emit("update:modelValue", false); // Emit update event
  emit("close");
};

// --- Computed properties ---
const getOverallStatus = computed((): 'proceed' | 'repeat' | 'review_prior' | 'unknown' => {
    if (!monitorData.value) return 'unknown';
    if (monitorData.value.needs_repeat) return 'repeat';
    if (monitorData.value.needs_review_prior) return 'review_prior';
    if (monitorData.value.can_proceed) return 'proceed';
    return 'unknown'; // Fallback
});

const getMainRecommendation = computed(() => {
    if (!monitorData.value?.recommendations?.length) {
        return ""; // Return empty string if no recommendations
    }
    const status = getOverallStatus.value;
    const recommendation = monitorData.value.recommendations.find(r => r.action === status);
    // Fallback to the first recommendation if specific status not found (shouldn't happen often)
    return recommendation?.reason || monitorData.value.recommendations[0]?.reason || "";
});

const getReviewPriorDetails = computed(() => {
  if (!monitorData.value?.recommendations) return "";
  const recommendation = monitorData.value.recommendations.find(r => r.action === "review_prior");
  return recommendation?.details || "";
});

// --- Status/Action getters ---
const getStatusColor = () => {
  switch (getOverallStatus.value) {
    case "proceed": return "success";
    case "repeat": return "error";
    case "review_prior": return "warning";
    default: return "primary";
  }
};

const getStatusIcon = () => {
 switch (getOverallStatus.value) {
    case "proceed": return "mdi-check-circle-outline";
    case "repeat": return "mdi-sync-alert";
    case "review_prior": return "mdi-history";
    default: return "mdi-information-outline";
 }
};

const getStatusTitle = () => {
  switch (getOverallStatus.value) {
    case "proceed": return "Ready to Proceed";
    case "repeat": return "Lesson Repetition Recommended";
    case "review_prior": return "Prior Content Review Needed";
    default: return "Learning Analysis Result";
  }
};

const getSeverityColor = (severity: string | undefined | null): string => {
   switch (severity?.toLowerCase()) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "info";
    default: return "grey";
  }
};

const formatIssueType = (type: string | undefined | null): string => {
  return type ? type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown Issue';
};

const getActionColor = (action: string): string => {
   switch (action) {
    case "repeat": return "error";
    case "review_prior": return "warning";
    case "proceed": return "success";
    default: return "primary";
  }
};

const getActionIcon = (action: string): string => {
  switch (action) {
    case "repeat": return "mdi-refresh";
    case "review_prior": return "mdi-book-open-page-variant-outline";
    case "proceed": return "mdi-play-circle-outline";
    default: return "mdi-information-outline";
  }
};

const formatAction = (action: string): string => {
   switch (action) {
    case "repeat": return "Repeat Current Lesson";
    case "review_prior": return "Review Prior Lessons";
    case "proceed": return "Proceed to Next Lesson";
    default:
        return action ? action.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : 'Recommendation';
  }
};

// --- Footer Action Button Logic ---
const shouldShowPrimaryActionButton = computed(() => {
  return getOverallStatus.value !== 'repeat' && getOverallStatus.value !== 'unknown';
});

const getActionButtonColor = computed(() => {
   if (getOverallStatus.value === 'review_prior') return "warning";
   if (getOverallStatus.value === 'proceed') return "success";
   return "primary";
});

const getActionButtonIcon = computed(() => {
   if (getOverallStatus.value === 'review_prior') return getActionIcon('review_prior');
   if (getOverallStatus.value === 'proceed') return getActionIcon('proceed');
   return 'mdi-play';
});

const getActionButtonText = computed(() => {
   if (getOverallStatus.value === 'review_prior') return formatAction('review_prior');
   if (getOverallStatus.value === 'proceed') return formatAction('proceed');
   return "Acknowledge";
});

const handlePrimaryAction = () => {
  const status = getOverallStatus.value;
  if (status === 'review_prior') emit("review");
  else if (status === 'proceed') emit("proceed");
  // No emit('repeat') here
  closeModal();
};

// --- Regenerate Action ---
const triggerRegenerate = () => {
    if (monitorData.value) {
        emit('regenerate', monitorData.value);
    } else {
        console.error("Cannot regenerate: Monitor data is not available.");
         showError("Cannot trigger regeneration: analysis data is missing.");
    }
};

// --- Data Fetching ---
const fetchMonitor = async () => {
  loading.value = true;
  error.value = null;
  monitorData.value = null;
  try {
    const courseStore = useCourseStore.getState();
    const courseDetails = courseStore.getCourseDetails();
    console.log(`Fetching monitor for lesson ${props.recommend_lesson_id}`);

    if (courseDetails && props.recommend_lesson_id) {
       const courseId = "course_id" in courseDetails ? String(courseDetails.course_id) : "id" in courseDetails ? String(courseDetails.id) : null;
       if (!courseId) throw new Error("Course ID is missing.");

       const response = await aiGenerateServices.getMonitorRecommendLesson(
         { showError, showSuccess }, // Pass notification functions
         courseId,
         props.recommend_lesson_id
       );
       console.log("Monitor API Raw Response:", response);

       if (response && response.data) {
           if ('can_proceed' in response.data && 'issues_analysis' in response.data) {
             monitorData.value = response.data as RecommendLessonMonitor;
             console.log("Monitor Data Parsed:", monitorData.value);
           } else {
             console.warn("Monitor API success, but data structure mismatch:", response.data);
             throw new Error("Received unexpected data structure from analysis API.");
           }
       } else {
           const errorMessage = (response && response.message) ? response.message : "Failed to load analysis data. Server response not successful.";
           console.error("Error fetching monitor data:", errorMessage, response);
           if (errorMessage.includes("requires more progress") || errorMessage.includes("80 percent")) {
             error.value = "Analysis requires more progress (>= 80%) on the lesson activities.";
           } else if (!response) {
                error.value = "Analysis data not found. Please complete some activities first.";
           }
           else {
               error.value = errorMessage;
           }
           // Do not throw here, let error display in modal
       }
    } else {
       throw new Error("Course details or Lesson ID not available for fetching analysis.");
    }
  } catch (err) {
     const message = err instanceof Error ? err.message : "An unexpected error occurred while fetching analysis data.";
     console.error("Exception during fetchMonitor:", err);
     error.value = message; // Set error to display
  } finally {
    loading.value = false;
  }
};

const retryFetch = () => {
  fetchMonitor();
};

// Fetch data when the modal becomes visible
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        fetchMonitor();
        tab.value = 'issues'; // Reset tab on open
    }
});

// Initial fetch if the modal starts open (less common but good practice)
onMounted(() => {
  if (props.modelValue) {
     fetchMonitor();
  }
});

</script>

<style scoped>
/* Add styles for the formatted content */
.formatted-content p {
  margin-bottom: 0.5em;
  line-height: 1.6;
  white-space: pre-wrap; /* Preserve whitespace and wrap */
  word-wrap: break-word;
}
.formatted-content p:last-child {
  margin-bottom: 0;
}
.formatted-content p:where(:starts-with('•'), :starts-with('*'), :starts-with('-')) {
  padding-left: 1.5em;
  text-indent: -1.5em;
}
.formatted-content p:where(:starts-with('1.'), :starts-with('2.'), :starts-with('3.')) {
  padding-left: 1.8em;
  text-indent: -1.8em;
  margin-left: 0.2em;
}

.content-area {
    max-height: calc(80vh - 120px); /* Adjust max height based on header/footer */
    overflow-y: auto;
}
.fill-height {
    min-height: 300px; /* Ensure loading/error states have some height */
}


.learning-recommendation-modal {
  font-family: 'Roboto', sans-serif;
}

.header-gradient {
  background: linear-gradient(135deg, hsl(var(--v-theme-primary)) 0%, hsl(var(--v-theme-primary-darker)) 100%);
}

.shadow-lg {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.06); /* Enhanced shadow */
}

.border-t {
  border-top: 1px solid #e5e7eb; /* light gray */
}

.text-wrap {
  white-space: normal;
  word-break: break-word;
}

.max-w-xs { max-width: 22rem; }
.max-w-sm { max-width: 30rem; }

.modern-table {
    width: 100%;
    border-collapse: collapse;
}
.modern-table th {
  color: hsl(var(--v-theme-primary-darker));
  font-size: 0.75rem; /* Smaller header */
  font-weight: 700; /* Bolder */
  padding: 0.75rem 1rem;
  background-color: #f9fafb; /* Very light grey */
  border-bottom: 2px solid hsla(var(--v-theme-primary), 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky; /* Make header sticky */
  top: 0; /* Stick to top */
  z-index: 1;
}

.modern-table td {
  padding: 0.8rem 1rem; /* Increased padding */
  border-bottom: 1px solid #f1f5f9; /* Lighter border */
  vertical-align: top;
  font-size: 0.875rem; /* Slightly smaller body text */
}

.issue-row:hover {
  background-color: #f8f9ff;
  transition: background-color 0.2s ease;
}

.recommendation-banner {
  background-color: rgba(var(--v-theme-primary-rgb), 0.05); /* Use primary tint */
  border: 1px solid rgba(var(--v-theme-primary-rgb), 0.1);
}

.recommendation-text {
  font-size: 1rem;
  line-height: 1.7; /* More spacing */
  color: #374151;
}

.recommended-details {
  background-color: rgba(var(--v-theme-secondary-rgb), 0.07);
  border-left: 4px solid hsl(var(--v-theme-secondary));
  border: 1px solid rgba(var(--v-theme-secondary-rgb), 0.1);
  border-left-width: 4px; /* Ensure left border is prominent */
}

.frequency-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: hsla(var(--v-theme-primary), 0.15);
  color: hsl(var(--v-theme-primary));
  font-weight: 600;
  font-size: 0.8rem;
}

.recommendation-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left-width: 4px; /* Prepare for colored border */
}
.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.recommendation-repeat { border-left-color: hsl(var(--v-theme-error)); }
.recommendation-review_prior { border-left-color: hsl(var(--v-theme-warning)); }
.recommendation-proceed { border-left-color: hsl(var(--v-theme-success)); }
.recommendation-default { border-left-color: hsl(var(--v-theme-primary));} /* Fallback */


.recommendation-reason {
  color: #4b5563;
  line-height: 1.6;
}

.details-box {
  background-color: rgba(0,0,0,0.03); /* Subtle grey background */
  border: 1px dashed rgba(0,0,0,0.2);
}
.details-box .formatted-content p {
    font-size: 0.85rem;
    color: #555;
}


.space-y-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}

/* Vuetify Overrides / Enhancements */
:deep(.v-expansion-panel-title) {
    padding: 1rem 1rem;
    font-weight: 600;
}
:deep(.v-expansion-panel-text__wrapper) {
    padding: 0; /* Remove default padding */
}

:deep(.v-chip) {
    font-size: 0.8rem;
}
.text-h5 { font-size: 1.5rem !important; line-height: 1.4;}
.text-h6 { font-size: 1.2rem !important; line-height: 1.4;}
.text-subtitle-1 { font-size: 1rem !important; }
.text-body-1 { font-size: 0.95rem !important; }
.text-body-2 { font-size: 0.875rem !important; }
.text-caption { font-size: 0.8rem !important; }


</style>