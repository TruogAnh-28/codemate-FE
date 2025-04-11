<template>
  <div>
    <v-card 
      class="max-w-7xl mx-auto rounded-xl border border-gray-100 mb-6 transition-shadow hover:shadow-lg" 
      elevation="3"
    >
      <v-card-text>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <v-card class="bg-blue-50 transition-all hover:shadow-md" variant="flat">
            <v-card-text>
              <div class="flex items-center mb-2">
                <v-icon color="blue" class="mr-2">mdi-calculator-variant</v-icon>
                <div class="text-lg font-semibold">Average Class Score</div>
              </div>
              <div class="text-3xl font-bold text-blue-600">
                {{ averageClassScore.toFixed(1) }}
              </div>
            </v-card-text>
          </v-card>
          <v-card class="bg-green-50 transition-all hover:shadow-md" variant="flat">
            <v-card-text>
              <div class="flex items-center mb-2">
                <v-icon color="green" class="mr-2">mdi-arrow-up-bold</v-icon>
                <div class="text-lg font-semibold">Highest Score</div>
              </div>
              <div class="text-3xl font-bold text-green-600">
                {{ highestScore.toFixed(1) }}
              </div>
            </v-card-text>
          </v-card>
          <v-card class="bg-orange-50 transition-all hover:shadow-md" variant="flat">
            <v-card-text>
              <div class="flex items-center mb-2">
                <v-icon color="orange" class="mr-2">mdi-arrow-down-bold</v-icon>
                <div class="text-lg font-semibold">Lowest Score</div>
              </div>
              <div class="text-3xl font-bold text-orange-600">
                {{ lowestScore.toFixed(1) }}
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>

    <v-card 
      class="max-w-7xl mx-auto rounded-xl border border-gray-100 transition-shadow hover:shadow-lg" 
      elevation="3"
    >
      <v-data-table
        :headers="courseHeaders"
        :items="courseGrades?.students_list || []"
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
        <template v-slot:item.exercises="{ item }">
          <div v-if="item.exercises?.length" class="space-y-2">
            <div 
              v-for="exercise in expandedStudents[item.student_id] 
                ? item.exercises 
                : item.exercises.slice(0, 5)" 
              :key="exercise.exercise_id" 
              class="flex items-center gap-2"
            >
              <span class="text-sm">{{ exercise.exercise_name }}:</span>
              <span class="text-sm font-medium">{{ exercise.score.toFixed(1) }}</span>
            </div>
            
            <div v-if="item.exercises.length > 5" class="flex justify-center mt-2">
              <v-btn
                variant="text"
                density="compact"
                size="small"
                @click="toggleExpand(item.student_id)"
                class="text-primary transition-all duration-200 hover:bg-gray-100"
              >
                <v-icon start>
                  {{ expandedStudents[item.student_id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
                {{ expandedStudents[item.student_id] ? 'Show Less' : `Show ${item.exercises.length - 5} More` }}
              </v-btn>
            </div>
          </div>
          <span v-else>-</span>
        </template>

        <template v-slot:item.average_score="{ item }">
          <div class="flex items-center gap-2 font-bold">
            <div class="flex items-center">
              <v-icon 
                :color="getScoreColor(item.average_score)" 
                class="mr-2"
              >
                mdi-circle-medium
              </v-icon>
              <span>{{ item.average_score.toFixed(1) }}</span>
            </div>
          </div>
        </template>

        <template v-slot:item.learning_path="{ item }">
          <div class="flex justify-center">
            <v-btn
              icon
              density="comfortable"
              color="primary"
              variant="text"
              class="transition-all duration-200 hover:bg-gray-100"
              :to="`/professor-progress/${courseId}/students/${item.student_id}`"
            >
              <v-icon>mdi-view-module</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { GetCourseGradesResponse } from "@/types/ProgressTracking";

const props = defineProps<{
  courseId: string;
  courseGrades: GetCourseGradesResponse | null;
  loading: boolean;
}>();

const expandedStudents = ref<{ [key: string]: boolean }>({});
const courseId = props.courseId;
const courseHeaders = [
  { title: "Student ID", key: "student_mssv", align: "center" as const },
  { title: "Student Name", key: "student_name", align: "start" as const },
  { title: "Exercises", key: "exercises", align: "start" as const },
  { title: "Average Score", key: "average_score", align: "center" as const, sortable: true },
  { title: "Learning Path Progress", key: "learning_path", align: "center" as const },
];

const averageClassScore = computed(() => {
  if (!props.courseGrades?.students_list?.length) return 0;
  const sum = props.courseGrades.students_list.reduce((acc, student) => acc + student.average_score, 0);
  return sum / props.courseGrades.students_list.length;
});

const highestScore = computed(() => {
  if (!props.courseGrades?.students_list?.length) return 0;
  return Math.max(...props.courseGrades.students_list.map(student => student.average_score));
});

const lowestScore = computed(() => {
  if (!props.courseGrades?.students_list?.length) return 0;
  return Math.min(...props.courseGrades.students_list.map(student => student.average_score));
});

const getScoreColor = (score: number) => {
  if (score >= 85) return "success";
  if (score >= 70) return "info";
  if (score >= 60) return "warning";
  return "error";
};

const toggleExpand = (studentId: string) => {
  expandedStudents.value[studentId] = !expandedStudents.value[studentId];
};
</script>