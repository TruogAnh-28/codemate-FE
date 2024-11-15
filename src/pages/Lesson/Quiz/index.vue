<template>
  <v-container fluid class="px-12">
    <v-card flat class="pa-0 mb-4">
      <v-card-title class="font-weight-bold text-h5 pa-0">
        {{module.introduction}}
        <v-chip variant="flat" class="ma-2">
          Quiz
        </v-chip>
      </v-card-title>
      <v-card-subtitle class="pa-0">
           {{lesson.name}}
      </v-card-subtitle>
    </v-card>
    <v-row class="mb-4">
      <v-col cols="6">
        <v-card flat class="pa-0 mb-2">
          <v-card-text class="pa-0 mb-2">
            Welcome to the <span class="text-red-500">'{{module.introduction}}'</span> module!
          </v-card-text>
          <v-card-text class="pa-0 mb-2">
            This module uses interactive quizzes to help you test your knowledge. Work through each quiz at your own speed, and check your answers along the way.
          </v-card-text>
          <v-card-text class="pa-0">
            You can retake any quiz for better understanding.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col col="2"></v-col>
      <v-col cols="4" class="pl-4">
        <v-card flat class="pa-0">
          <v-card-title class="font-weight-bold pa-0 text-red-500 mb-2">
            Learning Outcomes:
          </v-card-title>
          <v-card-text class="pa-0">
            <ul class="list-disc pl-6 space-y-2">
               <li v-for="(outcome, index) in module.objectives" :key="index">
                {{ outcome }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row align="center" justify="space-between">
          <v-col cols="auto">
            <v-sheet class="text-h6 font-weight-bold mb-4">Quiz List:</v-sheet>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" @click="generateQuiz">Generate Quiz</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" v-for="exercise in exercises" :key="exercise.id">
        <v-card class="mb-4" outlined>
          <v-card-title>
            <v-row align="center" justify="space-between" class="w-full">
              <v-col cols="auto" class="d-flex align-center">
                <v-icon class="mr-2">mdi-book-open-outline</v-icon>
                {{ exercise.name }}
              </v-col>
              <!-- <v-col cols="auto" class="text-right">
                <span v-if="exercise.status === 'completed'" class="text-red-500 text-h5"> {{ exercise.score }}</span>
              </v-col> -->
            </v-row>
          </v-card-title>
          <v-card-subtitle style="opacity: 1;">
            <v-row align="center" justify="space-between" class="w-full my-0">
              <v-col cols="auto" class="d-flex align-center">
                 <v-chip color="grey">
               NQuestions: {{ exercise.quizList.length }}
                </v-chip>
                
                <v-chip class="ml-2" :color="getDifficultyColor(exercise.difficulty)">
                  {{ exercise.difficulty }}
                </v-chip>
                <v-chip class="ml-2" :color="exercise.status === 'completed' ? 'green' : (exercise.status === 'on going' ? 'orange' : 'red')">
                  {{ exercise.status }}
                </v-chip>
              </v-col>
              <v-col cols="auto" class="text-right">
                <span v-if="exercise.status === 'completed'" class="text-white bg-red rounded-full px-2 py-1 text-h5"> 
                  {{ exercise.score }}
                </span>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="doQuiz(exercise.id)">Do Quiz</v-btn>
            <v-btn v-if="exercise.status === 'completed' || exercise.status === 'on going'" color="secondary" @click="viewAgain(exercise.id)">View Again</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { quizExercisesData } from "@/constants/exercise";
import { QuizExercise } from "@/types/Exercise";
import { LessonData,ModulesData } from "@/constants/lesson";
import { Lesson, Module } from "@/types/Lesson";
const exercises = ref<QuizExercise[]>(quizExercisesData);
const lesson = ref<Lesson[]>(LessonData);
const router = useRouter();
const route = useRoute();
const lessonId = route.params.lessonId as string;
const moduleId = route.params.moduleId as string;
const module = ref<Module>(ModulesData.find(m => m.id === moduleId));
function doQuiz(exerciseId: string) {
  const path = `/lessonRecommend/${lessonId}/module/${moduleId}/Quiz/DoQuiz/${exerciseId}`;
  router.push(path);
}

function viewAgain(exerciseId: string) {
  // Logic to navigate to the quiz page for viewing again
  // router.push(`/lessonRecommend/${exerciseId}/view`);

}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'green';
    case 'medium':
      return 'orange';
    case 'hard':
      return 'red';
    default:
      return 'grey';
  }
}
function generateQuiz() {
  // Logic to generate a new quiz
  console.log('Generating a new quiz...');
}
</script>