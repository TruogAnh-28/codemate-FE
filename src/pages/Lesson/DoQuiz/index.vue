<template>
  <v-container fluid class="ma-0" v-if="quizExercise">
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
        <CardQuizResult
          v-if="quizExercise.status === 'completed'"
          :question="question"
          :ordinal="index + 1"
        />
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

    <v-dialog v-model="isConfirmDialogOpen" max-width="400">
      <v-card>
        <v-card-title>Confirm Submission</v-card-title>
        <v-card-text>
          Are you sure you want to submit your answers? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-btn @click="isConfirmDialogOpen = false">Cancel</v-btn>
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

interface RouteParams {
  quizId: string;
  moduleId: string;
}

const quizExercise = ref<QuizExerciseResponse | null>(null);
const answers = ref<(number | null)[]>([]);
const isConfirmDialogOpen = ref(false);
const isResultDialogOpen = ref(false);
const score = ref(0);
const quizResult = ref<QuizScoreResponse | null>(null);

const route = useRoute();
const { quizId, moduleId } = route.params as RouteParams;

const breadcrumbsStore = useBreadcrumbsStore();
const routeState = (route as any).state as { breadcrumbs?: Breadcrumbs[] } | undefined;
if (routeState?.breadcrumbs) {
  breadcrumbsStore.setBreadcrumbs(routeState.breadcrumbs);
}
const breadcrumbs = computed(() => breadcrumbsStore.breadcrumbs);

function openConfirmDialog() {
  isConfirmDialogOpen.value = true;
}

async function confirmSubmit() {
  isConfirmDialogOpen.value = false;
  await submitQuizAnswers();
  isResultDialogOpen.value = true;
}

function handleAnswer(questionIndex: number, selectedAnswerIndex: number) {
  answers.value[questionIndex] = selectedAnswerIndex;
}

async function finishQuiz() {
  isResultDialogOpen.value = false;
  await fetchQuizDetails();
}

const fetchQuizDetails = async () => {
  const data = await moduleService.fetchQuizDetails(showError, moduleId, quizId);
  quizExercise.value = data;

  if (data?.questions) {
    answers.value = new Array(data.questions.length).fill(null);
  }
};

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