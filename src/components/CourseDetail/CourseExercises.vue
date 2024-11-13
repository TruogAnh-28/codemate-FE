<template>
  <div class="space-y-6">
    <!-- Exercise List -->
    <v-container>
      <v-row v-for="(exercise, index) in exercises" :key="index" align="start">
        <!-- Exercise Item -->
        <v-col cols="12" md="6">
          <v-card class="rounded-lg shadow-md p-4">
            <v-row>
              <!-- Exercise Name and Description -->
              <v-col cols="12">
                <div class="font-semibold text-xl mb-2">{{ exercise.name }}</div>
                <div class="text-sm text-gray-600">{{ exercise.description }}</div>
              </v-col>

              <!-- Number of Questions -->
              <v-col cols="12" class="mt-3">
                <div class="text-lg font-medium">
                  Questions: <span class="font-bold">{{ exercise.questions.length }}</span>
                </div>
              </v-col>

              <!-- Start Button -->
              <v-col cols="12" class="mt-4">
                <v-btn color="primary" @click="startExercise(exercise)">
                  Start
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { Exercise } from '@/types/Course';

const props = defineProps<{
  exercises: Exercise[];
}>();
const startExercise = (exercise: Exercise) => {
  console.log(`Starting ${exercise.name} with ${exercise.questions.length} questions.`);
};
</script>

<style scoped>
/* Custom styles for the exercise list */
.v-card {
  background-color: #f9fafb;
}
.v-btn {
  width: 100%;
}
</style>
