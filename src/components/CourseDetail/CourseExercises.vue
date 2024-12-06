<template>
  <div class="space-y-6">
    <v-container>
      <v-row
        v-for="(exercise, index) in getAllExercises(course)"
        :key="index"
        align="center"
      >
        <v-col cols="12">
          <v-card class="rounded-lg shadow-md p-4">
            <v-row align="center" class="m-0">
              <v-col cols="7">
                <div class="font-semibold text-heading-4 text-secondary mb-2">
                  {{ exercise.lessonTitle }}
                </div>
                <div class="font-semibold text-body-large-1 mb-2">
                  {{ exercise.name }}
                </div>
                <div class="text-body-base-1 text-text-tetiary">
                  {{ exercise.description }}
                </div>
              </v-col>
              <v-col cols="3" class="text-center">
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
                  {{ renderLabelButtonBasedOnStatus(exercise.status) }}
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
import {
  CourseDetailResponse,
  ExerciseOriginalResponse,
  LessonOriginalResponse,
} from "@/types/Course";
import { renderStatusLabel } from "@/utils/functions/render";

interface ExtendedExercise extends ExerciseOriginalResponse {
  lessonTitle: string;
}

defineProps<{
  course: CourseDetailResponse;
}>();

const exercises = ref<ExtendedExercise[]>([]);
function renderLabelButtonBasedOnStatus(status: string) {
  if (status === "Completed") {
    return "Review";
  } else if (status === "New") {
    return "Start";
  } else {
    return "Continue";
  }
}

function getAllExercises(course: CourseDetailResponse) {
  exercises.value = course.lessons.flatMap((lesson: LessonOriginalResponse) =>
    lesson.exercises.map((exercise) => ({
      ...exercise,
      lessonTitle: lesson.title,
    }))
  );
  return exercises.value;
}

const startExercise = (exercise: ExtendedExercise) => {
  console.log(`Starting ${exercise.name}`);
};
</script>

<style scoped>
.v-row.m-0 {
  margin: 0 !important;
}
</style>
