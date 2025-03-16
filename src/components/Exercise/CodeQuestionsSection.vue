<template>
  <div class="mb-6">
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-code-braces</v-icon>
      <h3 class="text-subtitle-1 font-weight-bold mb-0">Coding Questions</h3>
    </div>

    <v-sheet 
      v-for="(question, questionIndex) in questions" 
      :key="questionIndex" 
      rounded="lg" 
      elevation="1" 
      class="pa-4 mb-4 "
    >
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

      <QuestionDetails 
        :question="question" 
        :difficultyLevels="difficultyLevels"
        :programmingLanguages="programmingLanguages"
        @update:question="updateQuestion(questionIndex, $event)"
      />

      <TestCasesSection
        :questionIndex="questionIndex"
        :testcases="question.testcases"
        @add-test-case="addTestCase(questionIndex)"
        @remove-test-case="removeTestCase(questionIndex, $event)"
        @update:testcases="updateTestCases(questionIndex, $event)"
      />
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { CodeModel } from '@/types/Exercise';

const props = defineProps<{
  questions: CodeModel[],
  difficultyLevels: string[],
  programmingLanguages: string[]
}>();

const emit = defineEmits<{
  'update:questions': [value: CodeModel[]]
}>();

const removeQuestion = (questionIndex: number) => {
  const updatedQuestions = [...props.questions];
  updatedQuestions.splice(questionIndex, 1);
  emit('update:questions', updatedQuestions);
};

const updateQuestion = (questionIndex: number, updatedQuestion: CodeModel) => {
  const updatedQuestions = [...props.questions];
  updatedQuestions[questionIndex] = updatedQuestion;
  emit('update:questions', updatedQuestions);
};

const addTestCase = (questionIndex: number) => {
  const updatedQuestions = [...props.questions];
  updatedQuestions[questionIndex].testcases.push({
    inputs: [''],
    output: '',
    is_hidden: false,
    description: 'New test case'
  });
  emit('update:questions', updatedQuestions);
};

const removeTestCase = (questionIndex: number, testcaseIndex: number) => {
  const updatedQuestions = [...props.questions];
  updatedQuestions[questionIndex].testcases.splice(testcaseIndex, 1);
  emit('update:questions', updatedQuestions);
};

const updateTestCases = (questionIndex: number, updatedTestcases: any[]) => {
  const updatedQuestions = [...props.questions];
  updatedQuestions[questionIndex].testcases = updatedTestcases;
  emit('update:questions', updatedQuestions);
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
</style>