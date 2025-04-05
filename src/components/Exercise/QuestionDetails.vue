<template>
  <div>
    <label class="font-weight-medium mb-2 d-block">Problem description*</label>
    <div ref="editorRef" class="editor-container mb-4 rounded-lg" />

    <div class="d-flex align-items-center mb-3">
      <v-select
        v-model="localQuestion.difficulty"
        :items="difficultyLevels"
        label="Difficulty Level"
        variant="outlined"
        density="comfortable"
        class="mr-3 rounded-lg"
        hide-details="auto"
        @update:model-value="emitUpdate"
      ></v-select>

      <v-text-field
        v-model="localQuestion.score"
        type="number"
        label="Score*"
        variant="outlined"
        density="comfortable"
        class="rounded-lg"
        min="1"
        :rules="[v => !!v || 'Score is required', v => v > 0 || 'Score must be positive']"
        hide-details="auto"
        style="max-width: 100px"
        @update:model-value="emitUpdate"
      ></v-text-field>
    </div>

    <v-select
      v-model="localQuestion.allowed_languages"
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
      @update:model-value="emitUpdate"
    ></v-select>

    <v-textarea
      v-model="localQuestion.starter_code"
      label="Starter Code"
      placeholder="Provide starter code for students"
      variant="outlined"
      density="comfortable"
      class="mb-4 rounded-lg"
      rows="6"
      hide-details="auto"
      monospace
      @update:model-value="emitUpdate"
    ></v-textarea>

    <v-textarea
      v-model="localQuestion.solution_code"
      label="Solution Code"
      placeholder="Provide the correct solution code (for reference)"
      variant="outlined"
      density="comfortable"
      class="mb-4 rounded-lg"
      rows="6"
      hide-details="auto"
      monospace
      @update:model-value="emitUpdate"
    ></v-textarea>

    <div class="d-flex align-items-center mb-3">
      <v-text-field
        v-model="localQuestion.time_limit_seconds"
        type="number"
        label="Time Limit (seconds)"
        variant="outlined"
        density="comfortable"
        class="mr-3 rounded-lg"
        min="1"
        hide-details="auto"
        @update:model-value="emitUpdate"
      ></v-text-field>

      <v-text-field
        v-model="localQuestion.memory_limit_mb"
        type="number"
        label="Memory Limit (MB)"
        variant="outlined"
        density="comfortable"
        class="rounded-lg"
        min="1"
        hide-details="auto"
        @update:model-value="emitUpdate"
      ></v-text-field>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import { CodeModel } from '@/types/Exercise';

const props = defineProps<{
  question: CodeModel,
  difficultyLevels: string[],
  programmingLanguages: string[]
}>();

const emit = defineEmits<{
  'update:question': [value: CodeModel]
}>();

const localQuestion = ref<CodeModel>({ ...props.question });

// Add a flag to prevent recursion
const isUpdatingFromEditor = ref(false);

watch(() => props.question, (newVal) => {
  // Only update the editor content if not currently updating from the editor
  if (!isUpdatingFromEditor.value) {
    localQuestion.value = { ...newVal };

    if (quill && quill.root) {
      // Use setContents instead of directly modifying innerHTML
      const delta = quill.clipboard.convert(newVal.question || '');
      quill.setContents(delta, 'api');
    }
  }
}, { deep: true });

const emitUpdate = () => {
  emit('update:question', { ...localQuestion.value });
};

const editorRef = ref<HTMLElement | null>(null);
let quill: Quill;

onMounted(() => {
  if (editorRef.value) {
    quill = new Quill(editorRef.value, {
      theme: 'snow',
      placeholder: 'Describe the coding problem to solve',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link']
        ]
      }
    });

    // Set initial content using delta
    const delta = quill.clipboard.convert(localQuestion.value.question || '');
    quill.setContents(delta);

    quill.on('text-change', (delta, oldContents, source) => {
      // Only emit updates for user changes, not programmatic ones
      if (source === 'user') {
        isUpdatingFromEditor.value = true;
        localQuestion.value.question = quill.root.innerHTML;
        emitUpdate();
        // Reset the flag after the update cycle
        setTimeout(() => {
          isUpdatingFromEditor.value = false;
        }, 0);
      }
    });
  }
});

</script>

<style scoped>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 150px;
  padding: 10px;
  background-color: white;
  text-align: left;
}
</style>

