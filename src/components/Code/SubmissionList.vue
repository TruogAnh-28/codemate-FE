<template>
  <v-container>
    <!-- Submission List -->
    <v-card class="mb-4" elevation="1">
      <v-card-title class="text-subtitle-1 font-weight-bold">Submission History</v-card-title>
      <v-divider></v-divider>
        <div style="max-height: 400px; overflow-y: auto;">
          <v-list density="compact" class="pa-0">
            <v-list-item
              v-for="submission in submissions"
              :key="submission.id"
              class="hoverable-list-item"
            >
              <v-list-item-content>
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex flex-column">
                    <div class="text-caption text-grey">{{ formatDate(submission.created_at || new Date()) }}</div>
                    <div class="d-flex align-center">
                      <v-chip
                        :color="getStatusColor(submission.status)"
                        size="x-small"
                        class="me-2"
                        label
                      >
                        {{ submission.status }}
                      </v-chip>
                      <span class="text-body-2">{{ submission.passed_testcases }} / {{ submission.total_testcases }} testcases</span>
                    </div>
                  </div>
                  <v-btn icon size="small" variant="text" @click.stop="openModal(submission)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
    </v-card>

    <!-- Submission Detail Modal -->
    <v-dialog v-model="dialog" max-width="1000">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          Submission Details
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-card-text>
          <v-expansion-panels multiple variant="accordion">
            <!-- LLM Evaluation Panel -->
            <v-expansion-panel title="🤖 Coding Assistant Evaluation" value="evaluation">
              <v-expansion-panel-text>
                <div class="d-flex align-center mb-4">
                  <v-progress-circular
                    :model-value="(evaluation.score / evaluation.max_score) * 100"
                    :size="80"
                    :width="8"
                    color="primary"
                    class="me-4"
                  >
                    <span class="text-h6">{{ evaluation.score }}</span>
                  </v-progress-circular>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">Overall Score</div>
                    <div class="text-caption text-grey">{{ evaluation.summary }}</div>
                  </div>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="mb-4">
                  <div class="text-subtitle-2 mb-2">Evaluation Criteria</div>
                  <v-list density="compact" class="bg-grey-darken-3 rounded">
                    <v-list-item
                      v-for="criterion in evaluation.criteria"
                      :key="criterion.name"
                      class="mb-2"
                    >
                      <template v-slot:prepend>
                        <v-progress-circular
                          :model-value="(criterion.score / 10) * 100"
                          :size="24"
                          :width="2"
                          color="primary"
                          class="me-2"
                        >
                          <span class="text-caption">{{ criterion.score }}</span>
                        </v-progress-circular>
                      </template>
                      <v-list-item-title class="text-body-2">{{ criterion.name }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption">{{ criterion.comment }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </div>

                <v-divider class="my-4"></v-divider>

                <div>
                  <div class="text-subtitle-2 mb-2">Improvement Suggestions</div>
                  <v-list density="compact" class="bg-grey-darken-3 rounded">
                    <v-list-item
                      v-for="(suggestion, index) in evaluation.improvement_suggestions"
                      :key="index"
                    >
                      <template v-slot:prepend>
                        <v-icon color="primary" size="small">mdi-lightbulb-outline</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">{{ suggestion }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Submission Code Panel -->
            <v-expansion-panel title="📄 Submitted Code">
              <v-expansion-panel-text>
                <v-sheet color="grey-darken-4" class="pa-3 rounded">
                  <pre class="code-block">{{ detailsCodeContent }}</pre>
                </v-sheet>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Public Test Results -->
            <v-expansion-panel
              v-for="(result, index) in visibleTestResults"
              :key="result.id"
              :title="`#${index + 1} - ${result.status}`"
            >
              <v-expansion-panel-text>
                <div class="d-flex flex-column gap-4">
                  <div class="d-flex flex-column flex-md-row gap-4">
                    <div class="flex-grow-1">
                      <div class="text-caption mb-2">🧪 Input:</div>
                      <v-sheet color="grey-darken-3" class="pa-2 rounded scroll-box" style="max-height: 200px;">
                        <pre class="text-body-2">{{ result.testcase?.input || 'No input available' }}</pre>
                      </v-sheet>
                    </div>
                    <div class="flex-grow-1">
                      <div class="text-caption mb-2">🎯 Expected Output:</div>
                      <v-sheet color="grey-darken-3" class="pa-2 rounded scroll-box" style="max-height: 200px;">
                        <pre class="text-body-2">{{ result.testcase?.expected_output || 'No expected output available' }}</pre>
                      </v-sheet>
                    </div>
                  </div>

                  <div>
                    <div class="text-caption mb-2">📤 Your Output:</div>
                    <v-sheet color="grey-darken-3" class="pa-2 rounded scroll-box" style="max-height: 200px;">
                      <pre class="text-body-2">{{ result.stdout || 'No output available' }}</pre>
                    </v-sheet>
                  </div>

                  <div class="text-caption text-grey">
                    ⏱ {{ result.time ?? '-' }}s  📦 {{ result.memory ?? '-' }} KB
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useProgrammingSubmissions } from '@/composables/useProgrammingSubmissions';

interface TestCase {
  id?: string;
  input?: string;
  expected_output?: string;
  is_public?: boolean;
}

interface TestResult {
  id: string;
  status: string;
  stdout?: string | null;
  stderr?: string | null;
  time?: number | null;
  memory?: number | null;
  testcase?: TestCase;
}

interface EvaluationCriteria {
  name: string;
  score: number;
  comment: string;
}

interface LLMEvaluation {
  score: number;
  max_score: number;
  summary: string;
  criteria: EvaluationCriteria[];
  improvement_suggestions: string[];
}

interface ProgrammingSubmission {
  id: string;
  user_id: string;
  exercise_id: string;
  judge0_language_id: number;
  status: string;
  code?: string;
  test_results: TestResult[];
  created_at?: string | Date;
  updated_at?: string | Date;
  passed_testcases?: number;
  total_testcases?: number;
  llm_evaluation?: LLMEvaluation;
}

interface SubmissionStat {
  id: string;
  user_id: string;
  exercise_id: string;
  judge0_language_id: number;
  status: string;
  passed_testcases: number;
  total_testcases: number;
  created_at?: string | Date;
}

const props = defineProps<{
  programmingExerciseId: string
}>();

const dialog = ref(false);
const selectedSubmission = ref<ProgrammingSubmission | null>(null);

const { submissions, fetchSubmissionStats, fetchSubmissionDetail } = useProgrammingSubmissions(false);

// Computed property for visible test results
const visibleTestResults = computed<TestResult[]>(() => {
  if (!selectedSubmission.value || !selectedSubmission.value.test_results) {
    return [];
  }
  
  return selectedSubmission.value.test_results.filter(t => t.testcase?.is_public);
});

// Computed property to safely access code content
const detailsCodeContent = computed<string>(() => {
  return selectedSubmission.value?.code || '// Code not available';
});

// Add mock evaluation data
const mockEvaluation: LLMEvaluation = {
  score: 8.5,
  max_score: 10,
  summary: "The solution is correct and efficient. Code is readable and follows standard conventions.",
  criteria: [
    {
      name: "Correctness",
      score: 10,
      comment: "All test cases passed. Logic is sound."
    },
    {
      name: "Efficiency",
      score: 8,
      comment: "Time complexity is acceptable, though a more optimal data structure could be used."
    },
    {
      name: "Readability",
      score: 9,
      comment: "Code is easy to read and understand. Good use of indentation and naming."
    },
    {
      name: "Style",
      score: 7,
      comment: "Minor style issues: missing blank lines, inconsistent spacing."
    }
  ],
  improvement_suggestions: [
    "Use a dictionary to optimize lookup operations.",
    "Add comments to improve maintainability.",
    "Ensure consistent indentation and spacing."
  ]
};

// Add computed property for evaluation
const evaluation = computed<LLMEvaluation>(() => {
  return selectedSubmission.value?.llm_evaluation || mockEvaluation;
});

onMounted(async () => {
  await fetchSubmissionStats(props.programmingExerciseId);
});

const openModal = async (submissionBrief: SubmissionStat) => {
  try {
    const fullData = await fetchSubmissionDetail(submissionBrief.id);
    if (fullData) {
      selectedSubmission.value = fullData as ProgrammingSubmission;
      dialog.value = true;
    }
  } catch (error) {
    console.error('Error fetching submission details:', error);
  }
};

const formatDate = (date: string | Date): string => {
  try {
    return new Date(date).toLocaleString();
  } catch (e) {
    return 'Invalid date';
  }
};

const getStatusColor = (status: string): string => {
  return status === 'completed' ? 'green' : status === 'failed' ? 'red' : 'grey';
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
}
.code-block {
  max-height: 300px;
  overflow: auto;
  white-space: pre;
}
.scroll-box {
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
.text-success {
  color: #4caf50;
}
.text-error {
  color: #f44336;
}
.hoverable-list-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.hoverable-list-item:hover {
  background-color: #2c2c2c;
}
</style>