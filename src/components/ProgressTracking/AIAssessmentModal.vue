<template>
  <v-dialog v-model="dialogOpen" max-width="900px" persistent scrollable>
    <v-card class="assessment-modal">
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="42" class="mr-3">
            <v-icon>mdi-robot</v-icon>
          </v-avatar>
          <span class="text-h5">AI Learning Assessment</span>
        </div>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container fluid class="pa-0">
          <!-- Loading state -->
          <div v-if="loading" class="d-flex flex-column align-center py-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <p class="mt-4 text-body-1">Analyzing your progress...</p>
          </div>

          <!-- Assessment data -->
          <div v-else-if="assessmentData">
            <v-row>
              <v-col cols="12">
                <v-card class="mb-4 pa-4 rounded-lg" color="primary" dark>
                  <div class="d-flex align-center mb-2">
                    <v-icon size="large" class="mr-2">mdi-target</v-icon>
                    <div class="text-h6">Your Learning Goal</div>
                  </div>
                  <p class="text-body-1">{{ assessmentData.learning_goal }}</p>
                  <div class="text-caption mt-2">
                    Assessment Date:
                    {{ formatDate(assessmentData.assessment_date) }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-card class="mb-4 pa-4 rounded-lg assessment-section">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="primary" size="large" class="mr-2"
                      >mdi-chart-box</v-icon
                    >
                    <div class="text-h6">Assessment Summary</div>
                  </div>

                  <div class="star-section mb-4">
                    <div class="section-label">
                      <v-icon color="primary">mdi-information</v-icon>
                      <span>Situation</span>
                    </div>
                    <p>{{ assessmentData.assessment_summary.situation }}</p>
                  </div>

                  <div class="star-section mb-4">
                    <div class="section-label">
                      <v-icon color="primary">mdi-clipboard-list</v-icon>
                      <span>Task</span>
                    </div>
                    <p>{{ assessmentData.assessment_summary.task }}</p>
                  </div>

                  <div class="star-section mb-4">
                    <div class="section-label">
                      <v-icon color="primary">mdi-hand</v-icon>
                      <span>Action</span>
                    </div>
                    <v-list>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-book</v-icon>
                        </template>
                        <v-list-item-title
                          >Theoretical Knowledge</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          {{
                            assessmentData.assessment_summary.action
                              .theoretical_knowledge
                          }}
                        </v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-code-tags</v-icon>
                        </template>
                        <v-list-item-title>Coding Skills</v-list-item-title>
                        <v-list-item-subtitle>
                          {{
                            assessmentData.assessment_summary.action
                              .coding_skills
                          }}
                        </v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-run</v-icon>
                        </template>
                        <v-list-item-title>Effort</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ assessmentData.assessment_summary.action.effort }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>

                  <div class="star-section">
                    <div class="section-label">
                      <v-icon color="primary">mdi-check-decagram</v-icon>
                      <span>Result</span>
                    </div>
                    <p>{{ assessmentData.assessment_summary.result }}</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-card class="mb-4 pa-4 rounded-lg assessment-section h-100">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="success" size="large" class="mr-2"
                      >mdi-trophy</v-icon
                    >
                    <div class="text-h6">Strengths</div>
                  </div>
                  <p>{{ assessmentData.progress_review.strengths }}</p>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card class="mb-4 pa-4 rounded-lg assessment-section h-100">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="warning" size="large" class="mr-2"
                      >mdi-alert-circle</v-icon
                    >
                    <div class="text-h6">Areas to Note</div>
                  </div>
                  <p>{{ assessmentData.progress_review.areas_to_note }}</p>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-card class="mb-4 pa-4 rounded-lg assessment-section">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="info" size="large" class="mr-2"
                      >mdi-lightbulb</v-icon
                    >
                    <div class="text-h6">Advice for Improvement</div>
                  </div>

                  <v-expansion-panels variant="accordion" class="mt-2">
                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-book</v-icon>
                          Theoretical Knowledge
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        {{ assessmentData.advice.theoretical_knowledge }}
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2"
                            >mdi-code-tags</v-icon
                          >
                          Coding Skills
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        {{ assessmentData.advice.coding_skills }}
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-run</v-icon>
                          Effort
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        {{ assessmentData.advice.effort }}
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- No data state -->
          <div v-else class="d-flex flex-column align-center py-8">
            <v-icon size="64" color="grey">mdi-alert</v-icon>
            <p class="mt-4 text-body-1">
              No assessment data available. Please try again.
            </p>
          </div>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="closeModal">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { StudentAssessment } from "@/types/ProgressTracking";

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

// Local reactive state
const dialogOpen = ref(props.modelValue);

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    dialogOpen.value = newValue;
  }
);

// Watch for local changes
watch(dialogOpen, (newValue) => {
  emit("update:modelValue", newValue);
});

// Methods
const closeModal = () => {
  dialogOpen.value = false;
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};
</script>

<style scoped>
.assessment-modal {
  border-radius: 12px;
  overflow: hidden;
}

.assessment-section {
  border-left: 3px solid #6366f1;
  transition: transform 0.2s;
}

.assessment-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.star-section {
  margin-left: 8px;
  padding-left: 12px;
  border-left: 2px solid #e2e8f0;
}

.section-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
}

.section-label span {
  margin-left: 8px;
}

.h-100 {
  height: 100%;
}

:deep(.v-expansion-panel) {
  margin-bottom: 8px;
  border-radius: 8px !important;
  overflow: hidden;
}

:deep(.v-expansion-panel-title) {
  padding: 12px 16px;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 16px;
}
</style>
