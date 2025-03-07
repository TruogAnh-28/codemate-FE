<template>
  <v-card class="mt-4">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-account-group</v-icon>
      Students List
    </v-card-title>
    <v-card-text>
      <v-list v-if="students && students.length > 0">
        <v-list-item
          v-for="student in paginatedStudents"
          :key="student.student_id"
          class="px-2"
        >
          <v-list-item-content>
            <div class="d-flex align-center justify-space-between">
              <span class="font-weight-medium text-body-2">{{ student.student_name }}</span>
              <span class="ml-2 text-body-large-3 text-caption text-grey ">ID: {{ student.student_id }}</span>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
      <div v-if="!students || students.length === 0" class="text-center py-4 text-body-2 text-grey">
        No students enrolled in this course
      </div>
      
      <div v-if="totalPages > 1" class="d-flex justify-center align-center mt-4">
        <v-btn
          icon
          variant="text"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        
        <span class="mx-4 text-caption">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        
        <v-btn
          icon
          variant="text"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { StudentOfCourseListModal } from "@/types/Course";
import { ref, computed } from 'vue';

const props = defineProps<{
  students: StudentOfCourseListModal[] | undefined;
}>();

const currentPage = ref(1);
const studentsPerPage = 5;

const totalPages = computed(() => {
  if (!props.students || props.students.length === 0) return 0;
  return Math.ceil(props.students.length / studentsPerPage);
});

const paginatedStudents = computed(() => {
  if (!props.students) return [];
  
  const startIndex = (currentPage.value - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  
  return props.students.slice(startIndex, endIndex);
});

// Reset to first page when students list changes
watch(() => props.students, () => {
  currentPage.value = 1;
});
</script>