<template>
    <div>
      <v-card class="max-w-7xl mx-auto rounded-xl border border-gray-100 mb-6" elevation="3">
        <v-card-text>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <v-card class="bg-blue-50" variant="flat">
              <v-card-text>
                <div class="text-lg font-semibold mb-2">Average Class Score</div>
                <div class="text-3xl font-bold text-blue-600">
                  {{ averageClassScore.toFixed(1) }}
                </div>
              </v-card-text>
            </v-card>
            <v-card class="bg-green-50" variant="flat">
              <v-card-text>
                <div class="text-lg font-semibold mb-2">Highest Score</div>
                <div class="text-3xl font-bold text-green-600">
                  {{ highestScore.toFixed(1) }}
                </div>
              </v-card-text>
            </v-card>
            <v-card class="bg-orange-50" variant="flat">
              <v-card-text>
                <div class="text-lg font-semibold mb-2">Lowest Score</div>
                <div class="text-3xl font-bold text-orange-600">
                  {{ lowestScore.toFixed(1) }}
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
  
      <v-card class="max-w-7xl mx-auto rounded-xl border border-gray-100 " elevation="3">
        <v-data-table
          :headers="courseHeaders"
          :items="courseGrades?.students_list || []"
          :items-per-page="10"
          :loading="loading"
        >
          <template v-slot:item.exercises="{ item }">
            <div v-if="item.exercises?.length" class="space-y-2">
              <div 
                v-for="exercise in expandedStudents[item.student_id] 
                  ? item.exercises 
                  : item.exercises.slice(0, 5)" 
                :key="exercise.exercise_id" 
                class="flex items-center"
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
                  class="text-primary"
                >
                  <v-icon>
                    {{ expandedStudents[item.student_id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                  {{ expandedStudents[item.student_id] ? 'Show Less' : `Show ${item.exercises.length - 5} More` }}
                </v-btn>
              </div>
            </div>
            <span v-else>-</span>
          </template>
  
          <template v-slot:item.average_score="{ item }">
            <div class="flex items-center gap-2 font-bold text-xl justify-center mx-auto">
              <div class="w-16">{{ item.average_score.toFixed(1) }}</div>
            </div>
          </template>
  
          <template v-slot:item.learning_path>
            <v-icon icon="mdi-view-module" size="x-large"></v-icon>
          </template>
        </v-data-table>
      </v-card>
    </div>
</template>
  
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { GetCourseGradesResponse } from "@/types/ProgressTracking";
  
  const props = defineProps<{
    courseGrades: GetCourseGradesResponse | null;
    loading: boolean;
  }>();
  
  const expandedStudents = ref<{ [key: string]: boolean }>({});
  
  const courseHeaders = [
    { title: "Student Name", key: "student_name", align: "start" as const },
    { title: "Exercises", key: "exercises", align: "start" as const },
    { title: "Average Score", key: "average_score", align: "center" as const },
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
  
  const toggleExpand = (studentId: string) => {
    expandedStudents.value[studentId] = !expandedStudents.value[studentId];
  };
</script>