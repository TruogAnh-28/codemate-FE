<template>
  <div class="relative flex items-center">
    <div class="flex -space-x-2">
      <!-- Loop through the students to display their avatars -->
      <template v-for="(student, index) in visibleStudents" :key="student.student_id">
        <div
          class="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
          :style="{ zIndex: students.length - index }"
        >
          <!-- Display image or initials depending on the validity of the avatar -->
          <v-img
            :src="getAvatarStudentUrl(student.student_avatar)"
            :alt="student.student_name"
            class="w-full h-full"
          >
            <!-- Display initials when the image fails to load -->
            <template v-slot:error>
              <div class="w-full h-full rounded-full flex items-center justify-center bg-primary text-text-secondary text-body-small-1 font-medium">
                {{ getInitials(student.student_name) }}
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
import { StudentOfCourseListModal } from '@/types/Course';
import { getAvatarStudentUrl } from '@/utils/functions/functions';
const props = defineProps<{
  students: StudentOfCourseListModal[];
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

<style scoped>

</style>
