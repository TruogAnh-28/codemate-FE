<template>
  <div>
    <RecommendationCard
      @open-recommendation="$emit('open-recommendation')"
      @open-course-recommendations="openRecommendationsModal"
    />

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

    <CourseRecommendLessons
    :course="course"
      v-if="showRecommendationsModal"
      :show-modal="showRecommendationsModal"
      @update:show-modal="updateRecommendationsModal"
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
}>();

const emit = defineEmits<{
  'open-recommendation': [];
  'open-course-recommendations': [];
  'update:dialog': [value: boolean];
  'submit-goal': [goal: string];
}>();

const openRecommendationsModal = () => {
  showRecommendationsModal.value = true;
};

const closeRecommendationsModal = () => {
  showRecommendationsModal.value = false;
};

const updateRecommendationsModal = (value: boolean) => {
  showRecommendationsModal.value = value;
};

const handleDialogUpdate = (value: unknown) => {
  if (typeof value === 'boolean') {
    emit('update:dialog', value);
  }
};
</script>
