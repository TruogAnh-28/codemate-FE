// CourseMainContent.vue
<template>
  <v-card class="p-6">
    <CourseBanner
      :course-info="courseInfo"
      :course="course"
    />

    <v-tabs
      :model-value="activeTab"
      @update:model-value="handleTabUpdate"
      bg-color="background"
      grow
      dark
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="text-secondary font-bold"
      >
        {{ tab.label }}
      </v-tab>
    </v-tabs>

    <v-window
      :model-value="activeTab"
      @update:model-value="handleTabUpdate"
    >
      <v-window-item value="description">
        <CourseDescription
          :learning-outcomes="courseInfo?.learning_outcomes ?? []"
        />
      </v-window-item>

      <v-window-item value="lessons">
        <CourseLessons v-if="course" :course="course" />
      </v-window-item>

      <v-window-item value="exercises">
        <CourseExercises v-if="course" :course="course" />
      </v-window-item>

      <v-window-item value="recommendlessons">
        <!-- <CourseRecommendLessons :course="course" /> -->
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import { CourseDetailResponse, CoursesListResponse } from "@/types/Course";

interface Tab {
  label: string;
  value: string;
}

defineProps<{
  courseInfo: CoursesListResponse | null;
  course: CourseDetailResponse | null;
  activeTab: string;
  tabs: Tab[];
}>();

const emit = defineEmits<{
  'update:active-tab': [value: string];
}>();

const handleTabUpdate = (value: unknown) => {
  if (typeof value === 'string') {
    emit('update:active-tab', value);
  }
};
</script>
