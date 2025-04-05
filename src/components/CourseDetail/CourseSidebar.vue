<template>
  <div>
    <RecommendationCard
      :has-learning-path="hasLearningPath"
      @open-recommendation="$emit('open-recommendation')"
      @create-new-path="$emit('create-new-path')"
      @open-course-recommendations="openRecommendationsModal"
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

const showRecommendationsModal = ref(false);

defineProps<{
  course: CourseDetailResponse | null;
  dialog: boolean;
  showRecommendationsModal: boolean;
  hasLearningPath: boolean;
}>();

const emit = defineEmits<{
  "open-recommendation": [];
  "create-new-path": [];
  "update:dialog": [value: boolean];
  "update:show-recommendations-modal": [value: boolean];
  "submit-goal": [goal: string];
}>();

const openRecommendationsModal = () => {
  showRecommendationsModal.value = true;
};

const handleDialogUpdate = (value: unknown) => {
  if (typeof value === "boolean") {
    emit("update:dialog", value);
  }
};
</script>
