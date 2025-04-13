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
                <v-row>
                  <v-col cols="12" md="6">
                    <strong class="text-caption">🧪 Input:</strong>
                    <v-sheet color="grey-darken-3" class="pa-2 rounded mb-2 scroll-box">
                      <pre>{{ result.testcase?.input || 'No input available' }}</pre>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong class="text-caption">🎯 Expected Output:</strong>
                    <v-sheet color="grey-darken-3" class="pa-2 rounded mb-2 scroll-box">
                      <pre>{{ result.testcase?.expected_output || 'No expected output available' }}</pre>
                    </v-sheet>
                  </v-col>
                </v-row>

                <strong class="text-caption">📤 Your Output:</strong>
                <v-sheet color="grey-darken-3" class="pa-2 rounded mb-2 scroll-box">
                  <pre>{{ result.stdout || 'No output available' }}</pre>
                </v-sheet>

                <div class="text-caption text-grey">
                  ⏱ {{ result.time ?? '-' }}s  📦 {{ result.memory ?? '-' }} KB
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
  max-height: 240px;
  overflow: auto;
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