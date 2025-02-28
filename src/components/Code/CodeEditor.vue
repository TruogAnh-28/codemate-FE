<template>
  <v-sheet class="d-flex flex-column overflow-hidden h-70">
    <!-- Language selector and actions -->
    <v-toolbar dense color="grey-darken-4">
      <v-select
        v-model="selectedLanguage"
        :items="languages"
        density="compact"
        hide-details
        class="language-select"
        bg-color="grey-darken-3"
        width="150"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn variant="tonal" color="success" class="mr-2" @click="runCode" :loading="isLoading">Run</v-btn>
      <v-btn variant="tonal" color="primary" @click="submitCode" :loading="isLoading">Submit</v-btn>
    </v-toolbar>

    <!-- Monaco Editor -->
    <div class="flex-grow-1 overflow-hidden">
      <MonacoEditor
        v-model:value="code"
        :options="editorOptions"
        theme="vs-dark"
        :language="selectedLanguage"
        class="h-100"
        @mount="handleEditorDidMount"
      />
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, watch } from 'vue';
import MonacoEditor from 'monaco-editor-vue3';
import { LANGUAGES, LANGUAGE_MAP, DEFAULT_CODE, EDITOR_OPTIONS } from '@/constants/templateLanguage';
import { createSubmission, pollSubmission, prepareStdin } from '@/services/Professor/judge0api';

const props = defineProps({
  testInput: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['run-result', 'submit-result', 'update:loading']);

const selectedLanguage = ref('cpp');
const code = ref(DEFAULT_CODE.cpp);
const editor = ref(null);
const editorOptions = ref(EDITOR_OPTIONS);
const languages = ref(LANGUAGES);
const isLoading = ref(false);

// Methods
const handleEditorDidMount = (editorInstance) => {
  editor.value = editorInstance;
};

// Run code with test case
const runCode = async () => {
  try {
    isLoading.value = true;
    emit('update:loading', true);
    
    // Prepare stdin
    const stdin = prepareStdin(
      selectedLanguage.value, 
      props.testInput.nums, 
      props.testInput.target
    );
    
    // Create submission
    const token = await createSubmission(
      code.value, 
      LANGUAGE_MAP[selectedLanguage.value], 
      stdin,
      '[0,1]'
    );
    
    // Poll for results
    const result = await pollSubmission(token);
    
    // Format and emit results
    let resultText = '';
    if (result.status.id === 3) { // Accepted
      resultText = `Status: ${result.status.description}\n`;
      resultText += `Output: ${result.stdout || 'No output'}\n`;
      resultText += `Time: ${result.time} seconds\n`;
      resultText += `Memory: ${result.memory} KB`;
    } else {
      resultText = `Status: ${result.status.description}\n`;
      if (result.stderr) {
        resultText += `Error: ${result.stderr}\n`;
      }
      if (result.compile_output) {
        resultText += `Compiler output: ${result.compile_output}\n`;
      }
    }
    
    emit('run-result', resultText);
  } catch (error) {
    emit('run-result', `Error running code: ${error.message}`);
  } finally {
    isLoading.value = false;
    emit('update:loading', false);
  }
};

// Submit code for validation
const submitCode = async () => {
  try {
    isLoading.value = true;
    emit('update:loading', true);
    
    // Prepare stdin
    const stdin = prepareStdin(
      selectedLanguage.value, 
      props.testInput.nums, 
      props.testInput.target
    );
    
    // Create submission
    const token = await createSubmission(
      code.value, 
      LANGUAGE_MAP[selectedLanguage.value], 
      stdin,
      '[0,1]'
    );
    
    // Poll for results
    const result = await pollSubmission(token);
    
    // Format and emit results
    let resultText = '';
    if (result.status.id === 3 && result.stdout.trim() === '[0,1]') {
      resultText = `
✅ Solution Accepted!
Your solution passed all test cases.

Test Result:
Input: nums = ${props.testInput.nums}, target = ${props.testInput.target}
Expected Output: [0,1]
Your Output: ${result.stdout.trim()}
Time: ${result.time} seconds
Memory: ${result.memory} KB
      `;
    } else {
      resultText = `
❌ Solution Failed!
Your solution did not pass all test cases.

Test Result:
Input: nums = ${props.testInput.nums}, target = ${props.testInput.target}
Expected Output: [0,1]
Your Output: ${result.stdout || 'No output'}
Status: ${result.status.description}
${result.stderr ? 'Error: ' + result.stderr + '\n' : ''}
      `;
    }
    
    emit('submit-result', resultText);
  } catch (error) {
    emit('submit-result', `Error submitting code: ${error.message}`);
  } finally {
    isLoading.value = false;
    emit('update:loading', false);
  }
};

// Watch for language changes to update code
watch(selectedLanguage, (newLang) => {
  code.value = DEFAULT_CODE[newLang];
});
</script>

<style scoped>
.language-select {
  width: 150px;
}
</style>