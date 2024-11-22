<template>
  <v-container fluid class="ma-0">
    <!-- Hiển thị câu hỏi hoặc kết quả -->
    <v-row>
      <v-col
        v-for="(question, index) in questions"
        :key="index"
        cols="12"
      >
        <!-- Nếu trạng thái là hoàn thành, hiển thị kết quả -->
        <CardQuizResult
          v-if="status === 'completed'"
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
    <v-row v-if="status !== 'completed'" justify="center">
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
          You scored {{ score }} points out of {{ maxScore }}.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="finishQuiz" elevation="2">View Results</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts" setup>
import { QuizQuestion } from "@/types/Exercise";
import { quizQuestionsData } from "@/constants/exercise";

const questions = ref<QuizQuestion[]>(quizQuestionsData);
const status = ref<'new' | 'on going' | 'completed'>('new');

// Dialog states
const isConfirmDialogOpen = ref(false);
const isResultDialogOpen = ref(false);

// Score tracking
const score = ref(0);
const maxScore = questions.value.length;

// Open confirmation dialog
function openConfirmDialog() {
  isConfirmDialogOpen.value = true;
}

// Confirm submission and show result
function confirmSubmit() {
  isConfirmDialogOpen.value = false;
  calculateScore();
  isResultDialogOpen.value = true;
}

// Calculate the score
function calculateScore() {
  score.value = 0;
  questions.value.forEach((question: QuizQuestion) => {
    if (question.chooseUser === question.correctAnswer) {
      score.value++;
    }
  });
}

// Handle user's answer
function handleAnswer(questionIndex: number, selectedAnswer: number) {
  const selectedOption = questions.value[questionIndex].options[selectedAnswer];
  questions.value[questionIndex].chooseUser = selectedOption;
}

// Finish the quiz and mark it as completed
function finishQuiz() {
  isResultDialogOpen.value = false;
  status.value = 'completed';
}
</script>
