<template>
  <v-container fluid class="px-12" v-if="quizExercise">
    <!-- Breadcrumbs -->
    <v-breadcrumbs
      class="ma-0 pa-0 mb-4"
      :items="breadcrumbs"
      divider="/"
    ></v-breadcrumbs>
    
    <!-- Main Quiz Header Card -->
    <v-card class="border-card mb-6 overflow-hidden" elevation="3">
      <div class="card-header pa-6 d-flex align-center">
        <v-icon color="primary" size="x-large" class="mr-4">mdi-help-circle-outline</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">{{ quizExercise.name }}</h2>
          <p class="text-subtitle-2 text-medium-emphasis mb-0">
            {{ questionCount }} questions to complete
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-chip
          v-if="quizExercise.status === 'completed'"
          class="px-4 py-2 ml-2"
          color="success"
          prepend-icon="mdi-check-circle"
          elevation="1"
        >
          Completed: {{ quizExercise.score }}/{{ quizExercise.max_score }}
        </v-chip>
        <v-chip
          v-else
          class="px-4 py-2 ml-2"
          color="primary"
          prepend-icon="mdi-play-circle"
          elevation="1"
        >
          In Progress
        </v-chip>
      </div>
      
      <v-card-text class="px-6 pt-4 pb-6" v-if="quizExercise.description">
        <v-sheet rounded="lg" elevation="0" class="pa-4 bg-grey-lighten-4 border-left-primary">
          <p class="text-body-1 mb-0">{{ quizExercise.description }}</p>
        </v-sheet>
      </v-card-text>
    </v-card>

    <!-- Questions Section -->
    <v-row>
      <v-col
        v-for="(question, index) in quizExercise.questions"
        :key="question.id"
        cols="12"
      >
        <v-card class="border-card mb-4 question-card" elevation="2">
          <div class="question-header pa-4 d-flex align-center">
            <v-avatar
              :color="`primary-${(index % 3) + 1}`"
              class="mr-3"
              size="42"
            >
              <span class="text-h6 font-weight-bold white--text">{{ index + 1 }}</span>
            </v-avatar>
            <h3 class="text-subtitle-1 font-weight-bold mb-0 flex-grow-1">Question {{ index + 1 }}</h3>
            <v-chip
              size="small"
              :color="getDifficultyColor(question.difficulty)"
              class="ml-auto"
            >
              {{ question.difficulty }}
            </v-chip>
            <v-chip
              size="small"
              color="info"
              class="ml-2"
            >
              {{ question.points }} points
            </v-chip>
          </div>
          
          <v-card-text class="pa-4">
            <p class="text-body-1 font-weight-medium mb-4">{{ question.question_text }}</p>
            
            <!-- Dynamically render input based on question type -->
            <template v-if="question.question_type === 'single_choice'">
              <v-radio-group
                v-model="answers[index]"
                :disabled="quizExercise.status === 'completed'"
                @update:model-value="(value: string | null) => handleAnswer(index, value)"
              >
                <v-radio
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  :value="option"
                  :label="option"
                  :class="getOptionClass(question, option)"
                  class="mb-2 option-radio pa-2 rounded-lg"
                ></v-radio>
              </v-radio-group>
            </template>

            <template v-else-if="question.question_type === 'multiple_choice'">
              <v-checkbox-group
                v-model="multiChoiceAnswers[index]"
                :disabled="quizExercise.status === 'completed'"
                @update:model-value="(value: string[]) => handleMultiAnswer(index, value)"
              >
                <v-checkbox
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  :value="option"
                  :label="option"
                  :class="getOptionClass(question, option)"
                  class="mb-2 option-checkbox pa-2 rounded-lg"
                ></v-checkbox>
              </v-checkbox-group>
            </template>
            <template v-else-if="question.question_type === 'true_false'">
              <v-radio-group
                v-model="answers[index]"
                :disabled="quizExercise.status === 'completed'"
                @update:model-value="(value: string | null) => handleAnswer(index, value)"
              >
                <v-radio
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  :value="option"
                  :label="option"
                  :class="getOptionClass(question, option)"
                  class="mb-2 option-radio pa-2 rounded-lg"
                ></v-radio>
              </v-radio-group>
            </template>
            
            <!-- Explanation (only shown when completed) -->
            <v-expand-transition>
              <div v-if="quizExercise.status === 'completed'" class="mt-4">
                <v-divider class="mb-3"></v-divider>
                <v-sheet rounded="lg" elevation="0" class="pa-4 bg-grey-lighten-4 border-left-primary">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="primary" class="mr-2">mdi-lightbulb-outline</v-icon>
                    <h4 class="text-subtitle-2 font-weight-bold mb-0">Explanation</h4>
                  </div>
                  <p class="text-body-2 mb-0">{{ question.explanation }}</p>
                </v-sheet>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Quiz Navigation -->
    <v-row class="mb-6" justify="center">
      <v-col cols="auto" class="d-flex justify-center">
        <v-btn
          v-if="quizExercise.status === 'completed'"
          color="primary"
          variant="outlined"
          class="mr-4"
          prepend-icon="mdi-refresh"
          @click="retakeQuiz"
        >
          Retake Quiz
        </v-btn>
        <v-btn
          v-if="quizExercise.status !== 'completed'"
          color="primary"
          prepend-icon="mdi-check-circle"
          :disabled="!allQuestionsAnswered"
          @click="openConfirmDialog"
        >
          Submit Answers
        </v-btn>
      </v-col>
    </v-row>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="isConfirmDialogOpen" max-width="400">
      <v-card class="pa-2">
        <v-card-title class="text-h5 pb-2">
          <v-icon color="primary" class="mr-2">mdi-help-circle</v-icon>
          Confirm Submission
        </v-card-title>
        <v-card-text class="pt-2">
          <p class="text-body-1">Are you sure you want to submit your answers? This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="isConfirmDialogOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="confirmSubmit">Confirm & Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Results Dialog -->
    <v-dialog v-model="isResultDialogOpen" max-width="500">
      <v-card class="border-card">
        <div class="card-header pa-4">
          <v-card-title class="text-h5 d-flex align-center pa-0">
            <v-icon color="primary" size="large" class="mr-3">mdi-trophy</v-icon>
            Quiz Results
          </v-card-title>
        </div>
        <v-card-text class="pa-4">
          <v-sheet rounded="lg" elevation="0" class="pa-6 text-center bg-primary-lighten-5 border-card mb-4">
            <h2 class="text-h4 font-weight-bold text-primary mb-2">
              {{ quizExercise.score }} / {{ quizExercise.max_score }}
            </h2>
            <p class="text-body-1 mb-0" v-if="quizExercise.score">
              You scored {{ quizExercise.score }} points out of {{ quizExercise.max_score }}
              ({{ Math.round((quizExercise.score / quizExercise.max_score) * 100) }}%)
            </p>
          </v-sheet>
          
          <div class="d-flex justify-space-between mb-4">
            <v-chip color="success" prepend-icon="mdi-check-circle" class="px-4 py-2">
              {{ calculateCorrectAnswers() }} Correct
            </v-chip>
            <v-chip color="error" prepend-icon="mdi-close-circle" class="px-4 py-2">
              {{ quizExercise.questions.length - calculateCorrectAnswers() }} Incorrect
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="finishQuiz" prepend-icon="mdi-eye">View Detailed Results</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { moduleService } from "@/services/module";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { 
  QuizExerciseResponse, 
  QuizAnswerRequest, 
  QuizScoreResponse, 
  QuizQuestionResponse 
} from "@/types/Exercise";
import { Breadcrumbs } from "@/types/Breadcrumbs";

// Interfaces and Types
interface RouteParams {
  quizId: string;
  moduleId: string;
}

// Reactive State
const quizExercise = ref<QuizExerciseResponse | null>(null);
const answers = ref<(string | null)[]>([]);
const multiChoiceAnswers = ref<string[][]>([]);
const isConfirmDialogOpen = ref(false);
const isResultDialogOpen = ref(false);
const quizResult = ref<QuizScoreResponse | null>(null);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;  

// Route and Breadcrumbs
const route = useRoute();
const { quizId, moduleId } = route.params as RouteParams;

const breadcrumbsStore = useBreadcrumbsStore();
const routeState = (route as any).state as { breadcrumbs?: Breadcrumbs[] } | undefined;
if (routeState?.breadcrumbs) {
  breadcrumbsStore.setBreadcrumbs(routeState.breadcrumbs);
}
const breadcrumbs = computed(() => breadcrumbsStore.breadcrumbs);

// Computed Properties
const questionCount = computed(() => {
  return quizExercise.value?.questions?.length || 0;
});

const allQuestionsAnswered = computed(() => {
  if (!quizExercise.value?.questions) return false;
  
  // Allow submission even if not all questions are answered
  return true;
});

// Methods
function calculateCorrectAnswers(): number {
  if (!quizExercise.value?.questions) return 0;
  
  return quizExercise.value.questions.filter(question => {
    if (!question.user_choice || !question.correct_answer) return false;
    
    if (question.question_type === 'multiple_choice') {
      // For multiple choice, compare arrays
      const userChoiceSet = new Set(question.user_choice);
      const correctAnswerSet = new Set(question.correct_answer);
      
      if (userChoiceSet.size !== correctAnswerSet.size) return false;
      return Array.from(userChoiceSet).every(item => correctAnswerSet.has(item));
    } else {
      // For single choice and true/false
      return question.user_choice[0] === question.correct_answer[0];
    }
  }).length;
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy": return "success";
    case "medium": return "warning";
    case "hard": return "error";
    default: return "grey";
  }
}

function isOptionSelected(question: QuizQuestionResponse, option: string): boolean {
  // Check if quiz is completed or has user choices
  if (quizExercise.value?.status === 'completed' || question.user_choice) {
    return question.user_choice ? question.user_choice.includes(option) : false;
  }
  return false;
}

function getOptionClass(question: QuizQuestionResponse, option: string): string {
  if (quizExercise.value?.status !== 'completed') {
    return '';
  }
  
  // Ensure type safety by converting arrays to strings for comparison
  const userChoices = question.user_choice || [];
  const correctAnswers = question.correct_answer || [];

  switch (question.question_type) {
    case 'single_choice':
    case 'true_false':
      const isUserChoice = userChoices.length > 0 && userChoices[0] === option;
      const isCorrectAnswer = correctAnswers.length > 0 && correctAnswers[0] === option;
      
      if (isUserChoice && isCorrectAnswer) {
        return 'correct-answer';
      } else if (isUserChoice && !isCorrectAnswer) {
        return 'incorrect-answer';
      } else if (isCorrectAnswer) {
        return 'correct-answer highlight-correct';
      }
      break;
    
    case 'multiple_choice':
      const isCorrect = correctAnswers.includes(option);
      const isUserSelected = userChoices.includes(option);
      
      if (isUserSelected && isCorrect) {
        return 'correct-answer';
      } else if (isUserSelected && !isCorrect) {
        return 'incorrect-answer';
      } else if (isCorrect) {
        return 'correct-answer highlight-correct';
      }
      break;
  }
  
  return '';
}

function handleAnswer(questionIndex: number, selectedAnswerIndex: string | null) {
  answers.value[questionIndex] = selectedAnswerIndex;
}

function handleMultiAnswer(questionIndex: number, selectedAnswers: string[]) {
  multiChoiceAnswers.value[questionIndex] = selectedAnswers;
}

function openConfirmDialog() {
  isConfirmDialogOpen.value = true;
}

async function confirmSubmit() {
  isConfirmDialogOpen.value = false;
  await submitQuizAnswers();
}

async function submitQuizAnswers() {
  if (!quizExercise.value) return;
  const processedAnswers = quizExercise.value.questions.map((question, index) => {
    switch (question.question_type) {
      case 'single_choice':
      case 'true_false':
        return answers.value[index] !== null ? String(answers.value[index]) : "";
      case 'multiple_choice':
        return multiChoiceAnswers.value[index] && multiChoiceAnswers.value[index].length > 0 
          ? multiChoiceAnswers.value[index].join(",") 
          : "";
      default:
        return "";
    }
  });

  const submitQuizAnswersRequest: QuizAnswerRequest = {
    quizId,
    answers: processedAnswers,
  };

  try {
    const result = await moduleService.submitQuizAnswers(
      { showError, showSuccess },
      quizId,
      submitQuizAnswersRequest
    );

    if (result) {
      quizResult.value = result;
      await fetchQuizDetails(); // Fetch updated quiz data with scores
      
      showSuccess("Quiz submitted successfully!");
      isResultDialogOpen.value = true;
    }
  } catch (error) {
    showError("Failed to submit quiz. Please try again.");
  }
}

async function fetchQuizDetails() {
  try {
    const response = await moduleService.fetchQuizDetails(
      { showError, showSuccess }, 
      quizId
    );
    
    if (response && "data" in response && response.data) {
      quizExercise.value = response.data as QuizExerciseResponse;
    }

    if (quizExercise.value?.questions) {
      // Reset answers arrays
      answers.value = [];
      multiChoiceAnswers.value = [];

      // Initialize answers array based on question type
      quizExercise.value.questions.forEach((question) => {
        switch (question.question_type) {
          case 'single_choice':
          case 'true_false':
            answers.value.push(
              question.user_choice && question.user_choice.length > 0 
                ? question.user_choice[0] 
                : null
            );
            multiChoiceAnswers.value.push([]);
            break;
          case 'multiple_choice':
            answers.value.push(null);
            multiChoiceAnswers.value.push(
              Array.isArray(question.user_choice) ? question.user_choice : []
            );
            break;
        }
      });
    }
  } catch (error) {
    console.error("Quiz details fetch error:", error);
    showError("Failed to load quiz details. Please try again.");
  }
}

async function retakeQuiz() {
  try {
    await moduleService.clearQuizAnswers(
      { showError, showSuccess },
      moduleId,
      quizId
    );
    showSuccess("Quiz reset successfully. You can now retake the quiz.");
    await fetchQuizDetails();
  } catch (error) {
    showError("Failed to reset quiz. Please try again.");
  }
}

async function finishQuiz() {
  isResultDialogOpen.value = false;
}

onMounted(() => {
  fetchQuizDetails();
});
</script>
<style scoped>
.border-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.border-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}

.card-header {
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.05);
}

.question-header {
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.05);
}

.primary-1 {
  background-color: var(--v-theme-primary) !important;
}

.primary-2 {
  background-color: #6200ea !important;
}

.primary-3 {
  background-color: #3949ab !important;
}

.border-left-primary {
  border-left: 4px solid var(--v-theme-primary);
}

.border-left-error {
  border-left: 4px solid var(--v-theme-error);
}

.option-radio {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.option-radio:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-color: rgba(var(--v-theme-primary), 0.1);
}

.correct-answer {
  background-color: rgba(var(--v-theme-success), 0.1) !important;
  border: 1px solid rgba(var(--v-theme-success), 0.3) !important;
}

.incorrect-answer {
  background-color: rgba(var(--v-theme-error), 0.1) !important;
  border: 1px solid rgba(var(--v-theme-error), 0.3) !important;
}

.highlight-correct {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-success), 0.4);
}

.question-card {
  transition: all 0.3s ease;
}

:deep(.v-selection-control__input) {
  opacity: 0.9;
}

:deep(.v-selection-control--disabled) {
  opacity: 1 !important;
}

:deep(.v-input__details){
  display: none;
}

.option-checkbox {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.option-checkbox:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-color: rgba(var(--v-theme-primary), 0.1);
}
</style>