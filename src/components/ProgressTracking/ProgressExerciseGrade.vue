<template>
  <div>
    <v-card 
      class="max-w-7xl mx-auto rounded-xl border border-gray-100 mb-6 transition-shadow hover:shadow-lg" 
      elevation="3"
    >
      <v-card-text class="py-6">
        <div class="flex items-center gap-2">
          <v-icon color="primary" class="mr-2">mdi-text-box-check</v-icon>
          <v-select
            :model-value="selectedExerciseId"
            @update:model-value="$emit('update:selectedExerciseId', $event)"
            :items="exercises || []"
            item-title="name"
            item-value="id"
            label="Select Exercise"
            variant="outlined"
            density="comfortable"
            class="w-full rounded-lg transition-all hover:border-primary-lighten-1"
            hide-details
          ></v-select>
        </div>
      </v-card-text>
    </v-card>

    <v-card 
      v-if="selectedExerciseId" 
      class="max-w-7xl mx-auto rounded-xl border border-gray-100 transition-shadow hover:shadow-lg" 
      elevation="3"
    >
      <v-data-table
        :headers="exerciseHeaders"
        :items="exerciseGrades?.students_list || []"
        :items-per-page="10"
        :loading="loading"
        class="elevation-0 enhanced-table"
      >
        <template v-slot:loading>
          <div class="flex items-center justify-center pa-6">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <span class="ml-4">Loading data...</span>
          </div>
        </template>

        <template v-slot:item.student_mssv="{ item }">
          <div class="flex items-center">
            <v-icon size="small" class="mr-2 text-gray-500">mdi-account-card</v-icon>
            <span class="font-medium">{{ item.student_mssv }}</span>
          </div>
        </template>

        <template v-slot:item.student_name="{ item }">
          <div class="flex flex-col">
            <span class="font-medium">{{ item.student_name }}</span>
            <span v-if="item.student_email" class="text-sm text-gray-500">{{ item.student_email }}</span>
          </div>
        </template>

        <template v-slot:item.score="{ item }">
          <div class="flex items-center gap-2">
            <div class="w-16 font-medium" :class="getScoreColorClass(item.score)">
              {{ item.score.toFixed(1) }}%
            </div>
            <v-progress-linear
              :model-value="item.score"
              :color="getScoreColor(item.score)"
              height="8"
              rounded
              class="flex-1"
            ></v-progress-linear>
          </div>
        </template>

        <template v-slot:item.date="{ item }">
          <div class="flex items-center justify-center">
            <v-icon size="small" class="mr-2 text-gray-500">mdi-calendar</v-icon>
            {{ item.date ? formatDateTime(item.date) : '-' }}
          </div>
        </template>

        <template v-slot:item.answers="{ item }">
          <div class="flex justify-center">
            <v-btn
              v-if="item.question_answers?.length"
              size="small"
              variant="tonal"
              color="primary"
              @click="showAnswers(item)"
              class="rounded-lg transition-all duration-200 hover:scale-105"
            >
              <v-icon start>mdi-text-box-search</v-icon>
              View Answers
            </v-btn>
            <span v-else>-</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="showAnswersDialog" max-width="700px">
      <v-card class="rounded-xl">
        <v-card-title class="px-6 py-4 bg-gray-50 flex items-center">
          <v-icon color="primary" class="mr-2">mdi-text-box-search</v-icon>
          <span class="text-h6">Student Answers</span>
        </v-card-title>
        <v-card-text class="px-6 py-4">
          <div v-for="(qa, index) in selectedStudentAnswers" :key="index" class="mb-6 pb-4 border-b border-gray-100 last:border-0">
            <div class="font-medium mb-3 flex items-center">
              <v-icon color="primary" size="small" class="mr-2">mdi-help-circle</v-icon>
              {{ qa.question }}
            </div>
            <div v-if="qa.answers" class="pl-6 space-y-2">
              <div v-for="(answer, aIndex) in qa.answers" :key="aIndex" class="text-gray-700 p-2 bg-gray-50 rounded-lg">
                {{ answer }}
              </div>
            </div>
            <div v-else class="pl-6 text-gray-500 italic">No answer provided</div>
          </div>
        </v-card-text>
        <v-card-actions class="px-6 py-4 bg-gray-50">
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            variant="tonal" 
            @click="showAnswersDialog = false"
            class="rounded-lg transition-all duration-200 hover:scale-105"
          >
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

defineEmits<{
  'update:selectedExerciseId': [value: string]
}>();

const showAnswersDialog = ref(false);
const selectedStudentAnswers = ref<AnswerQuizExercise[]>([]);

const exerciseHeaders = [
  { title: "Student ID", key: "student_mssv", align: "center" as const },
  { title: "Student Name", key: "student_name", align: "start" as const },
  { title: "Score", key: "score", align: "start" as const, sortable: true },
  { title: "Submission Date", key: "date", align: "center" as const, sortable: true },
  { title: "Answers", key: "answers", align: "center" as const },
];

const getScoreColor = (score: number) => {
  if (score >= 85) return "success";
  if (score >= 70) return "info";
  if (score >= 60) return "warning";
  return "error";
};

const getScoreColorClass = (score: number) => {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
};

const showAnswers = (student: { question_answers?: AnswerQuizExercise[] }) => {
  if (student.question_answers) {
    selectedStudentAnswers.value = student.question_answers;
    showAnswersDialog.value = true;
  }
};
</script>