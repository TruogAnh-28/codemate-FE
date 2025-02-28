<template>
  <v-container fluid class="pa-0 fill-height overflow-hidden h-screen">
    <v-row no-gutters class="fill-height">
      <!-- Problem Description Panel -->
      <v-col cols="3" class="border-right">
        <ProblemDescription 
          :initial-tab="descriptionTab" 
          @update:tab="descriptionTab = $event"
        />
      </v-col>

      <!-- Code Editor Panel -->
      <v-col cols="9">
        <div class="d-flex flex-column fill-height">
          <CodeEditor 
            :test-input="testInput" 
            @run-result="handleRunResult" 
            @submit-result="handleSubmitResult"
            @update:loading="isLoading = $event"
            :style="codeEditorStyle"
          />
          
          <Testcase 
            :initial-tab="testTab" 
            :result="testResult" 
            @update:tab="testTab = $event"
            @update:input="testInput = $event"
            @toggle="handleTestcaseToggle"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { DEFAULT_TEST_INPUT } from '@/constants/templateProblem';

// State variables
const descriptionTab = ref('description');
const testTab = ref('testcase');
const testResult = ref('');
const testInput = ref({...DEFAULT_TEST_INPUT});
const isLoading = ref(false);
const testcaseExpanded = ref(true);

// Computed property for dynamic code editor height
const codeEditorStyle = computed(() => {
  return {
    height: testcaseExpanded.value ? '60%' : 'calc(100% - 36px)',
    minHeight: testcaseExpanded.value ? '300px' : '500px',
    maxHeight: testcaseExpanded.value ? 'calc(100vh - 300px)' : 'calc(100vh - 100px)',
    overflow: 'auto',
    transition: 'height 0.2s ease-in-out'
  };
});

// Handler methods
const handleRunResult = (result) => {
  testResult.value = result;
  testTab.value = 'result';
  testcaseExpanded.value = true;
};

const handleSubmitResult = (result) => {
  testResult.value = result;
  testTab.value = 'result';
  descriptionTab.value = 'submission';
  testcaseExpanded.value = true;
};

const handleTestcaseToggle = (expanded) => {
  testcaseExpanded.value = expanded;
};

// Prevent body scrolling
onMounted(() => {
  document.body.style.overflow = 'hidden';
});
</script>

<style>
html, body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}

.border-right {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}
</style>