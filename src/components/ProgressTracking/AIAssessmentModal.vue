<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="closeModal"
    max-width="900px"
    persistent
    scrollable
  >
    <v-card class="assessment-modal">
      <v-card-title class="d-flex justify-space-between align-center pa-4 bg-grey-lighten-4">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="40" class="mr-3 elevation-1">
            <v-icon color="white">mdi-chart-timeline-variant</v-icon>
          </v-avatar>
          <span class="text-h6">AI Learning Assessment</span>
        </div>
        <v-btn icon flat density="compact" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0 content-area">
        <!-- Loading state -->
          <div v-if="loading" class="d-flex flex-column align-center justify-center text-center py-12 fill-height">
            <v-progress-circular
              indeterminate
              color="primary"
              size="50"
              width="4"
            ></v-progress-circular>
            <p class="mt-4 text-body-1 text-medium-emphasis">Analyzing your progress...</p>
          </div>

          <!-- Assessment data -->
          <div v-else-if="assessmentData" class="pa-5">
            <v-row>
              <v-col cols="12">
                <v-card class="mb-5 pa-4 rounded-lg" color="primary-lighten-5" variant="tonal">
                  <div class="d-flex align-start mb-2"> <!-- Align start for potentially long goals -->
                    <v-icon size="large" class="mr-3 mt-1" color="primary">mdi-bullseye-arrow</v-icon>
                    <div>
                        <div class="text-h6 text-primary">Your Learning Goal</div>
                         <!-- Format Learning Goal -->
                        <div class="text-body-1 mt-1 formatted-content">
                            <p v-for="(line, i) in formatTextLines(assessmentData.learning_goal)" :key="`goal-${i}`" class="mb-1">
                            {{ line }}
                            </p>
                            <p v-if="!assessmentData.learning_goal" class="text-medium-emphasis text-body-2 mb-0">
                                No specific goal provided for this assessment.
                            </p>
                        </div>
                    </div>
                  </div>
                  <div class="text-caption text-medium-emphasis text-right mt-2">
                    Assessment Date:
                    {{ formatDate(assessmentData.assessment_date) }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                 <!-- STAR Assessment Summary -->
                <v-card class="mb-5 pa-4 rounded-lg assessment-section">
                   <div class="d-flex align-center mb-4">
                    <v-icon color="primary" size="large" class="mr-2">mdi-star-four-points-outline</v-icon>
                    <div class="text-h6">Assessment Summary (STAR Method)</div>
                   </div>

                  <div class="star-section mb-4">
                    <div class="section-label">
                      <v-icon color="primary-darken-1">mdi-map-marker-outline</v-icon>
                      <span>Situation</span>
                    </div>
                    <!-- Format Situation -->
                    <div class="formatted-content text-body-2">
                      <p v-for="(line, i) in formatTextLines(assessmentData.assessment_summary?.situation)" :key="`sit-${i}`" class="mb-1">
                        {{ line }}
                      </p>
                      <p v-if="!assessmentData.assessment_summary?.situation" class="text-medium-emphasis text-caption mb-0">N/A</p>
                    </div>
                  </div>

                  <div class="star-section mb-4">
                    <div class="section-label">
                      <v-icon color="primary-darken-1">mdi-format-list-bulleted-type</v-icon>
                      <span>Task</span>
                    </div>
                    <!-- Format Task -->
                     <div class="formatted-content text-body-2">
                      <p v-for="(line, i) in formatTextLines(assessmentData.assessment_summary?.task)" :key="`task-${i}`" class="mb-1">
                        {{ line }}
                      </p>
                      <p v-if="!assessmentData.assessment_summary?.task" class="text-medium-emphasis text-caption mb-0">N/A</p>
                    </div>
                  </div>

                  <div class="star-section mb-4">
                    <div class="section-label">
                      <v-icon color="primary-darken-1">mdi-directions-run</v-icon>
                      <span>Action</span>
                    </div>
                    <!-- Format Action subsections -->
                    <v-list density="compact" class="pl-4 bg-transparent">
                       <v-list-item class="px-0 mb-2">
                         <template v-slot:prepend>
                           <v-icon color="primary" class="mr-2 list-icon">mdi-book-open-variant</v-icon>
                           <v-list-item-title class="font-weight-medium text-body-1">Theoretical Knowledge</v-list-item-title>
                         </template>
                         <v-list-item-subtitle class="pl-10 pt-1">
                           <div class="formatted-content text-body-2">
                              <p v-for="(line, i) in formatTextLines(assessmentData.assessment_summary?.action?.theoretical_knowledge)" :key="`act-theo-${i}`" class="mb-1">
                                {{ line }}
                              </p>
                               <p v-if="!assessmentData.assessment_summary?.action?.theoretical_knowledge" class="text-medium-emphasis text-caption mb-0">N/A</p>
                            </div>
                         </v-list-item-subtitle>
                       </v-list-item>

                       <v-list-item class="px-0 mb-2">
                         <template v-slot:prepend>
                           <v-icon color="primary" class="mr-2 list-icon">mdi-code-braces</v-icon>
                            <v-list-item-title class="font-weight-medium text-body-1">Coding Skills</v-list-item-title>
                         </template>
                         <v-list-item-subtitle class="pl-10 pt-1">
                            <div class="formatted-content text-body-2">
                                <p v-for="(line, i) in formatTextLines(assessmentData.assessment_summary?.action?.coding_skills)" :key="`act-code-${i}`" class="mb-1">
                                    {{ line }}
                                </p>
                                <p v-if="!assessmentData.assessment_summary?.action?.coding_skills" class="text-medium-emphasis text-caption mb-0">N/A or Not Assessed</p>
                            </div>
                         </v-list-item-subtitle>
                       </v-list-item>

                       <v-list-item class="px-0">
                         <template v-slot:prepend>
                           <v-icon color="primary" class="mr-2 list-icon">mdi-timer-sand</v-icon>
                            <v-list-item-title class="font-weight-medium text-body-1">Effort</v-list-item-title>
                         </template>
                         <v-list-item-subtitle class="pl-10 pt-1">
                            <div class="formatted-content text-body-2">
                                <p v-for="(line, i) in formatTextLines(assessmentData.assessment_summary?.action?.effort)" :key="`act-eff-${i}`" class="mb-1">
                                    {{ line }}
                                </p>
                                 <p v-if="!assessmentData.assessment_summary?.action?.effort" class="text-medium-emphasis text-caption mb-0">N/A</p>
                            </div>
                         </v-list-item-subtitle>
                       </v-list-item>
                    </v-list>
                  </div>

                  <div class="star-section">
                    <div class="section-label">
                      <v-icon color="primary-darken-1">mdi-check-decagram-outline</v-icon>
                      <span>Result</span>
                    </div>
                     <!-- Format Result -->
                     <div class="formatted-content text-body-2">
                      <p v-for="(line, i) in formatTextLines(assessmentData.assessment_summary?.result)" :key="`res-${i}`" class="mb-1">
                        {{ line }}
                      </p>
                       <p v-if="!assessmentData.assessment_summary?.result" class="text-medium-emphasis text-caption mb-0">N/A</p>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <!-- Strengths -->
              <v-col cols="12" md="6">
                <v-card class="mb-5 pa-4 rounded-lg assessment-section h-100">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="success" size="large" class="mr-2">mdi-thumb-up-outline</v-icon>
                    <div class="text-h6">Strengths</div>
                  </div>
                   <!-- Format Strengths -->
                   <div class="formatted-content text-body-2">
                     <p v-for="(line, i) in formatTextLines(assessmentData.progress_review?.strengths)" :key="`str-${i}`" class="mb-1">
                       {{ line }}
                     </p>
                      <p v-if="!assessmentData.progress_review?.strengths" class="text-medium-emphasis text-caption mb-0">No specific strengths noted in this assessment.</p>
                   </div>
                </v-card>
              </v-col>

              <!-- Areas to Note -->
              <v-col cols="12" md="6">
                <v-card class="mb-5 pa-4 rounded-lg assessment-section h-100">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="warning" size="large" class="mr-2">mdi-alert-outline</v-icon>
                    <div class="text-h6">Areas to Note</div>
                  </div>
                   <!-- Format Areas to Note -->
                   <div class="formatted-content text-body-2">
                      <p v-for="(line, i) in formatTextLines(assessmentData.progress_review?.areas_to_note)" :key="`note-${i}`" class="mb-1">
                        {{ line }}
                      </p>
                      <p v-if="!assessmentData.progress_review?.areas_to_note" class="text-medium-emphasis text-caption mb-0">No specific areas for improvement noted.</p>
                   </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Advice -->
            <v-row>
              <v-col cols="12">
                <v-card class="mb-4 pa-4 rounded-lg assessment-section">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="info" size="large" class="mr-2">mdi-lightbulb-on-outline</v-icon>
                    <div class="text-h6">Advice for Improvement</div>
                  </div>

                  <v-expansion-panels variant="accordion" class="mt-2 advice-panels">
                    <v-expansion-panel elevation="0">
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-book-open-variant</v-icon>
                          Theoretical Knowledge
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <!-- Format Advice: Theoretical -->
                        <div class="formatted-content pa-2 text-body-2">
                           <p v-for="(line, i) in formatTextLines(assessmentData.advice?.theoretical_knowledge)" :key="`adv-theo-${i}`" class="mb-1">
                             {{ line }}
                           </p>
                            <p v-if="!assessmentData.advice?.theoretical_knowledge" class="text-medium-emphasis text-caption mb-0">No specific advice provided.</p>
                         </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel elevation="0">
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-code-braces</v-icon>
                          Coding Skills
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                         <!-- Format Advice: Coding -->
                        <div class="formatted-content pa-2 text-body-2">
                           <p v-for="(line, i) in formatTextLines(assessmentData.advice?.coding_skills)" :key="`adv-code-${i}`" class="mb-1">
                             {{ line }}
                           </p>
                           <p v-if="!assessmentData.advice?.coding_skills" class="text-medium-emphasis text-caption mb-0">No specific advice provided or not applicable.</p>
                         </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel elevation="0">
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-timer-sand</v-icon>
                          Effort
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                         <!-- Format Advice: Effort -->
                         <div class="formatted-content pa-2 text-body-2">
                           <p v-for="(line, i) in formatTextLines(assessmentData.advice?.effort)" :key="`adv-eff-${i}`" class="mb-1">
                             {{ line }}
                           </p>
                            <p v-if="!assessmentData.advice?.effort" class="text-medium-emphasis text-caption mb-0">No specific advice provided.</p>
                         </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- No data state (after loading) -->
          <div v-else-if="!loading && !assessmentData" class="d-flex flex-column align-center justify-center text-center py-12 fill-height">
            <v-icon size="64" color="grey-lighten-1">mdi-file-question-outline</v-icon>
            <p class="mt-4 text-body-1 text-medium-emphasis">
              No assessment data is available at this time.<br/>Please check back later or ensure progress has been made.
            </p>
          </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="closeModal" class="text-none">
          Close Assessment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue"; // Added computed
import { StudentAssessment } from "@/types/ProgressTracking";

// --- Helper Function ---
const formatTextLines = (text: string | undefined | null): string[] => {
  if (!text) return [];
  const textAsString = String(text);
  return textAsString.split('\n').map(line => line.trim()).filter(line => line.length > 0);
};
// --- End Helper Function ---

// Props
const props = defineProps<{
  modelValue: boolean;
  assessmentData: StudentAssessment | null;
  loading: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// Computed property for dialog visibility
const dialogOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value)
});

// Methods
const closeModal = () => {
  dialogOpen.value = false; // This will trigger the emit via computed setter
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    const cleanDateString = dateString.split('T')[0]; // Handle 'YYYY-MM-DDTHH:MM:SSZ'
    const date = new Date(cleanDateString);
    // Add timeZone UTC if it's just a date to avoid off-by-one day issues
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: 'UTC'
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return dateString; // Return original if formatting fails
  }
};
</script>

<style scoped>
/* Add styles for the formatted content */
.formatted-content p {
  margin-bottom: 0.6em; /* Slightly more space */
  line-height: 1.65; /* Improve readability */
  white-space: pre-wrap;
  word-wrap: break-word;
}
.formatted-content p:last-child {
  margin-bottom: 0;
}
/* Optional list styling */
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
    max-height: calc(80vh - 110px); /* Adjust based on header/footer height */
    overflow-y: auto;
}
.fill-height {
    min-height: 350px;
}


.assessment-modal {
  border-radius: 12px;
  overflow: hidden; /* Important for scrollable content */
  background-color: #f8f9fa; /* Light background for the whole modal */
}

.assessment-section {
  border: 1px solid #e0e0e0; /* Subtle border */
  border-left: 4px solid #6366f1; /* primary color */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: #ffffff; /* White background for sections */
}
.assessment-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
}


.star-section {
  margin-left: 8px;
  padding-left: 16px;
  border-left: 2px solid #e2e8f0; /* lighter gray */
}
.star-section:not(:last-child) {
    padding-bottom: 1rem; /* Space below section before next */
    margin-bottom: 1rem; /* Space below section before next */
}


.section-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #374151; /* Darker gray */
  font-size: 1rem; /* Match text-body-1 */
}

.section-label .v-icon {
  margin-right: 10px; /* More space for icon */
  opacity: 0.8;
}

.h-100 {
  height: 100%;
}


:deep(.v-list-item) {
    padding-left: 0 !important;
    padding-right: 0 !important;
    min-height: auto;
}
:deep(.v-list-item-subtitle) {
  white-space: normal;
  line-height: 1.55;
  padding-top: 2px; /* Smaller gap */
  color: #555; /* Subtler color */
  opacity: 1; /* Ensure full opacity */
}
:deep(.v-list-item__prepend > .v-icon.list-icon) {
    margin-top: 2px; /* Align icon better with title */
    align-self: flex-start;
}
:deep(.v-list-item-title) {
    line-height: 1.4;
    font-weight: 500; /* Medium weight */
}


.advice-panels {
    border: 1px solid #eee;
    border-radius: 8px;
}
:deep(.v-expansion-panel) {
  margin-bottom: 0 !important; /* Remove space between accordion items */
  border-radius: 0 !important; /* Remove individual radius */
  border-bottom: 1px solid #eee; /* Separator */
   background-color: #fdfdfd;
}
:deep(.v-expansion-panel:first-child) {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
}
:deep(.v-expansion-panel:last-child) {
    border-bottom: none; /* No bottom border on last item */
     border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}

:deep(.v-expansion-panel-title) {
  padding: 14px 18px; /* Adjust padding */
  font-weight: 500;
   min-height: 48px; /* Ensure consistent height */
}
:deep(.v-expansion-panel-title--active) {
    color: hsl(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary-rgb), 0.05);
}


:deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 18px 16px 18px; /* Adjust padding */
   background-color: #ffffff; /* White background for content */
}
:deep(.v-expansion-panel-text .formatted-content p) {
    font-size: 0.9rem; /* Slightly smaller text inside panels */
     line-height: 1.6;
}

.text-h6 { font-size: 1.15rem !important; }
.text-body-1 { font-size: 1rem !important; }
.text-body-2 { font-size: 0.9rem !important; }
.text-caption { font-size: 0.8rem !important; }

</style>