<template>
  <div>
    <v-card 
      class="max-w-7xl mx-auto rounded-xl border border-gray-100 mb-6 transition-shadow hover:shadow-lg" 
      elevation="3"
    >
      <v-card-text>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <v-card class="bg-blue-50 transition-all hover:shadow-md" variant="flat">
            <v-card-text>
              <div class="flex items-center mb-2">
                <v-icon color="blue" class="mr-2">mdi-account-group</v-icon>
                <div class="text-lg font-semibold">Student Count</div>
              </div>
              <div class="text-3xl font-bold text-blue-600">
                {{ courseGrades?.students_list?.length || 0 }}
              </div>
            </v-card-text>
          </v-card>
          <v-card class="bg-green-50 transition-all hover:shadow-md" variant="flat">
            <v-card-text>
              <div class="flex items-center mb-2">
                <v-icon color="green" class="mr-2">mdi-chart-line</v-icon>
                <div class="text-lg font-semibold">Average Progress</div>
              </div>
              <div class="text-3xl font-bold text-green-600">
                {{ averageProgress.toFixed(1) }}%
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
          <div class="font-medium">{{ item.student_name }}</div>
        </template>
        
        <template v-slot:item.student_email="{ item }">
          <div class="text-sm text-gray-500">{{ item.student_email || '-' }}</div>
        </template>
        
        <template v-slot:item.goal="{ item }">
          <div class="text-sm">
            {{ item.learning_path?.objective || 'No goal defined' }}
          </div>
        </template>

        <template v-slot:item.progress="{ item }">
          <div class="flex items-center gap-2">
            <v-progress-linear
              :model-value="item.learning_path?.progress || 0"
              :color="getProgressColor(item.learning_path?.progress || 0)"
              height="10"
              rounded
              class="flex-grow"
            ></v-progress-linear>
            <span class="text-sm font-medium">{{ (item.learning_path?.progress || 0).toFixed(1) }}%</span>
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
import { computed } from 'vue';
import type { GetCourseGradesResponse } from "@/types/ProgressTracking";

const props = defineProps<{
  courseId: string;
  courseGrades: GetCourseGradesResponse | null;
  loading: boolean;
}>();

const courseId = props.courseId;
const courseHeaders = [
  { title: "Student ID", key: "student_mssv", align: "center" as const },
  { title: "Student Name", key: "student_name", align: "start" as const },
  { title: "Email", key: "student_email", align: "start" as const },
  { title: "Goal", key: "goal", align: "start" as const },
  { title: "Progress", key: "progress", align: "start" as const, sortable: true },
  { title: "View Details", key: "learning_path", align: "center" as const },
];

const averageProgress = computed(() => {
  if (!props.courseGrades?.students_list?.length) return 0;
  const studentWithPaths = props.courseGrades.students_list.filter(student => student.learning_path);
  if (studentWithPaths.length === 0) return 0;
  
  const sum = studentWithPaths.reduce((acc, student) => acc + (student.learning_path?.progress || 0), 0);
  return sum / studentWithPaths.length;
});

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "success";
  if (progress >= 50) return "info";
  if (progress >= 25) return "warning";
  return "error";
};
</script>