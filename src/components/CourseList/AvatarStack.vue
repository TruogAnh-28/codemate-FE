<template>
  <div class="relative flex items-center">
    <div class="flex -space-x-2">
      <template
        v-for="(student, index) in visibleStudents"
        :key="student.student_id"
      >
        <div
          class="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
          :style="{ zIndex: (students?.length ?? 0) - index }"
        >
          <v-img
            :src="getAvatarStudentUrl(student.student_avatar)"
            :alt="student.student_name"
            class="w-full h-full"
          >
            <template v-slot:error>
              <div
                class="w-full h-full rounded-full flex items-center justify-center bg-primary text-text-secondary text-body-small-1 font-medium"
              >
                {{ getInitials(student.student_name) }}
              </div>
            </template>
          </v-img>
        </div>
      </template>
    </div>

    <div
      v-if="remainingCount > 0"
      class="relative -ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-body-small-1 font-medium text-text-tetiary"
    >
      +{{ remainingCount }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { coursesService } from "@/services/courseslistServices";
import { CoursesListResponse, StudentOfCourseListModal } from "@/types/Course";
import { getAvatarStudentUrl } from "@/utils/functions/functions";
const props = defineProps<{
  courses: CoursesListResponse;
  maxVisible: number;
}>();

const students = ref<StudentOfCourseListModal[]>();
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const fetchStudents = async () => {
  const response = await coursesService.getStudentsForCourse(
    { showError, showSuccess },
    props.courses.id
  );
  if (response && "data" in response && response.data) {
    students.value = response.data as StudentOfCourseListModal[];
  }
};

const visibleStudents = computed(() => {
  return (students.value ?? []).slice(0, props.maxVisible);
});

const remainingCount = computed(() => {
  return Math.max(0, (students.value?.length ?? 0) - props.maxVisible);
});

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

onMounted(() => {
  fetchStudents();
});
</script>

<style scoped></style>
