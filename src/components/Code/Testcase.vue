<template>
  <div>
    <!-- Toggle button -->
    <div class="test-cases-header d-flex align-center px-2" @click="toggleTestCases">
      <v-icon :icon="isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" class="mr-2"></v-icon>
      <span class="text-body-2">Testcase Panel</span>
      <v-spacer></v-spacer>
    </div>

    <!-- Collapsible test cases container -->
    <v-expand-transition>
      <v-sheet 
        v-if="isExpanded" 
        class="test-cases" 
        :height="testCasesHeight" 
        color="grey-darken-4"
      >
        <v-tabs v-model="testTab" color="primary">
          <v-tab value="testcase">Testcase</v-tab>
          <v-tab value="result">Result</v-tab>
        </v-tabs>
        
        <v-window v-model="testTab">
          <v-window-item value="testcase">
            <v-card-text class="overflow-auto" style="max-height: calc(100% - 48px)">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="localInput.nums"
                    label="nums ="
                    density="compact"
                    bg-color="grey-darken-3"
                    @update:model-value="updateInput"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="localInput.target"
                    label="target ="
                    density="compact"
                    bg-color="grey-darken-3"
                    @update:model-value="updateInput"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-window-item>

          <v-window-item value="result">
            <v-card-text class="overflow-auto" style="max-height: calc(100% - 48px)">
              <div v-if="testResult">
                <pre class="result-pre">{{ testResult }}</pre>
              </div>
              <div v-else class="text-center">
                Run code to see results
              </div>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-sheet>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_TEST_INPUT } from '@/constants/templateProblem';

interface TestInput {
  nums: string;
  target: string;
  [key: string]: string;
}

interface TestCasePanelProps {
  initialTab?: string;
  result?: string;
}

const props = withDefaults(defineProps<TestCasePanelProps>(), {
  initialTab: 'testcase',
  result: ''
});

const emit = defineEmits<{
  (e: 'update:tab', tab: string): void;
  (e: 'update:input', input: TestInput): void;
  (e: 'toggle', isExpanded: boolean): void;
}>();

const testTab = ref<string>(props.initialTab);
const testResult = ref<string>(props.result);
const localInput = ref<TestInput>({...DEFAULT_TEST_INPUT});
const isExpanded = ref<boolean>(true);
const testCasesHeight = ref<string>('300px');

// Toggle test cases visibility
const toggleTestCases = (): void => {
  isExpanded.value = !isExpanded.value;
  emit('toggle', isExpanded.value);
};

// Update parent component with input changes
const updateInput = (): void => {
  emit('update:input', localInput.value);
};

// Watch for result changes
watch(() => props.result, (newValue) => {
  testResult.value = newValue;
  isExpanded.value = true;
  emit('toggle', isExpanded.value);
  if (newValue) {
    testTab.value = 'result';
  }
});

// Watch for tab changes and emit event
watch(testTab, (newValue) => {
  emit('update:tab', newValue);
});
</script>

<style scoped>
.test-cases {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.test-cases-header {
  cursor: pointer;
  height: 36px;
  background-color: rgba(66, 66, 66, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

:deep(.v-field__input) {
  font-family: monospace;
}

.result-pre {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 100%;
  overflow: auto;
}
</style>