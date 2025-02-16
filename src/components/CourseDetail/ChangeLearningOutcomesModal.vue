<template>
  <v-card class="pa-4">
    <div class="d-flex align-center mb-4">
      <v-icon size="32" class="mr-2">mdi-lightbulb-outline</v-icon>
      <div>
        <h2 class="text-h6 mb-1">Course: {{ courseName }}</h2>
        <p class="text-body-2 text-grey-darken-1">
          Please enter description of the learning outcomes for the course.
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        @click="$emit('close')"
      ></v-btn>
    </div>

    <v-form @submit.prevent="handleSubmit">
      <div v-for="(_, index) in outcomes" :key="index" class="mb-4">
        <div class="d-flex align-center mb-1">
          <span class="text-body-2 font-weight-medium">LO{{ index + 1 }}:</span>
          <v-spacer></v-spacer>
          <!-- Thêm nút xóa với điều kiện -->
          <v-icon
            v-if="outcomes.length > 1"
            size="small"
            @click="removeOutcome(index)"
            class="cursor-pointer"
            color="grey-darken-1"
          >
            mdi-close
          </v-icon>
        </div>
        <v-text-field
          v-model="outcomes[index].value"
          :placeholder="'Input the course\'s Learning Outcomes'"
          variant="outlined"
          hide-details
          class="mt-1"
          density="comfortable"
        ></v-text-field>
      </div>

      <div class="d-flex justify-space-between mt-6">
        <v-btn
          variant="outlined"
          @click="addOutcome"
          class="text-none"
        >
          More
        </v-btn>
        <v-btn
          color="primary"
          @click="handleSubmit"
          class="text-none"
          :disabled="!isValid"
        >
          Confirm
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { PutLearningOutcomesCoursesResponse } from '@/types/Course';

const props = defineProps<{
  courseId: string;
  courseName: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: PutLearningOutcomesCoursesResponse): void;
}>();

interface LearningOutcome {
  value: string;
}

// Initialize with 3 outcomes
const outcomes = ref<LearningOutcome[]>([
  { value: '' },
  { value: '' },
  { value: '' }
]);

const isValid = computed(() => {
  return outcomes.value.some(outcome => outcome.value.trim() !== '');
});

const addOutcome = () => {
  outcomes.value.push({ value: '' });
};

const removeOutcome = (index: number) => {
  if (outcomes.value.length > 1) {
    outcomes.value.splice(index, 1);
  }
};

const handleSubmit = () => {
  const filteredOutcomes = outcomes.value
    .filter(outcome => outcome.value.trim() !== '')
    .map(outcome => outcome.value);

  if (filteredOutcomes.length > 0) {
    emit('submit', {
      course_id: props.courseId,
      learning_outcomes: filteredOutcomes
    });
  }
};
</script>

<style scoped>
:deep(.v-field) {
  border-radius: 16px !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>