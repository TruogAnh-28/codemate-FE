<template class="tailwind-scope">
  <v-container fluid class="px-12">
    <v-breadcrumbs class="ma-0 pa-0"
      :items="breadcrumbs"
      divider="/"
    ></v-breadcrumbs>
    <v-card flat class="pa-0 mb-4">
      <v-sheet class="font-weight-bold text-heading-3 pa-0">
        {{ moduleQuizzes.title }}
        <v-chip variant="flat" class="ma-2">
          Quiz
        </v-chip>
      </v-sheet>
      <!-- <v-card-subtitle class="text-body-base-1 pa-0">
        {{ lesson.name }}
      </v-card-subtitle> -->
    </v-card>
    <v-row class="mb-4">
      <v-col cols="6" class="py-6">
        <v-card flat class="pa-0 mb-2">
          <v-card-text class="pa-0 mb-2 text-body-base-4">
            Welcome to the <span class="text-error">'{{ moduleQuizzes.title }}'</span> module!
          </v-card-text>
          <v-card-text class="pa-0 mb-2 text-body-base-4">
            This module uses interactive quizzes to help you test your knowledge. Work through each quiz at your own speed, and check your answers along the way.
          </v-card-text>
          <v-card-text class="pa-0 text-body-base-4">
            You can retake any quiz for better understanding.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col col="2"></v-col>
      <v-col cols="4" class="pl-4">
        <v-card flat class="pa-0">
          <v-card-title class="font-weight-bold text-heading-4 text-error">
            Learning Outcomes:
          </v-card-title>
          <v-card-text class="pa-0 text-body-base-4">
            <ul class="list-disc pl-6">
              <li v-for="(outcome, index) in moduleQuizzes.objectives" :key="index">
                {{ outcome }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="rounded-lg overflow-hidden" elevation="2">
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-body-large-1 font-semibold text-gray-800 pl-4">Quiz List</h3>
          <v-col cols="auto">
            <v-btn color="primary" @click="generateQuiz">Add Quiz</v-btn>
          </v-col>
        </div>
        <v-col cols="12" v-for="quiz in moduleQuizzes.quizzes" :key="quiz.id">
          <v-card outlined class="py-0">
            <v-card-title class="text-body-large-4">
              <v-row align="center" justify="space-between" class="w-full">
                <v-col cols="auto" class="d-flex align-center">
                  <v-icon class="mr-2">mdi-book-open-outline</v-icon>
                  {{ quiz.name }}
                </v-col>
                <v-col cols="auto" class="text-right">
                  <span v-if="quiz.status === 'completed'" class="text-red px-2 py-2 text-body-large-4">
                    {{ quiz.score }} điểm
                  </span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-subtitle style="opacity: 1;">
              <v-row align="center" justify="space-between" class="w-full my-0">
                <v-col cols="auto" class="d-flex align-center">
                  <v-chip :color="getDifficultyColor(quiz.difficulty)">
                    {{ quiz.difficulty }}
                  </v-chip>
                  <v-chip class="ml-2" :color="quiz.status === 'completed' ? 'green' : (quiz.status === 'on going' ? 'orange' : 'red')">
                    {{ quiz.status }}
                  </v-chip>
                </v-col>
                <v-card-actions>
                  <v-btn
                    elevation="2"
                    v-if="quiz.status === 'completed' || quiz.status === 'on going'"
                    color="secondary"
                    @click="viewAgain(quiz.id)"
                    class="px-2 text-body-base-4"
                  >
                    View Again
                  </v-btn>
                  <v-btn
                    elevation="2"
                    color="primary"
                    @click="doQuiz(quiz.id, quiz.status)"
                    class="px-2 text-body-base-4"
                  >
                    Start
                  </v-btn>
                </v-card-actions>
              </v-row>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </div>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
import { moduleService } from "@/services/module";
import { ModuleQuizResponse,ClearAnswerResponse } from "@/types/Exercise";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { Breadcrumbs } from "@/types/Breadcrumbs";

interface RouteParams {
  moduleId: string,
  lessonId: string
}

const moduleQuizzes = ref<ModuleQuizResponse>({
  module_id: "",
  title: "",
  objectives: [],
  quizzes: []
});

const clearSuccess = ref<ClearAnswerResponse | null>(null);
const router = useRouter();
const route = useRoute();
const {  moduleId, lessonId } = route.params as RouteParams;
const breadcrumbsStore = useBreadcrumbsStore();
const routeState = computed(() => {
  const state = (route as any & { state?: { breadcrumbs?: Breadcrumbs[] } }).state;
  return state?.breadcrumbs ? { breadcrumbs: state.breadcrumbs } : {};
});

if (routeState.value.breadcrumbs) {
  breadcrumbsStore.setBreadcrumbs(routeState.value.breadcrumbs);
}

const breadcrumbs = computed(() => breadcrumbsStore.breadcrumbs);


async function doQuiz(quizId: string, status: string): Promise<void> {
  const path = `/lessonRecommend/${lessonId}/module/${moduleId}/Quiz/${quizId}`;
  if (status === "completed") {
    await clearQuizAnswers(quizId);
  }
  router.push(path);
}

function viewAgain(quizId: string) {
  const path = `/lessonRecommend/${lessonId}/module/${moduleId}/Quiz/${quizId}`;
  router.push(path);
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "green";
    case "medium":
      return "orange";
    case "hard":
      return "red";
    default:
      return "grey";
  }
}

const showError = inject("showError") as (message: string) => void;


const fetchModuleQuizzes = async () => {
  moduleQuizzes.value = await moduleService.fetchModuleQuizzes(showError, moduleId) ||{
    module_id: "",
    title: "",
    objectives: [],
    quizzes: []
  };
};
const clearQuizAnswers = async (quizId:string) => {
  clearSuccess.value = await moduleService.clearQuizAnswers(showError, moduleId, quizId) || "";
};
onMounted(() => {
  fetchModuleQuizzes();
});

function generateQuiz() {
  console.log("Generating a new quiz...");
}
</script>
