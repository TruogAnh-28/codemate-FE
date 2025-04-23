<template>
  <v-btn
    color="secondary"
    size="large"
    prepend-icon="mdi-robot"
    class="ai-assessment-btn"
    @click="handleClick"
    :loading="loading"
  >
    Get AI Assessment
  </v-btn>

  <AIAssessmentModal
    v-model="modalOpen"
    :assessment-data="assessmentData?.student_assessment ?? null"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { ProgressTrackingStudent } from "@/types/ProgressTracking"

const modalOpen = ref(false);
const loading = ref(false);
const assessmentData = ref<ProgressTrackingStudent>();

const props = defineProps<{
  fetchAssessment: () => Promise<ProgressTrackingStudent | null>
}>();

const handleClick = async () => {
  loading.value = true;
  modalOpen.value = true;
  
  try {
    const result = await props.fetchAssessment();
    assessmentData.value = result ?? undefined;
  } catch (error) {
    console.error("Error fetching assessment:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.ai-assessment-btn {
  margin-top: 20px;
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.ai-assessment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>