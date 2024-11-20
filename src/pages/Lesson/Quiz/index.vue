<template class="tailwind-scope">
  <v-container fluid class="px-12">
    <v-card flat class="pa-0 mb-4">
      <v-sheet class="font-weight-bold text-heading-3 pa-0">
        {{module.introduction}}
        <v-chip variant="flat" class="ma-2">
          Quiz
        </v-chip>
      </v-sheet>
      <v-card-subtitle class="text-body-base-1 pa-0">
           {{lesson.name}}
      </v-card-subtitle>
    </v-card>
    <v-row class="mb-4">
      <v-col cols="6" class="py-6">
        <v-card flat class="pa-0 mb-2">
          <v-card-text class="pa-0 mb-2 text-body-base-4">
            Welcome to the <span class="text-error">'{{module.introduction}}'</span> module!
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
            <ul class="list-disc pl-6 ">
               <li v-for="(outcome, index) in module.objectives" :key="index">
                {{ outcome }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
     <v-card class="rounded-lg overflow-hidden" elevation="2">
      <div >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-body-large-1 font-semibold text-gray-800 pl-4">Quiz List</h3>
          <v-col cols="auto">
            <v-btn color="primary" @click="generateQuiz">Generate Quiz</v-btn>
          </v-col>
        </div>
        <v-col cols="12" v-for="exercise in exercises" :key="exercise.id">
        <v-card outlined class="py-0">
          <v-card-title class="text-body-large-4">
            <v-row align="center" justify="space-between" class="w-full">
              <v-col cols="auto" class="d-flex align-center">
                <v-icon class="mr-2">mdi-book-open-outline</v-icon>
                {{ exercise.name }}
              </v-col>
              <v-col cols="auto" class="text-right">
                <span v-if="exercise.status === 'completed'" class="text-white bg-red rounded-full px-2 py-2 text-body-large-4"> 
                  {{ exercise.score }}
                </span>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-subtitle style="opacity: 1;">
            <v-row align="center" justify="space-between" class="w-full my-0">
              <v-col cols="auto" class="d-flex align-center">
                 <v-chip color="grey">
               Questions: {{ exercise.quizList.length }}
                </v-chip>
                
                <v-chip class="ml-2" :color="getDifficultyColor(exercise.difficulty)">
                  {{ exercise.difficulty }}
                </v-chip>
                <v-chip class="ml-2" :color="exercise.status === 'completed' ? 'green' : (exercise.status === 'on going' ? 'orange' : 'red')">
                  {{ exercise.status }}
                </v-chip>
              </v-col>
                <v-card-actions>
            <v-btn elevation="2" v-if="exercise.status === 'completed' || exercise.status === 'on going'" color="secondary" @click="viewAgain(exercise.id)" class="px-2 text-body-base-4">View Again</v-btn>
            <v-btn elevation="2" color="primary" @click="doQuiz(exercise.id)" class="px-2 text-body-base-4">Start</v-btn>
           
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
  console.log('Generating a new quiz...');
}
</script>