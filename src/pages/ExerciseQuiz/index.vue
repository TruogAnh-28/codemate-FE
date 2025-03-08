<template>
  <v-card class="rounded-xl border-card" elevation="3">
    <div class="card-header pa-6 d-flex align-center">
      <v-icon color="primary" size="x-large" class="mr-4">mdi-help-box</v-icon>
      <div>
        <h2 class="text-h5 font-weight-bold">
          {{ data ? 'Edit Exercise: Quiz' : 'Add Exercise: Quiz' }}
        </h2>
        <p class="text-subtitle-2 text-medium-emphasis mb-0">
          {{ course ? `Course: [${course.course_nSemester}] ${course.course_name} (${course?.course_courseID}) - [${course.course_class_name}]` : 'Loading course...' }}
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        @click="navigateBack"
      ></v-btn>
    </div>

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="form" @submit.prevent="handleSubmit">
        <!-- General Section -->
        <GeneralSection v-model:formData="formData" />

        <!-- Timing Section -->
        <TimingSection v-model:formData="formData" />

        <!-- Grade Section -->
        <GradeSection 
          v-model:formData="formData" 
          :gradingMethodOptions="Object.values(GradingMethodType)" 
        />

        <!-- Options Section -->
        <OptionsSection v-model:formData="formData" />

        <!-- Questions Section -->
        <QuestionsSection 
          v-model:questions="formData.questions"
          :questionTypes="Object.values(QuestionType)"
          :difficultyLevels="difficultyLevels"
        />

        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
          color="primary"
          class="text-none mt-2 mb-6 rounded-lg"
          @click="addQuestion"
        >
          Add Another Question
        </v-btn>
      </v-form>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pa-6">
      <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        class="rounded-lg mr-4"
        @click="navigateBack"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        class="rounded-lg"
        prepend-icon="mdi-check-circle"
        @click="handleSubmit"
      >
        {{ data ? 'Update Quiz' : 'Create Quiz' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { ExerciseQuizRequest, ExerciseQuizResponse, QuestionType } from '@/types/Exercise';
import { GradingMethodType } from "@/utils/commonType";
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
const form = ref<any>(null);
const data = ref<ExerciseQuizResponse | null>(null);
const course = ref<GetCourseDetailProfessorResponse | null>(null);
const formData = ref<ExerciseQuizRequest>({
  name: '',
  description: '',
  topic: '',
  questions: [{
    question: '',
    answer: ['0'],
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

// Function to calculate max score
const calculateMaxScore = () => {
  if (!formData.value.questions || !Array.isArray(formData.value.questions)) {
    formData.value.max_score = 0;
    return;
  }
  
  const totalScore = formData.value.questions.reduce((sum, question) => {
    const questionScore = Number(question.score) || 0;
    return sum + questionScore;
  }, 0);
  
  formData.value.max_score = totalScore;
};

// Watch for changes in questions to update max_score
watch(() => formData.value.questions, () => {
  calculateMaxScore();
}, { deep: true, immediate: true });

const navigateBack = () => {
  router.push(`/professor-courselist/courses/${courseId}`);
};

const fetchCourseDetail = async () => {
  try {
    const response = await coursesService.fetchCourseDetail(
      { showError, showSuccess },
      courseId
    );
    if (response && "data" in response && response.data) {
      course.value = response.data as GetCourseDetailProfessorResponse;
    }
  } catch (error) {
    showError('Error loading course details');
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
        answer: Array.isArray(q.answer) ? q.answer : [q.answer || '0'],
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
      
      // Calculate max score after loading the data
      calculateMaxScore();
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
    answer: ['0'],
    options: ['', '', '', ''],
    feedback: '',
    type: QuestionType.SingleChoice,
    difficulty: 'medium',
    score: 1
  });
};

const handleSubmit = async () => {
  if (!form.value?.validate()) {
    showError('Please check the form for errors');
    return;
  }
  
  // Ensure max_score is up-to-date before submission
  calculateMaxScore();
  
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
</script>