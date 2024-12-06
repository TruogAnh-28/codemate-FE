<template>
  <v-container fluid class="ma-0" v-if="quizExercise">
    <!-- Hiển thị câu hỏi hoặc kết quả -->
    <v-breadcrumbs class="ma-0 pa-0 mb-4"
      :items="breadcrumbs"
      divider="/"
    ></v-breadcrumbs>
    <v-row>
      <v-col
        v-for="(question, index) in quizExercise.questions"
        :key="index"
        cols="12"
      >
        <!-- Nếu trạng thái là hoàn thành, hiển thị kết quả -->
        <CardQuizResult
          v-if="quizExercise.status === 'completed'"
          :question="question"
          :ordinal="index + 1"
        />
        <!-- Nếu chưa hoàn thành, hiển thị câu hỏi -->
        <CardQuestionQuiz
          v-else
          :question="question"
          :ordinal="index + 1"
          @answerSelected="handleAnswer(index, $event)"
        />
      </v-col>
    </v-row>
    <v-row v-if="quizExercise.status !== 'completed'" justify="center">
      <v-col cols="auto">
        <v-btn color="primary" @click="openConfirmDialog">Submit</v-btn>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <v-dialog v-model="isConfirmDialogOpen" max-width="400">
      <v-card>
        <v-card-title>Confirm Submission</v-card-title>
        <v-card-text>
          Are you sure you want to submit your answers? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="isConfirmDialogOpen = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmSubmit" elevation="2">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isResultDialogOpen" max-width="400">
      <v-card>
        <v-card-title>Quiz Results</v-card-title>
        <v-card-text>
          You scored {{ score }} points out of {{ quizExercise.questions.length }}.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="finishQuiz" elevation="2">View Results</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { moduleService } from "@/services/module";
import { QuizExerciseResponse, QuizAnswerRequest, QuizScoreResponse } from "@/types/Exercise";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { Breadcrumbs } from "@/types/Breadcrumbs";

const quizExercise = ref<QuizExerciseResponse | null>(null);
const answers = ref<(number | null)[]>([]);
const isConfirmDialogOpen = ref(false);
const isResultDialogOpen = ref(false);
const score = ref(0);
const quizResult = ref<QuizScoreResponse | null>(null);

const route = useRoute();
const quizId = route.params.quizId as string;
const moduleId = route.params.moduleId as string;

const breadcrumbsStore = useBreadcrumbsStore();
const routeState = route.state as { breadcrumbs?: Breadcrumbs[] };

// Gán breadcrumbs từ route state nếu có
if (routeState?.breadcrumbs) {
  breadcrumbsStore.setBreadcrumbs(routeState.breadcrumbs);
}

const breadcrumbs = computed(() => breadcrumbsStore.breadcrumbs);


// Open confirmation dialog
function openConfirmDialog() {
  isConfirmDialogOpen.value = true;
}

// Confirm submission and show result
async function confirmSubmit() {
  isConfirmDialogOpen.value = false;
  await submitQuizAnswers();
  isResultDialogOpen.value = true;
}

// Handle user's answer
function handleAnswer(questionIndex: number, selectedAnswerIndex: number) {
  answers.value[questionIndex] = selectedAnswerIndex;
}

// Finish the quiz and mark it as completed
async function finishQuiz() {
  isResultDialogOpen.value = false;
  await fetchQuizDetails();
}

// Fetch quiz details
const fetchQuizDetails = async () => {
  const data = await moduleService.fetchQuizDetails(showError, moduleId, quizId);
  quizExercise.value = data;

  // Initialize answers array based on number of questions
  if (data?.questions) {
    answers.value = new Array(data.questions.length).fill(null);
  }
};

// Submit quiz answers
const submitQuizAnswers = async () => {
  if (!quizExercise.value) return;

  const submitQuizAnswersRequest: QuizAnswerRequest = {
    quizId,
    answers: answers.value,
  };

  const result = await moduleService.submitQuizAnswers(
    showError,
    moduleId,
    quizId,
    submitQuizAnswersRequest
  );

  if (result) {
    quizResult.value = result;
    score.value = result.correct_answers;
  }
};

const showError = inject("showError") as (message: string) => void;

onMounted(() => {
  fetchQuizDetails();
});
</script>
