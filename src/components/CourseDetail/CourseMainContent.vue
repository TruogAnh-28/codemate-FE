<template>
  <v-card class="p-6">
    <CourseBanner
      v-if="course"
      :course="course"
    />

    <v-tabs
      :model-value="activeTab"
      @update:model-value="handleTabUpdate"
      bg-color="background"
      grow
      dark
    >
      <v-tooltip v-for="tab in tabs" :key="tab.value" top>
        <template v-slot:activator="{ props: activatorProps }">
          <v-tab
            v-bind="activatorProps"
            :value="tab.value"
            class="text-secondary font-bold"
          >
            {{ tab.label }}
          </v-tab>
        </template>
        <span>{{ tab.tooltip }}</span>
      </v-tooltip>
    </v-tabs>

    <v-window
      :model-value="activeTab"
      @update:model-value="handleTabUpdate"
    >
      <v-window-item value="description">
        <CourseDescription
          :learning-outcomes="course?.course_learning_outcomes ?? []"
        />
      </v-window-item>

      <v-window-item value="lessons">
        <CourseLessons v-if="course" :course="course" />
      </v-window-item>

      <v-window-item value="exercises">
        <CourseExercises v-if="isStudent && isCourseDetailResponse(course)" :course="course" />
        <CourseExercisesProfessor v-else-if="isProfessor && !isCourseDetailResponse(course) && course" :course="course" />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import { CourseDetailResponse, GetCourseDetailProfessorResponse } from "@/types/Course";
import { useAuthStore } from "@/stores/auth";
export interface Tab {
  label: string;
  value: string;
  tooltip: string;
}

defineProps<{
  course: CourseDetailResponse | GetCourseDetailProfessorResponse | null;
  activeTab: string;
  tabs: Tab[];
}>();
const role = computed(() => useAuthStore().getUser().role);
const isStudent = computed(() => role.value === 'student');
const isProfessor = computed(() => role.value === 'professor');
function isCourseDetailResponse(course: any): course is CourseDetailResponse {
  return (
    course &&
    typeof course === "object" &&
    "course_percentage_complete" in course &&
    "course_last_accessed" in course &&
    "completed_lessons" in course &&
    "time_spent" in course &&
    "assignments_done" in course
  );
}
const emit = defineEmits<{
  'update:active-tab': [value: string];
}>();

const handleTabUpdate = (value: unknown) => {
  if (typeof value === 'string') {
    emit('update:active-tab', value);
  }
};
</script>
