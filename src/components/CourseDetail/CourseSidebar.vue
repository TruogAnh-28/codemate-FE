<template>
  <div>
    <RecommendationCard
      @open-recommendation="$emit('open-recommendation')"
      @open-course-recommendations="openRecommendationsModal"
    />

    <!-- <ProgressStats
      v-if="course"
      :course="course"
      class="mt-4"
    /> -->

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

    <CourseRecommendLessons
      :course="course"
      :show-modal="showRecommendationsModal"
      @update:show-modal="$emit('update:show-recommendations-modal', $event)"
      @close="closeRecommendationsModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { CourseDetailResponse } from "@/types/Course";

const showRecommendationsModal = ref(false);

defineProps<{
  course: CourseDetailResponse | null;
  dialog: boolean;
  showRecommendationsModal: boolean;
}>();
const emit = defineEmits<{
  "open-recommendation": [];
  "update:dialog": [value: boolean];
  "update:show-recommendations-modal": [value: boolean];
  "submit-goal": [goal: string];
}>();

const openRecommendationsModal = () => {
  showRecommendationsModal.value = true;
};

const closeRecommendationsModal = () => {
  showRecommendationsModal.value = false;
  emit("update:show-recommendations-modal", false);
};

const handleDialogUpdate = (value: unknown) => {
  if (typeof value === "boolean") {
    emit("update:dialog", value);
  }
};
</script>
