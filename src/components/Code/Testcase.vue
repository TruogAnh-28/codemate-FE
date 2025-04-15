<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  testcases: { input: string; expected_output: string; isPublic: boolean }[];
  initialTab?: string;
  result?: string;
}>();

const emit = defineEmits<{
  (e: 'update:tab', value: string): void;
  (e: 'update:input', index: number, field: 'input' | 'expected_output', value: string): void;
  (e: 'toggle', expanded: boolean): void;
  (e: 'add-custom'): void;
}>();

const testTab = ref(props.initialTab ?? 'testcase');
const isExpanded = ref(true);
const activeTestcaseIndex = ref(0);
const testCasesHeight = ref('300px');

const toggleTestCases = () => {
  isExpanded.value = !isExpanded.value;
  emit('toggle', isExpanded.value);
};

watch(testTab, newVal => emit('update:tab', newVal));
watch(() => props.result, newVal => {
  if (newVal) {
    testTab.value = 'result';
    isExpanded.value = true;
    emit('toggle', true);
  }
});
</script>

<template>
  <div>
    <div class="test-cases-header d-flex align-center px-2" @click="toggleTestCases">
      <v-icon :icon="isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" class="mr-2" />
      <span class="text-body-2">Testcase Panel</span>
      <v-spacer />
    </div>

    <v-expand-transition>
      <v-sheet v-if="isExpanded" class="test-cases d-flex flex-column" :height="testCasesHeight" color="grey-darken-4">
        <v-tabs v-model="testTab" color="primary">
          <v-tab value="testcase">Testcase</v-tab>
          <v-tab value="result">Result</v-tab>
        </v-tabs>

        <v-window v-model="testTab" class="d-flex flex-column flex-grow-1">
          <!-- Testcase Editor -->
          <v-window-item value="testcase">
            <v-card-text class="d-flex flex-column flex-grow-1" style="overflow: hidden">
              <div class="d-flex align-center mb-2">
                <v-btn size="small" variant="outlined" color="primary" @click="emit('add-custom')">
                  <v-icon start>mdi-plus</v-icon> Add Custom Testcase
                </v-btn>
                <v-spacer />
              </div>

              <v-tabs v-model="activeTestcaseIndex" grow class="testcase-tab-bar" show-arrows>
                <v-tab v-for="(tc, index) in props.testcases" :key="index" :value="index">
                  {{ tc.isPublic ? 'Public' : 'Custom' }} #{{ index + 1 }}
                </v-tab>
              </v-tabs>

              <v-window v-model="activeTestcaseIndex" class="overflow-auto flex-grow-1">
                <v-window-item v-for="(tc, index) in props.testcases" :key="index" :value="index">
                  <v-row class="mt-2">
                    <v-col cols="12" md="6">
                      <v-textarea
                        :model-value="tc.input"
                        label="Input"
                        bg-color="grey-darken-3"
                        auto-grow
                        density="compact"
                        class="monospace scroll-box"
                        rows="4"
                        max-rows="10"
                        :readonly=false
                        @update:model-value="emit('update:input', index, 'input', $event)"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-textarea
                        :model-value="tc.expected_output"
                        label="Expected Output"
                        bg-color="grey-darken-3"
                        auto-grow
                        density="compact"
                        class="monospace scroll-box"
                        rows="4"
                        max-rows="10"
                        :readonly=false
                        @update:model-value="emit('update:input', index, 'expected_output', $event)"
                      />
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-window-item>

          <!-- Result Tab -->
          <v-window-item value="result">
            <v-card-text class="overflow-auto" style="max-height: calc(100% - 48px)">
              <div v-if="props.result">
                <pre class="result-pre">{{ props.result }}</pre>
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


<style scoped>
.test-cases {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
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

.monospace {
  font-family: monospace;
}

.scroll-box {
  max-height: 240px;
  overflow: auto;
}
</style>

