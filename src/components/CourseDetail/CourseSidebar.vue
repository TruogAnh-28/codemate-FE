// CourseSidebar.vue
<template>
  <div>
    <RecommendationCard @open-recommendation="$emit('open-recommendation')" />

    <ProgressStats
      v-if="course"
      :course="course"
      class="mt-4"
    />

    <v-dialog
      :model-value="dialog"
      @update:model-value="handleDialogUpdate"
      max-width="500"
    >
      <GetGoalsModal
        :dialog="dialog"
        @update:dialog="$emit('update:dialog', $event)"
        @submitGoal="$emit('submit-goal', $event)"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { CourseDetailResponse } from "@/types/Course";

const props = defineProps<{
  course: CourseDetailResponse | null;
  dialog: boolean;
}>();

const emit = defineEmits<{
  'open-recommendation': [];
  'update:dialog': [value: boolean];
  'submit-goal': [goal: string];
}>();

const handleDialogUpdate = (value: unknown) => {
  if (typeof value === 'boolean') {
    emit('update:dialog', value);
  }
};
</script>
