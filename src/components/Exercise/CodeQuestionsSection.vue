<template>
  <div class="mb-6">
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-code-braces</v-icon>
      <h3 class="text-subtitle-1 font-weight-bold mb-0">Coding Questions</h3>
    </div>

    <v-sheet v-for="(question, questionIndex) in questions" :key="questionIndex" rounded="lg" elevation="1" class="pa-4 mb-4 bg-grey-lighten-4">
      <div class="d-flex align-center mb-4">
        <h4 class="text-subtitle-1 font-weight-medium mb-0">Question {{ questionIndex + 1 }}</h4>
        <v-spacer></v-spacer>
        <v-btn
          v-if="questions.length > 1"
          icon="mdi-delete"
          variant="text"
          color="error"
          size="small"
          @click="removeQuestion(questionIndex)"
        ></v-btn>
      </div>

      <v-textarea
        v-model="question.question"
        label="Question Text*"
        placeholder="Describe the coding problem to solve"
        variant="outlined"
        density="comfortable"
        class="mb-4 rounded-lg"
        rows="4"
        :rules="[v => !!v || 'Question text is required']"
        hide-details="auto"
      ></v-textarea>

      <div class="d-flex align-items-center mb-3">
        <v-select
          v-model="question.difficulty"
          :items="difficultyLevels"
          label="Difficulty Level"
          variant="outlined"
          density="comfortable"
          class="mr-3 rounded-lg"
          hide-details="auto"
        ></v-select>

        <v-text-field
          v-model="question.score"
          type="number"
          label="Score*"
          variant="outlined"
          density="comfortable"
          class="rounded-lg"
          min="1"
          :rules="[v => !!v || 'Score is required', v => v > 0 || 'Score must be positive']"
          hide-details="auto"
          style="max-width: 100px"
        ></v-text-field>
      </div>

      <v-select
        v-model="question.allowed_languages"
        :items="programmingLanguages"
        label="Allowed Programming Languages*"
        variant="outlined"
        density="comfortable"
        class="mb-4 rounded-lg"
        multiple
        chips
        closable-chips
        :rules="[v => v.length > 0 || 'At least one programming language must be selected']"
        hide-details="auto"
      ></v-select>

      <v-textarea
        v-model="question.starter_code"
        label="Starter Code"
        placeholder="Provide starter code for students"
        variant="outlined"
        density="comfortable"
        class="mb-4 rounded-lg"
        rows="6"
        hide-details="auto"
        monospace
      ></v-textarea>

      <v-textarea
        v-model="question.solution_code"
        label="Solution Code"
        placeholder="Provide the correct solution code (for reference)"
        variant="outlined"
        density="comfortable"
        class="mb-4 rounded-lg"
        rows="6"
        hide-details="auto"
        monospace
      ></v-textarea>

      <!-- Performance Constraints -->
      <div class="d-flex align-items-center mb-3">
        <v-text-field
          v-model="question.time_limit_seconds"
          type="number"
          label="Time Limit (seconds)"
          variant="outlined"
          density="comfortable"
          class="mr-3 rounded-lg"
          min="1"
          hide-details="auto"
        ></v-text-field>

        <v-text-field
          v-model="question.memory_limit_mb"
          type="number"
          label="Memory Limit (MB)"
          variant="outlined"
          density="comfortable"
          class="rounded-lg"
          min="1"
          hide-details="auto"
        ></v-text-field>
      </div>

      <!-- Hints -->
      <div class="mb-4">
        <div class="d-flex align-center mb-2">
          <span class="text-subtitle-1 font-weight-medium">Hints</span>
          <v-spacer></v-spacer>
          <v-btn
            variant="tonal"
            size="small"
            icon="mdi-plus"
            color="primary"
            class="rounded-lg"
            @click="addHint(questionIndex)"
          ></v-btn>
        </div>

        <!-- <div v-for="(hint, hintIndex) in question.hints" :key="`hint-${questionIndex}-${hintIndex}`" class="d-flex mb-2">
          <v-text-field
            v-model="question.hints[hintIndex]"
            label="Hint"
            placeholder="Provide a helpful hint for students"
            variant="outlined"
            density="comfortable"
            class="rounded-lg mr-2"
            hide-details="auto"
          ></v-text-field>
          <v-btn
            v-if="question.hints.length > 1"
            icon="mdi-delete"
            variant="text"
            color="error"
            size="small"
            @click="removeHint(questionIndex, hintIndex)"
            class="mt-2"
          ></v-btn>
        </div> -->
      </div>

      <!-- Test Cases -->
      <div>
        <div class="d-flex align-center mb-2">
          <span class="text-subtitle-1 font-weight-medium">Test Cases</span>
          <v-spacer></v-spacer>
          <v-btn
            variant="tonal"
            size="small"
            icon="mdi-plus"
            color="primary"
            class="rounded-lg mr-2"
            @click="addTestCase(questionIndex)"
          ></v-btn>
          <v-btn
            variant="tonal"
            size="small"
            color="info"
            prepend-icon="mdi-file-upload-outline"
            class="rounded-lg"
            @click="openFileUploadSection(questionIndex)"
          >
            Import
          </v-btn>
        </div>

        <!-- File Upload Section for Test Cases -->
        <v-expand-transition>
          <div v-if="activeQuestionForImport === questionIndex" class="mb-4">
            <v-card variant="outlined" class="pa-4 mb-3 rounded-lg">
              <div class="template-section mb-4">
                <div class="d-flex align-center mb-2">
                  <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold mb-0">Template Format</h3>
                </div>
                <v-sheet rounded="lg" elevation="1" class="pa-2 mb-3 bg-grey-lighten-4">
                  <v-table density="compact" class="rounded-lg">
                    <thead>
                      <tr class="bg-grey-lighten-3">
                        <th class="text-primary">Description</th>
                        <th class="text-primary">Input</th>
                        <th class="text-primary">ExpectedOutput</th>
                        <th class="text-primary">IsHidden</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Basic test</td>
                        <td>[1, 2, 3]</td>
                        <td>6</td>
                        <td>FALSE</td>
                      </tr>
                      <tr>
                        <td>Edge case</td>
                        <td>[]</td>
                        <td>0</td>
                        <td>TRUE</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-sheet>
                <v-btn
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-file-download-outline"
                  class="rounded-lg px-4"
                  @click="downloadTestCaseTemplate(questionIndex)"
                >
                  Download Template
                </v-btn>
              </div>

              <div class="import-section">
                <div class="d-flex align-center mb-2">
                  <v-icon color="primary" class="mr-2">mdi-cloud-upload-outline</v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold mb-0">Upload Test Cases</h3>
                </div>
                <div
                  class="drop-zone pa-6 text-center"
                  :class="{ 
                    dragging: isDragging, 
                    'has-file': testCaseFiles[questionIndex] !== undefined 
                  }"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop="(e) => handleTestCaseFileDrop(e, questionIndex)"
                >
                  <v-icon
                    size="40"
                    class="mb-2"
                    :color="testCaseFiles[questionIndex] ? 'success' : 'primary'"
                  >
                    {{ testCaseFiles[questionIndex] ? "mdi-check-circle" : "mdi-cloud-upload-outline" }}
                  </v-icon>
                  <p class="mb-2">
                    {{
                      testCaseFiles[questionIndex]
                        ? "File uploaded successfully!"
                        : "Drag and drop Excel file here or"
                    }}
                  </p>
                  <v-btn
                    :color="testCaseFiles[questionIndex] ? 'success' : 'primary'"
                    variant="elevated"
                    class="rounded-lg px-4"
                    prepend-icon="mdi-file-excel"
                    @click="triggerTestCaseFileInput(questionIndex)"
                  >
                    {{ testCaseFiles[questionIndex] ? "Change File" : "Upload Excel" }}
                  </v-btn>
                  <!-- <input
                    :ref="el => { if (el) testCaseFileInputs[questionIndex] = el }"
                    type="file"
                    accept=".xlsx, .xls"
                    style="display: none"
                    @change="(e) => handleTestCaseFileChange(e, questionIndex)"
                  /> -->
                </div>

                <v-progress-linear
                  v-if="testCaseImportLoading[questionIndex]"
                  indeterminate
                  color="primary"
                  class="mt-3 rounded-xl"
                ></v-progress-linear>

                <v-alert
                  v-if="testCaseImportErrors[questionIndex]?.length"
                  type="error"
                  variant="tonal"
                  class="mt-3 rounded-lg"
                  border="start"
                  :text="testCaseImportErrors[questionIndex].join(', ')"
                ></v-alert>

                <v-expand-transition>
                  <div v-if="testCasePreviewData[questionIndex]?.length" class="mt-4">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-table</v-icon>
                        <h3 class="text-subtitle-1 font-weight-bold mb-0">Preview Test Cases</h3>
                      </div>
                      <v-chip color="success" size="small">{{ testCasePreviewData[questionIndex].length }} Cases</v-chip>
                    </div>
                    <v-sheet rounded="lg" elevation="1" class="pa-2 mb-3 bg-grey-lighten-4">
                      <v-table density="compact" class="rounded-lg">
                        <thead>
                          <tr class="bg-grey-lighten-3">
                            <th class="text-primary">Description</th>
                            <th class="text-primary">Input</th>
                            <th class="text-primary">Output</th>
                            <th class="text-primary">Hidden</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(tc, i) in testCasePreviewData[questionIndex].slice(0, 3)" :key="i">
                            <td>{{ tc.description || 'No description' }}</td>
                            <td>{{ truncateText(tc.input, 20) }}</td>
                            <td>{{ truncateText(tc.output, 20) }}</td>
                            <td>
                              <v-icon :color="tc.is_hidden ? 'success' : 'error'">
                                {{ tc.is_hidden ? 'mdi-check' : 'mdi-close' }}
                              </v-icon>
                            </td>
                          </tr>
                          <tr v-if="testCasePreviewData[questionIndex].length > 3">
                            <td colspan="4" class="text-center text-body-2 text-medium-emphasis">
                              + {{ testCasePreviewData[questionIndex].length - 3 }} more test cases
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-sheet>

                    <div class="d-flex justify-end mt-2">
                      <v-btn
                        color="error"
                        variant="text"
                        class="mr-2"
                        @click="cancelTestCaseImport(questionIndex)"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="elevated"
                        @click="confirmTestCaseImport(questionIndex)"
                      >
                        Import Test Cases
                      </v-btn>
                    </div>
                  </div>
                </v-expand-transition>
              </div>
            </v-card>
          </div>
        </v-expand-transition>

        <v-expansion-panels v-model="openTestCase">
          <v-expansion-panel
            v-for="(testcase, testcaseIndex) in question.testcases"
            :key="`testcase-${questionIndex}-${testcaseIndex}`"
            class="mb-2 rounded-lg"
          >
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <span>Test Case {{ testcaseIndex + 1 }}</span>
                <v-chip
                  v-if="testcase.is_hidden"
                  size="small"
                  color="warning"
                  class="ml-2"
                >
                  Hidden
                </v-chip>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-text-field
                v-model="testcase.description"
                label="Description"
                placeholder="Describe what this test case is checking"
                variant="outlined"
                density="comfortable"
                class="mb-3 rounded-lg"
                hide-details="auto"
              ></v-text-field>

              <v-textarea
                v-model="testcase.input"
                label="Input*"
                placeholder="Test case input"
                variant="outlined"
                density="comfortable"
                class="mb-3 rounded-lg"
                rows="3"
                :rules="[v => !!v || 'Input is required']"
                hide-details="auto"
                monospace
              ></v-textarea>

              <v-textarea
                v-model="testcase.output"
                label="Expected Output*"
                placeholder="Expected output for this test case"
                variant="outlined"
                density="comfortable"
                class="mb-3 rounded-lg"
                rows="3"
                :rules="[v => !!v || 'Expected output is required']"
                hide-details="auto"
                monospace
              ></v-textarea>

              <div class="d-flex align-center">
                <v-switch
                  v-model="testcase.is_hidden"
                  label="Hidden test case (not visible to students)"
                  color="primary"
                  hide-details="auto"
                  class="mr-3"
                ></v-switch>
                
                <v-spacer></v-spacer>
                
                <v-btn
                  v-if="question.testcases.length > 1"
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  @click="removeTestCase(questionIndex, testcaseIndex)"
                ></v-btn>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { CodeModel } from '@/types/Exercise';
import * as XLSX from 'xlsx';

const props = defineProps<{
  questions: CodeModel[],
  difficultyLevels: string[],
  programmingLanguages: string[]
}>();

const emit = defineEmits<{
  'update:questions': [value: CodeModel[]]
}>();

// Core functionality
const openTestCase = ref(0);

// New refs for file upload functionality
const activeQuestionForImport = ref<number | null>(null);
const testCaseFileInputs = reactive<Record<number, HTMLInputElement>>({});
const testCaseFiles = ref<Record<number, File>>({});
const testCaseImportLoading = ref<Record<number, boolean>>({});
const testCaseImportErrors = ref<Record<number, string[]>>({});
const testCasePreviewData = ref<Record<number, any[]>>({});
const isDragging = ref(false);

// Core functions
const addHint = (questionIndex: number) => {
  if (!props.questions[questionIndex].hints) {
    props.questions[questionIndex].hints = [];
  }
  props.questions[questionIndex].hints.push('');
  emit('update:questions', [...props.questions]);
};

const removeHint = (questionIndex: number, hintIndex: number) => {
  props.questions[questionIndex].hints?.splice(hintIndex, 1);
  emit('update:questions', [...props.questions]);
};

const addTestCase = (questionIndex: number) => {
  props.questions[questionIndex].testcases.push({
    input: '',
    output: '',
    is_hidden: false,
    description: 'New test case'
  });
  emit('update:questions', [...props.questions]);
};

const removeTestCase = (questionIndex: number, testcaseIndex: number) => {
  props.questions[questionIndex].testcases.splice(testcaseIndex, 1);
  emit('update:questions', [...props.questions]);
};

const removeQuestion = (questionIndex: number) => {
  props.questions.splice(questionIndex, 1);
  emit('update:questions', [...props.questions]);
};

// New functions for file upload
const openFileUploadSection = (questionIndex: number) => {
  if (activeQuestionForImport.value === questionIndex) {
    activeQuestionForImport.value = null;
  } else {
    activeQuestionForImport.value = questionIndex;
  }
};

const downloadTestCaseTemplate = (questionIndex: number) => {
  const wb = XLSX.utils.book_new();
  const headers = ["Description", "Input", "ExpectedOutput", "IsHidden"];
  const sampleData = [
    ["Basic test", "[1, 2, 3]", "6", "FALSE"],
    ["Edge case", "[]", "0", "TRUE"],
    ["Negative numbers", "[-1, -2, -3]", "-6", "FALSE"]
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
  XLSX.utils.book_append_sheet(wb, ws, "TestCases");
  XLSX.writeFile(wb, "test_cases_template.xlsx");
};

const triggerTestCaseFileInput = (questionIndex: number) => {
  if (testCaseFileInputs[questionIndex]) {
    testCaseFileInputs[questionIndex].click();
  }
};

const handleTestCaseFileChange = (event: Event, questionIndex: number) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    testCaseFiles.value[questionIndex] = input.files[0];
    processTestCaseFile(questionIndex);
  }
};

const handleTestCaseFileDrop = (event: DragEvent, questionIndex: number) => {
  event.preventDefault();
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    testCaseFiles.value[questionIndex] = event.dataTransfer.files[0];
    processTestCaseFile(questionIndex);
  }
};

const processTestCaseFile = (questionIndex: number) => {
  testCaseImportLoading.value[questionIndex] = true;
  testCaseImportErrors.value[questionIndex] = [];
  testCasePreviewData.value[questionIndex] = [];

  if (!testCaseFiles.value[questionIndex]) {
    testCaseImportErrors.value[questionIndex] = ['No file selected'];
    testCaseImportLoading.value[questionIndex] = false;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      // Validate format
      if (jsonData.length < 2) {
        testCaseImportErrors.value[questionIndex] = ['File must contain header row and at least one test case'];
        testCaseImportLoading.value[questionIndex] = false;
        return;
      }

      const headers = jsonData[0].map((h: string) => h.toLowerCase());
      const requiredHeaders = ['input', 'expectedoutput'];
      
      // Check for required headers
      for (const header of requiredHeaders) {
        if (!headers.includes(header)) {
          testCaseImportErrors.value[questionIndex] = [`File must contain '${header}' header`];
          testCaseImportLoading.value[questionIndex] = false;
          return;
        }
      }

      // Parse test cases
      const descIndex = headers.indexOf('description');
      const inputIndex = headers.indexOf('input');
      const outputIndex = headers.indexOf('expectedoutput');
      const hiddenIndex = headers.indexOf('ishidden');
      
      const testCases = [];
      const errors = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        if (!row[inputIndex] || !row[outputIndex]) {
          errors.push(`Row ${i}: Missing input or expected output`);
          continue;
        }

        const testCase = {
          description: descIndex >= 0 ? row[descIndex] || `Test case ${i}` : `Test case ${i}`,
          input: row[inputIndex],
          output: row[outputIndex],
          is_hidden: hiddenIndex >= 0 ? 
            (typeof row[hiddenIndex] === 'string' ? 
              row[hiddenIndex].toUpperCase() === 'TRUE' : 
              Boolean(row[hiddenIndex])) : 
            false
        };

        testCases.push(testCase);
      }

      testCaseImportErrors.value[questionIndex] = errors;
      testCasePreviewData.value[questionIndex] = testCases;
    } catch (error) {
      testCaseImportErrors.value[questionIndex] = ['Failed to parse file: ' + (error as Error).message];
    } finally {
      testCaseImportLoading.value[questionIndex] = false;
    }
  };

  reader.onerror = () => {
    testCaseImportErrors.value[questionIndex] = ['Error reading file'];
    testCaseImportLoading.value[questionIndex] = false;
  };

  reader.readAsArrayBuffer(testCaseFiles.value[questionIndex]);
};

const confirmTestCaseImport = (questionIndex: number) => {
  if (testCasePreviewData.value[questionIndex]?.length) {
    // Add the imported test cases to the question
    props.questions[questionIndex].testcases.push(...testCasePreviewData.value[questionIndex]);
    emit('update:questions', [...props.questions]);
    
    // Reset state
    cancelTestCaseImport(questionIndex);
  }
};

const cancelTestCaseImport = (questionIndex: number) => {
  // Reset all import-related state for this question
  activeQuestionForImport.value = null;
  delete testCaseFiles.value[questionIndex];
  delete testCasePreviewData.value[questionIndex];
  delete testCaseImportErrors.value[questionIndex];
  delete testCaseImportLoading.value[questionIndex];
};

// Helper function to truncate long text
const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
</script>

<style scoped>
:deep(.v-field) {
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}

:deep(.v-expansion-panel) {
  border-radius: 12px !important;
}

.drop-zone {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  border-radius: 12px;
  background-color: rgba(var(--v-theme-primary), 0.03);
  transition: all 0.3s ease;
}

.drop-zone.dragging {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: scale(1.01);
}

.drop-zone.has-file {
  border-color: rgb(var(--v-theme-success));
  background-color: rgba(var(--v-theme-success), 0.05);
}
</style>