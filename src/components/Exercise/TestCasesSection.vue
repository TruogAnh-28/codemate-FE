<template>
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
        @click="$emit('add-test-case')"
      ></v-btn>
      <v-btn
        variant="tonal"
        size="small"
        color="info"
        prepend-icon="mdi-file-upload-outline"
        class="rounded-lg"
        @click="openFileUploadSection"
      >
        Import
      </v-btn>
    </div>

    <!-- File Upload Section -->
    <v-expand-transition>
      <div v-if="showImportSection" class="mb-4">
        <TestCaseImport 
          :questionIndex="questionIndex"
          @test-cases-imported="importTestCases"
          @cancel="showImportSection = false"
        />
      </div>
    </v-expand-transition>

    <!-- Test Case List -->
    <v-expansion-panels v-model="openTestCase">
      <v-expansion-panel
        v-for="(testcase, testcaseIndex) in localTestcases"
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
            <span v-if="testcase.description" class="ml-2 text-truncate text-medium-emphasis" style="max-width: 300px">
              - {{ testcase.description }}
            </span>
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
            @update:model-value="updateTestCases"
          ></v-text-field>

          <!-- Multiple inputs display -->
          <div class="mb-3">
            <div class="text-subtitle-2 font-weight-medium mb-2">Inputs</div>
            
            <div v-for="(_, inputIndex) in getInputsArray(testcase)" :key="`input-${inputIndex}`" class="mb-2">
              <v-text-field
                v-model="testcase.inputs[inputIndex]"
                :label="`Input ${inputIndex + 1}`"
                :placeholder="`Input value for parameter ${inputIndex + 1}`"
                variant="outlined"
                density="comfortable"
                class="rounded-lg"
                hide-details="auto"
                monospace
                @update:model-value="updateTestCases"
              ></v-text-field>
            </div>
            
            <div class="d-flex justify-end">
              <v-btn
                variant="text"
                size="small"
                color="secondary"
                prepend-icon="mdi-plus"
                class="mt-1 mb-2"
                @click="addInputField(testcase)"
              >
                Add Input
              </v-btn>
            </div>
          </div>

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
            @update:model-value="updateTestCases"
          ></v-textarea>

          <div class="d-flex align-center">
            <v-switch
              v-model="testcase.is_hidden"
              label="Hidden test case (not visible to students)"
              color="primary"
              hide-details="auto"
              class="mr-3"
              @update:model-value="updateTestCases"
            ></v-switch>
            
            <v-spacer></v-spacer>
            
            <v-btn
              v-if="localTestcases.length > 1"
              icon="mdi-delete"
              variant="text"
              color="error"
              @click="$emit('remove-test-case', testcaseIndex)"
            ></v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
  questionIndex: number,
  testcases: any[]
}>();

const emit = defineEmits<{
  'add-test-case': [],
  'remove-test-case': [testcaseIndex: number],
  'update:testcases': [testcases: any[]]
}>();

const openTestCase = ref(0);
const showImportSection = ref(false);
const localTestcases = ref([...props.testcases]);

// Watch for changes from props
watch(() => props.testcases, (newVal) => {
  localTestcases.value = [...newVal];
}, { deep: true });

// Initialize test cases on mount
onMounted(() => {
  // Make sure all test cases have inputs array
  localTestcases.value.forEach(testcase => {
    normalizeTestCase(testcase);
  });
  updateTestCases();
});

// Get inputs array from testcase
const getInputsArray = (testcase: any) => {
  if (!testcase.inputs) {
    testcase.inputs = [''];
  }
  return testcase.inputs;
};

// Normalize test case to ensure it has inputs array
const normalizeTestCase = (testcase: any) => {
  // If only input exists, convert to inputs array
  if (testcase.input !== undefined && !testcase.inputs) {
    testcase.inputs = [testcase.input];
    delete testcase.input;
  }
  
  // If no inputs array exists, create it
  if (!testcase.inputs) {
    testcase.inputs = [''];
  }
  
  // Ensure is_hidden exists
  if (testcase.is_hidden === undefined) {
    testcase.is_hidden = false;
  }
  
  return testcase;
};

// Add a new input field
const addInputField = (testcase: any) => {
  if (!testcase.inputs) {
    testcase.inputs = [];
  }
  testcase.inputs.push('');
  updateTestCases();
};

// Update test cases
const updateTestCases = () => {
  emit('update:testcases', [...localTestcases.value]);
};

// Open file upload section
const openFileUploadSection = () => {
  showImportSection.value = !showImportSection.value;
};

// Import new test cases
const importTestCases = (newTestCases: any[]) => {
  // Ensure all new test cases have the correct format
  newTestCases.forEach(testcase => {
    normalizeTestCase(testcase);
  });
  
  localTestcases.value = [...localTestcases.value, ...newTestCases];
  updateTestCases();
  showImportSection.value = false;
};
</script>