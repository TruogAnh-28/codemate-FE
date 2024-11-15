<template>
  <div class="relative flex items-center">
    <div class="flex -space-x-2">
      <!-- Loop through the students to display their avatars -->
      <template v-for="(student, index) in visibleStudents" :key="student.studentId">
        <div
          class="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
          :style="{ zIndex: students.length - index }"
        >
          <v-img
            :src="student.avatar"
            :alt="student.name"
            class="w-full h-full"
          >
            <template v-slot:error>
              <div class="w-full h-full rounded-full flex items-center justify-center bg-primary text-text-secondary text-body-small-1 font-medium">
                {{ getInitials(student.name) }}
              </div>
            </template>
          </v-img>
        </div>
      </template>
    </div>

    <!-- Display remaining students count -->
    <div
      v-if="remainingCount > 0"
      class="relative -ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-body-small-1 font-medium text-text-tetiary"
    >
      +{{ remainingCount }}
    </div>
  </div>
</template>

<script lang="ts" setup>

import { StudentReview } from '@/types/Course';
const props = defineProps<{
  students: StudentReview[];
  maxVisible: number;
}>();

const visibleStudents = computed(() => {
  return props.students.slice(0, props.maxVisible);
});

const remainingCount = computed(() => {
  return Math.max(0, props.students.length - props.maxVisible);
});

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

</script>
