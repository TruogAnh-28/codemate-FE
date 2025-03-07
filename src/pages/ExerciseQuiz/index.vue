<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <v-icon icon="mdi-book-open-variant" class="me-2"></v-icon>
        <span class="text-h6">{{ data ? 'Edit Exercise: Quiz' : 'Add Exercise: Quiz' }}</span>
      </div>
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        density="comfortable"
        @click="navigateBack"
      ></v-btn>
    </div>

    <div v-if="course" class="text-subtitle-1 text-grey-darken-1 mb-4">
      Course: [{{ course.course_nSemester }}] {{ course.course_name }} ({{ course?.course_courseID }}) - [{{ course.course_class_name }}]
    </div>
    <div class="text-caption text-grey mb-6">
      Please {{ data ? 'edit' : 'add' }} an exercise for this course to guide learners effectively.
    </div>

    <v-form @submit.prevent="handleSubmit">
      <!-- General Section -->
      <div class="text-h6 font-bold mb-2">General</div>
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field
            v-model="formData.name"
            label="Title"
            placeholder="Input the title for this exercise"
            variant="outlined"
            required
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.topic"
            label="Topic"
            placeholder="Input the topic for this exercise"
            variant="outlined"
          ></v-text-field>
        </v-col> -->
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="formData.description"
            label="Description"
            placeholder="Input the description for this exercise"
            variant="outlined"
            rows="4"
          ></v-textarea>
        </v-col>
      </v-row>

      <!-- Timing Section -->
      <div class="text-h6 font-bold mt-4 mb-2">Timing</div>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.time_open"
            type="datetime-local"
            label="Time Open"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.time_close"
            type="datetime-local"
            label="Time Close"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
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
      <div class="text-h6 font-bold mt-4 mb-2">Grade</div>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.attempts_allowed"
            type="number"
            label="Attempts Allowed"
            variant="outlined"
            min="1"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="formData.grading_method"
            :items="Object.values(GradingMethodType)"
            label="Grading Method"
            variant="outlined"
          ></v-select>
        </v-col>
        <!-- <v-col cols="12" md="3">
          <v-text-field
            v-model="formData.penalty_per_attempt"
            type="number"
            label="Penalty Per Attempt"
            variant="outlined"
            min="0"
          ></v-text-field>
        </v-col> -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.pass_mark"
            type="number"
            label="Pass Mark"
            variant="outlined"
            min="0"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Options Section -->
      <div class="text-h6 font-bold mt-4 mb-2">Options</div>
      <v-row>
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="formData.shuffle_questions"
            label="Shuffle Questions"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="formData.shuffle_answers"
            label="Shuffle Answers"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="formData.review_after_completion"
            label="Review After Completion"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="formData.show_correct_answers"
            label="Show Correct Answers"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>

      <!-- Questions Section -->
      <div class="text-h6 font-bold mt-4 mb-2">Questions</div>
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
          <v-col cols="12" md="6">
            <v-text-field
              v-model="question.question"
              label="Question"
              placeholder="Input the question"
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
          <v-col cols="12" md="2">
            <v-select
              v-model="question.difficulty"
              :items="difficultyLevels"
              label="Difficulty"
              variant="outlined"
              required
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="question.feedback"
              label="Feedback"
              placeholder="Input feedback for this question"
              variant="outlined"
              rows="2"
            ></v-textarea>
          </v-col>
        </v-row>

        <!-- True/False Question -->
        <template v-if="question.type === QuestionType.TrueFalse">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="question.options[0]"
                label="Option 1"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="question.options[1]"
                label="Option 2"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-radio-group v-model="question.answer[0]">
            <v-radio
              :label="question.options[0] || 'Option 1'"
              :value="question.options[0]"
            ></v-radio>
            <v-radio
              :label="question.options[1] || 'Option 2'"
              :value="question.options[1]"
            ></v-radio>
          </v-radio-group>
        </template>

        <!-- Single/Multiple Choice Questions -->
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
            @click="navigateBack"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
          >
            Save
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ExerciseQuizRequest, ExerciseQuizResponse, QuestionType } from '@/types/Exercise';
import {  GradingMethodType } from "@/utils/commonType"
import { exercisesService } from '@/services/Professor/ExerciseServices';
import { coursesService } from '@/services/Professor/CourseServices';
import { GetCourseDetailProfessorResponse } from "@/types/Course";
interface RouteParams {
  courseId: string;
  exerciseId?: string;
}

const route = useRoute();
const router = useRouter();
const { courseId, exerciseId } = route.params as RouteParams;
const difficultyLevels = ['easy', 'medium', 'hard'];
const showError = inject('showError') as (message: string) => void;
const showSuccess = inject('showSuccess') as (message: string) => void;
const data = ref<ExerciseQuizResponse | null>(null);
const course = ref<GetCourseDetailProfessorResponse | null>(null);
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
    score: 1
  }],
  max_score: 0,
  type: 'quiz',
  course_id: courseId,
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
  pass_mark: 0
});

const calculateMaxScore = computed(() => {
  return formData.value.questions.reduce(
    (sum, question) => sum + (Number(question.score) || 0),
    0
  );
});

const navigateBack = () => {
  router.push(`/professor-courselist/courses/${courseId}`);
};

const fetchCourseDetail = async () => {
  const response = await coursesService.fetchCourseDetail(
    { showError, showSuccess },
    courseId
  );
  if (response && "data" in response && response.data) {
    course.value = response.data as GetCourseDetailProfessorResponse;
  }
};


const fetchExerciseDetails = async () => {
  if (!exerciseId) return;

  try {
    const response = await exercisesService.getExerciseQuiz({ showError }, exerciseId);
    if (response.isSuccess && response.data) {
      data.value = response.data;
      const exerciseData = response.data;
      const formattedQuestions = exerciseData.questions.map(q => ({
        ...q,
        options: q.options.length ? q.options : ['', ''],
        answer: Array.isArray(q.answer) ? q.answer : [q.answer || ''],
        feedback: q.feedback || '',
        difficulty: q.difficulty || 'medium'
      }));
      formData.value = {
        ...formData.value, // Preserve defaults for fields not in response
        name: exerciseData.name,
        description: exerciseData.description || '',
        topic: exerciseData.topic || '',
        questions: formattedQuestions,
        max_score: exerciseData.max_score || 0,
        type: exerciseData.type,
        course_id: exerciseData.course_id,
        time_open: exerciseData.time_open || '',
        time_close: exerciseData.time_close || '',
        time_limit: exerciseData.time_limit || 0,
        attempts_allowed: exerciseData.attempts_allowed || 1,
        grading_method: exerciseData.grading_method || GradingMethodType.highest,
        shuffle_questions: exerciseData.shuffle_questions || false,
        shuffle_answers: exerciseData.shuffle_answers || false,
        review_after_completion: exerciseData.review_after_completion || false,
        show_correct_answers: exerciseData.show_correct_answers || false,
        penalty_per_attempt: exerciseData.penalty_per_attempt || 0,
        pass_mark: exerciseData.pass_mark || 0
      };
    }
  } catch (error) {
    showError('Error loading exercise data');
  }
};

onMounted(async () => {
  await fetchCourseDetail();
  await fetchExerciseDetails();
});

const addQuestion = () => {
  formData.value.questions.push({
    question: '',
    answer: [],
    options: ['', '', '', ''],
    feedback: '',
    type: QuestionType.SingleChoice,
    difficulty: 'medium',
    score: 1
  });
};

const removeQuestion = (index: number) => {
  if (formData.value.questions.length > 1) {
    formData.value.questions.splice(index, 1);
  }
};

const addOption = (questionIndex: number) => {
  formData.value.questions[questionIndex].options.push('');
};

const removeOption = (questionIndex: number, optionIndex: number) => {
  const question = formData.value.questions[questionIndex];
  if (question.options.length > 2) {
    const removedOption = question.options[optionIndex];
    question.options.splice(optionIndex, 1);
    question.answer = question.answer.filter(ans => ans !== removedOption);
  }
};

const handleAnswerChange = (questionIndex: number, optionIndex: number, type: string) => {
  const question = formData.value.questions[questionIndex];
  const option = question.options[optionIndex];

  if (type === QuestionType.SingleChoice) {
    question.answer = [option];
  } else if (type === QuestionType.MultipleChoice) {
    if (question.answer.includes(option)) {
      question.answer = question.answer.filter(ans => ans !== option);
    } else {
      question.answer.push(option);
    }
  }
};

const isOptionSelected = (question: any, option: string) => {
  return question.answer.includes(option);
};

const handleSubmit = async () => {
  console.log(formData.value);
  try {
    if (exerciseId) {
      const response = await exercisesService.editExerciseQuiz(
        { showError, showSuccess },
        exerciseId,
        formData.value
      );
      if (response.isSuccess) {
        showSuccess('Exercise quiz updated successfully');
        navigateBack();
      }
    } else {
      const response = await coursesService.postExerciseQuiz(
        { showError, showSuccess },
        formData.value
      );
      if (response) {
        showSuccess('Exercise quiz created successfully');
        navigateBack();
      }
    }
  } catch (error) {
    showError('Failed to save exercise quiz');
  }
};
watch(calculateMaxScore, (newValue) => {
  formData.value.max_score = newValue;
});
</script>