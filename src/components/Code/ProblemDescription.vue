<template>
  <v-sheet class="fill-height d-flex flex-column">
    <v-tabs v-model="descriptionTab" bg-color="grey-darken-4">
      <v-tab value="description">Description</v-tab>
      <v-tab value="submission">Submission</v-tab>
    </v-tabs>
    
    <v-card-text class="problem-description pa-4 flex-grow-1 overflow-y-auto">
      <h2>Two sum</h2>
      <div class="problem-tags mb-4">
        <v-chip size="small" color="grey" class="mr-2">Easy</v-chip>
        <v-chip size="small" color="grey" class="mr-2">Array</v-chip>
        <v-chip size="small" color="grey">Hash table</v-chip>
      </div>

      <p>{{ problemDescription }}</p>
      
      <div v-for="(example, index) in examples" :key="index" class="examples mt-4">
        <h3>{{ example.title }}</h3>
        <v-sheet color="grey-darken-3" class="pa-2 rounded">
          <p><strong>Input:</strong> nums = {{ example.input.nums }}, target = {{ example.input.target }}</p>
          <p><strong>Output:</strong> {{ example.output }}</p>
          <p v-if="example.explanation"><strong>Explanation:</strong> {{ example.explanation }}</p>
        </v-sheet>
      </div>

      <div class="constraints mt-4">
        <h3>Constraints:</h3>
        <ul>
          <li v-for="(constraint, index) in constraints" :key="index">{{ constraint }}</li>
        </ul>
      </div>
    </v-card-text>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { PROBLEM_DESCRIPTION, PROBLEM_EXAMPLES, PROBLEM_CONSTRAINTS } from '@/constants/templateProblem';

interface ProblemExample {
  title: string;
  input: {
    nums: string;
    target: string;
   
  };
  output: string;
  explanation?: string;
}

interface ProblemDescriptionProps {
  initialTab?: string;
}

const props = withDefaults(defineProps<ProblemDescriptionProps>(), {
  initialTab: 'description'
});

const emit = defineEmits<{
  (e: 'update:tab', tab: string): void;
}>();

const descriptionTab = ref<string>(props.initialTab);
const problemDescription = ref<string>(PROBLEM_DESCRIPTION);
const examples = ref<ProblemExample[]>(PROBLEM_EXAMPLES);
const constraints = ref<string[]>(PROBLEM_CONSTRAINTS);

// Watch for tab changes and emit event
watch(descriptionTab, (newValue) => {
  emit('update:tab', newValue);
});
</script>

<style scoped>
.problem-description {
  overflow-y: auto;
}
</style>