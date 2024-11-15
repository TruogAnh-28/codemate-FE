<template>
  <div class="space-y-6">
    <!-- Exercise List -->
    <v-container>
      <v-row v-for="(exercise, index) in exercises" :key="index" align="center">
        <!-- Exercise Item -->
        <v-col cols="12">
          <v-card class="rounded-lg shadow-md p-4">
            <v-row align="center" class="m-0">
              <v-col cols="7">
                <div class="font-semibold text-body-large-1 mb-2">
                  {{ exercise.name }}
                </div>
                <div class="text-body-base-1 text-text-tetiary">
                  {{ exercise.description }}
                </div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="text-body-base-3 font-medium">
                  Questions:
                  <span class="font-bold">{{ exercise.questions.length }}</span>
                </div>
                <v-chip
                  :color="renderStatusLabel(exercise.status)"
                  outlined
                  small
                  class="text-body-small-1"
                >
                  <v-icon left size="18" class="mr-2">mdi-check-circle</v-icon>
                  {{ exercise.status }}
                </v-chip>
              </v-col>
              <v-col cols="2" class="text-center text-body-large-4">
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
import { Exercise } from "@/types/Course";
import { renderStatusLabel } from "@/utils/functions/render";

defineProps<{
  exercises: Exercise[];
}>();
const startExercise = (exercise: Exercise) => {
  console.log(
    `Starting ${exercise.name} with ${exercise.questions.length} questions.`
  );
};
</script>

<style scoped>
.v-row.m-0 {
  margin: 0 !important;
}
</style>
