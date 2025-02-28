<template>
  <v-card class="pa-4">
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
      Please {{ data ? 'edit' : 'add' }} a exercise for this course to guide learners effectively.
    </div>

    <v-form @submit.prevent="handleSubmit">
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
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.deadline"
                type="date"
                label="Deadline"
                placeholder="Select date"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="timeInput"
                type="time"
                label="Time Limit (HH:mm)"
                placeholder="Select time limit"
                variant="outlined"
                :error-messages="timeError"
                @input="handleTimeInput"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.difficulty"
                :items="difficultyLevels"
                label="Difficulty"
                placeholder="Select Difficulty"
                variant="outlined"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.topic"
                label="Topic"
                placeholder="Select Topic"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="calculateMaxScore"
                label="Max score"
                variant="outlined"
                type="number"
                readonly
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.time"
                label="Duration"
                placeholder="Input the exam duration for this exercise"
                variant="outlined"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

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
            ></v-text-field>
          </v-col>
        </v-row>

        <template v-if="question.type === QuestionType.TrueFalse">
          <v-text-field
            v-model="question.answer[0]"
            label="Correct Answer"
            placeholder="Input the correct answer for this question"
            variant="outlined"
            class="mb-3"
          ></v-text-field>
          <v-text-field
            v-model="question.options[0]"
            label="False Answer"
            placeholder="Input the false answer for this question"
            variant="outlined"
          ></v-text-field>
        </template>

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
                  :model-value="data?isOptionSelected(question, option):false"
                  density="compact"
                  hide-details
                  @change="handleAnswerChange(index, optIndex,question.type)"
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
import { ref, onMounted } from 'vue';
import { ExerciseQuizResponse, QuestionType } from '@/types/Exercise';
import { exercisesService } from '@/services/Professor/ExerciseServices';

const props = defineProps<{
  courseId: string;
  courseName: string;
  data?: ExerciseQuizResponse | null;
}>();

const difficultyLevels = ['easy', 'medium', 'hard'];
const timeInput = ref('');
const timeError = ref('');
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: ExerciseQuizResponse): void;
}>();


// Initialize with default form data
const formData = ref<ExerciseQuizResponse>({
  exercise_id: crypto.randomUUID(),
  course_id: props.courseId,
  name: '',
  description: '',
  topic: '',
  difficulty: 'medium',
  type: 'quiz',
  questions: [{
    question: '',
    answer: [],
    options: ['', '', '', ''],
    type: QuestionType.SingleChoice,
    score: 1
  }],
  max_score: 0,
  time: 0,
  deadline: ''
});
const calculateMaxScore = computed(() => {
  return formData.value.questions.reduce(
    (sum, question) => sum + (Number(question.score) || 0),
    0
  );
});
onMounted(() => {
  if (props.data ) {
    try {
      const exerciseData = props.data;
      if (exerciseData.questions){
        const formattedQuestions = exerciseData.questions.map(question => ({
        ...question,
        options: question.options,
        answer: Array.isArray(question.answer) ? question.answer : [question.answer]
      }));

      // Format the deadline to match the input date format (YYYY-MM-DD)
      const deadline = exerciseData.deadline 
        ? new Date(exerciseData.deadline).toISOString().split('T')[0]
        : '';

      // Update form data
      formData.value = {
        ...exerciseData,
        deadline,
        questions: formattedQuestions
      };
      console.log(formData.value)
      // Set time input
      if (exerciseData.time) {
        const hours = Math.floor(exerciseData.time / 60);
        const minutes = exerciseData.time % 60;
        timeInput.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      ;
      }
      
      
    } catch (error) {
      console.error('Error initializing form data:', error);
      showError('Error initializing form data. Using default values.');
    }
  }
});

const handleTimeInput = () => {
  timeError.value = '';
  if (timeInput.value) {
    const [hours, minutes] = timeInput.value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      timeError.value = 'Invalid time format';
      return;
    }
    // Convert time to minutes
    formData.value.time = hours * 60 + minutes;
  } else {
    formData.value.time = 0;
  }
};

const addQuestion = () => {
  formData.value.questions.push({
    question: '',
    answer: [],
    options: ['', '', '', ''],
    type: QuestionType.SingleChoice,
    score: 1
  });
};

const handleAnswerChange = (questionIndex: number, optionIndex: number, type: string) => {
  const question = formData.value.questions[questionIndex];
  
  if (type === QuestionType.SingleChoice) {
    question.answer = [question.options[optionIndex]];
  } else if (type === QuestionType.MultipleChoice) {
    const answer = question.answer as string[];
    const option = question.options[optionIndex];
    
    if (answer.includes(option)) {
      question.answer = answer.filter(ans => ans !== option);
    } else {
      question.answer = [...answer, option];
    }
  }
};

const isOptionSelected = (question: any, option: string) => {
  return question.answer.includes(option);
};

const removeQuestion = (index: number) => {
  formData.value.questions.splice(index, 1);
};

const addOption = (questionIndex: number) => {
  formData.value.questions[questionIndex].options.push('');
};

const removeOption = (questionIndex: number, optionIndex: number) => {
  const question = formData.value.questions[questionIndex];
  if (question.options.length > 2) {
    question.options.splice(optionIndex, 1);
    // Remove the option from answers if it was selected
    if (question.answer.includes(question.options[optionIndex])) {
      question.answer = question.answer.filter(ans => ans !== question.options[optionIndex]);
    }
  }
};

const handleSubmit = async () => {
  // formData.value.max_score = formData.value.questions.reduce(
  //   (sum, question) => sum + question.score,
  //   0
  // );
  
  if (!timeInput.value) {
    timeError.value = 'Time limit is required';
    return;
  }
  if(props.data){
    const response = await exercisesService.editExerciseQuiz(
        { showError, showSuccess },
        props.data.exercise_id,
        formData.value
      );
    if (response.isSuccess){
      emit('close');
    }
  }else{
    emit('submit', formData.value);
    emit('close');
  }
};
</script>