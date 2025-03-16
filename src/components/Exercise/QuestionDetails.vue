<template>
  <div>
    <v-textarea
      v-model="localQuestion.question"
      label="Question Text*"
      placeholder="Describe the coding problem to solve"
      variant="outlined"
      density="comfortable"
      class="mb-4 rounded-lg"
      rows="4"
      :rules="[v => !!v || 'Question text is required']"
      hide-details="auto"
      @update:model-value="emitUpdate"
    ></v-textarea>

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

    <!-- Performance Constraints -->
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
import { CodeModel } from '@/types/Exercise';

const props = defineProps<{
  question: CodeModel,
  difficultyLevels: string[],
  programmingLanguages: string[]
}>();

const emit = defineEmits<{
  'update:question': [value: CodeModel]
}>();

// Use a local copy to avoid directly modifying props
const localQuestion = ref<CodeModel>({ ...props.question });

// Watch for prop changes to update local state
watch(() => props.question, (newVal) => {
  localQuestion.value = { ...newVal };
}, { deep: true });

// Emit update whenever local state changes
const emitUpdate = () => {
  emit('update:question', { ...localQuestion.value });
};
</script>