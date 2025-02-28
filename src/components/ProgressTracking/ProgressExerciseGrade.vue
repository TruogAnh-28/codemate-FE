<template>
    <div>
      <v-card class="max-w-7xl mx-auto rounded-xl border border-gray-100 mb-6" elevation="3">
        <v-card-text>
          <v-select
            :model-value="selectedExerciseId"
            @update:model-value="$emit('update:selectedExerciseId', $event)"
            :items="exercises || []"
            item-title="name"
            item-value="id"
            label="Select Exercise"
            variant="outlined"
            density="comfortable"
            class="w-full rounded-lg"
            hide-details
          ></v-select>
        </v-card-text>
      </v-card>
  
      <v-card v-if="selectedExerciseId" class="max-w-7xl mx-auto rounded-xl border border-gray-100" elevation="3">
        <v-data-table
          :headers="exerciseHeaders"
          :items="exerciseGrades?.students_list || []"
          :items-per-page="10"
          :loading="loading"
        >
          <template v-slot:item.score="{ item }">
            <div class="flex items-center gap-2">
              <div class="w-16">{{ item.score.toFixed(1) }}%</div>
              <v-progress-linear
                :model-value="item.score"
                color="primary"
                height="8"
                rounded
              ></v-progress-linear>
            </div>
          </template>
  
          <template v-slot:item.date="{ item }">
            {{ item.date ? formatDateTime(item.date) : '-' }}
          </template>
  
          <template v-slot:item.answers="{ item }">
            <v-btn
              v-if="item.question_answers?.length"
              size="small"
              variant="outlined"
              @click="showAnswers(item)"
            >
              View Answers
            </v-btn>
            <span v-else>-</span>
          </template>
        </v-data-table>
      </v-card>
  
      <v-dialog v-model="showAnswersDialog" max-width="600px">
        <v-card>
          <v-card-title class="text-h6 px-6 py-4">
            Student Answers
          </v-card-title>
          <v-card-text class="px-6">
            <div v-for="(qa, index) in selectedStudentAnswers" :key="index" class="mb-4">
              <div class="font-medium mb-2">{{ qa.question }}</div>
              <div v-if="qa.answers" class="pl-4">
                <div v-for="(answer, aIndex) in qa.answers" :key="aIndex" class="text-gray-600">
                  {{ answer }}
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="px-6 py-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="showAnswersDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import type {
    GetExerciseGradesResponse,
    AnswerQuizExercise
  } from "@/types/ProgressTracking";
  import { formatDateTime } from "@/utils/functions/time";
  import { GetExercisesList } from "@/types/Exercise";
  defineProps<{
    exercises: GetExercisesList[] | undefined;
    exerciseGrades: GetExerciseGradesResponse | null;
    selectedExerciseId: string;
    loading: boolean;
  }>();
  
  const showAnswersDialog = ref(false);
  const selectedStudentAnswers = ref<AnswerQuizExercise[]>([]);
  
  const exerciseHeaders = [
    { title: "Student ID", key: "student_mssv", align: "center" as const },
    { title: "Student Name", key: "student_name", align: "start" as const },
    { title: "Score", key: "score", align: "start" as const },
    { title: "Submission Date", key: "date", align: "center" as const },
    { title: "Answers", key: "answers", align: "center" as const },
  ];
  
  const showAnswers = (student: { question_answers?: AnswerQuizExercise[] }) => {
    if (student.question_answers) {
      selectedStudentAnswers.value = student.question_answers;
      showAnswersDialog.value = true;
    }
  };
</script>