<template>
  <v-card class="pa-4">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <v-icon icon="mdi-book-open-variant" class="me-2"></v-icon>
        <span class="text-h6">{{ data ? 'Edit Exercise: Quiz' : 'Add Exercise: Quiz' }}</span>
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        @click="$emit('close')"
      ></v-btn>
    </div>

    <div class="text-subtitle-1 text-grey-darken-1 mb-4">
      Course: {{ props.courseName }}
    </div>
    <div class="text-caption text-grey mb-6">
      Please {{ data ? 'edit' : 'add' }} an exercise for this course to guide learners effectively.
    </div>

    <v-form @submit.prevent="handleSubmit">
      <!-- General Section -->
      <div class="text-h6 mb-2">General</div>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.name"
            label="Title"
            placeholder="Input the title for this exercise"
            variant="outlined"
            required
          ></v-text-field>
          <v-textarea
            v-model="formData.description"
            label="Description"
            placeholder="Input the description for this exercise"
            variant="outlined"
            rows="4"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.topic"
            label="Topic"
            placeholder="Input the topic for this exercise"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Timing Section -->
      <div class="text-h6 mt-4 mb-2">Timing</div>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.time_open"
            type="datetime-local"
            label="Open the Quiz"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.time_close"
            type="datetime-local"
            label="Close the Quiz"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.time_limit"
            type="number"
            label="Time Limit (minutes)"
            variant="outlined"
            min="0"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Grade Section -->
      <div class="text-h6 mt-4 mb-2">Grade</div>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.attempts_allowed"
            label="Attempts Allowed"
            type="number"
            variant="outlined"
            min="0"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.grading_method"
            :items="gradingMethods"
            label="Grading Method"
            variant="outlined"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.penalty_per_attempt"
            label="Penalty Per Attempt"
            type="number"
            variant="outlined"
            min="0"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.pass_mark"
            label="Pass Mark"
            type="number"
            variant="outlined"
            min="0"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Options Section -->
      <div class="text-h6 mt-4 mb-2">Options</div>
      <v-row>
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="formData.shuffle_questions"
            label="Shuffle Questions"
          ></v-checkbox>
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="formData.shuffle_answers"
            label="Shuffle Answers"
          ></v-checkbox>
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="formData.review_after_completion"
            label="Review After Completion"
          ></v-checkbox>
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="formData.show_correct_answers"
            label="Show Correct Answers"
          ></v-checkbox>
        </v-col>
      </v-row>

      <!-- Questions Section -->
      <div class="text-h6 mt-4 mb-2">Questions</div>
      <v-card
        v-for="(question, index) in formData.questions"
        :key="index"
        class="mt-4 pa-4"
        variant="outlined"
      >
        <div class="d-flex justify-space-between align-center mb-4">
          <span class="text-h6">Question {{ index + 1 }}</span>
          <v-btn
            icon="mdi-delete"
            variant="text"
            color="error"
            @click="removeQuestion(index)"
            :disabled="formData.questions.length === 1"
          ></v-btn>
        </div>

        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="question.question"
              label="Question"
              placeholder="Input the question for this exercise"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="question.type"
              :items="Object.values(QuestionType)"
              label="Type"
              variant="outlined"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="question.score"
              label="Score"
              placeholder="Input score"
              variant="outlined"
              type="number"
              required
              min="0"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="question.difficulty"
              :items="difficultyLevels"
              label="Difficulty"
              variant="outlined"
              required
            ></v-select>
          </v-col>
        </v-row>

        <v-textarea
          v-model="question.feedback"
          label="Feedback"
          placeholder="Input feedback for this question"
          variant="outlined"
        ></v-textarea>

        <!-- True/False Question Options -->
        <template v-if="question.type === QuestionType.TrueFalse">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="question.options[0]"
                label="Option 1 (e.g., True)"
                placeholder="Input first option"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="question.options[1]"
                label="Option 2 (e.g., False)"
                placeholder="Input second option"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-radio-group v-model="question.answer[0]">
            <v-radio :label="question.options[0] || 'Option 1'" :value="question.options[0]"></v-radio>
            <v-radio :label="question.options[1] || 'Option 2'" :value="question.options[1]"></v-radio>
          </v-radio-group>
        </template>

        <!-- Single/Multiple Choice Question Options -->
        <template v-else>
          <div v-for="(option, optIndex) in question.options" :key="optIndex" class="mb-3">
            <v-text-field
              v-model="question.options[optIndex]"
              :label="`Option ${optIndex + 1}`"
              placeholder="Input option"
              variant="outlined"
              required
            >
              <template v-slot:append>
                <v-checkbox
                  :model-value="isOptionSelected(question, option)"
                  density="compact"
                  hide-details
                  @change="handleAnswerChange(index, optIndex, question.type)"
                ></v-checkbox>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  density="comfortable"
                  @click="removeOption(index, optIndex)"
                  :disabled="question.options.length <= 2"
                ></v-btn>
              </template>
            </v-text-field>
          </div>
          <v-btn
            variant="tonal"
            prepend-icon="mdi-plus"
            @click="addOption(index)"
            class="mb-2"
          >
            Add Option
          </v-btn>
        </template>
      </v-card>

      <!-- Form Actions -->
      <div class="d-flex justify-space-between mt-4">
        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="addQuestion"
        >
          Add Question
        </v-btn>
        <div>
          <v-btn
            color="grey"
            variant="tonal"
            class="me-2"
            @click="$emit('close')"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="handleSubmit"
          >
            Save
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { ExerciseQuizRequest, ExerciseQuizResponse, QuestionType } from '@/types/Exercise';
import { DifficultyLevel, GradingMethodType } from "@/utils/commonType"
import { exercisesService } from '@/services/Professor/ExerciseServices';

const props = defineProps<{
  courseId: string;
  courseName: string;
  data?: ExerciseQuizResponse | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: ExerciseQuizRequest): void;
}>();

const difficultyLevels = ['easy', 'medium', 'hard'] as DifficultyLevel[];
const gradingMethods = ['highest', 'average', 'first', 'last'] as GradingMethodType[]; // Adjust based on actual GradingMethodType enum

const showError = inject<(message: string) => void>('showError')!;
const showSuccess = inject<(message: string) => void>('showSuccess')!;

// Initialize formData with default values matching ExerciseQuizRequest
const formData = ref<ExerciseQuizRequest>({
  name: '',
  description: '',
  topic: '',
  questions: [{
    question: '',
    answer: [],
    options: ['', '', '', ''],
    feedback: '',
    type: QuestionType.SingleChoice,
    difficulty: 'medium',
    score: 1,
  }],
  type: 'quiz',
  course_id: props.courseId,
  time_open: '',
  time_close: '',
  time_limit: 0,
  attempts_allowed: 1,
  grading_method: GradingMethodType.highest,
  shuffle_questions: false,
  shuffle_answers: false,
  review_after_completion: false,
  show_correct_answers: false,
  penalty_per_attempt: 0,
  pass_mark: 0,
});

// Computed property for max_score
const calculateMaxScore = computed(() => {
  return formData.value.questions.reduce((sum, question) => sum + (Number(question.score) || 0), 0);
});

// Initialize form data when editing
onMounted(() => {
  if (props.data) {
    formData.value = {
      ...props.data,
      time_open: props.data.time_open ? new Date(props.data.time_open).toISOString().slice(0, 16) : '',
      time_close: props.data.time_close ? new Date(props.data.time_close).toISOString().slice(0, 16) : '',
      questions: props.data.questions.map(q => ({ ...q })),
    };
  }
});

// Add a new question
const addQuestion = () => {
  formData.value.questions.push({
    question: '',
    answer: [],
    options: ['', '', '', ''],
    feedback: '',
    type: QuestionType.SingleChoice,
    difficulty: 'medium',
    score: 1,
  });
};

// Handle answer selection for questions
const handleAnswerChange = (questionIndex: number, optionIndex: number, type: QuestionType) => {
  const question = formData.value.questions[questionIndex];
  const option = question.options[optionIndex];

  if (type === QuestionType.SingleChoice || type === QuestionType.TrueFalse) {
    question.answer = [option];
  } else if (type === QuestionType.MultipleChoice) {
    const answer = question.answer as string[];
    if (answer.includes(option)) {
      question.answer = answer.filter(ans => ans !== option);
    } else {
      question.answer = [...answer, option];
    }
  }
};

// Check if an option is selected
const isOptionSelected = (question: any, option: string) => {
  return question.answer.includes(option);
};

// Remove a question
const removeQuestion = (index: number) => {
  if (formData.value.questions.length > 1) {
    formData.value.questions.splice(index, 1);
  }
};

// Add an option to a question
const addOption = (questionIndex: number) => {
  formData.value.questions[questionIndex].options.push('');
};

// Remove an option from a question
const removeOption = (questionIndex: number, optionIndex: number) => {
  const question = formData.value.questions[questionIndex];
  if (question.options.length > 2) {
    const removedOption = question.options[optionIndex];
    question.options.splice(optionIndex, 1);
    question.answer = question.answer.filter(ans => ans !== removedOption);
  }
};

// Handle form submission
const handleSubmit = async () => {
  // Optionally set max_score if required by the backend
  formData.value.max_score = calculateMaxScore.value;

  if (props.data) {
    // Editing an existing exercise
    const response = await exercisesService.editExerciseQuiz(
      { showError, showSuccess },
      props.data.exercise_id,
      formData.value
    );
    if (response.isSuccess) {
      emit('close');
    }
  } else {
    // Adding a new exercise
    emit('submit', formData.value);
    emit('close');
  }
};
</script>