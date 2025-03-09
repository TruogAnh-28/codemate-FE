<template>
  <v-card class="rounded-xl border-card" elevation="3">
    <div class="card-header pa-6 d-flex align-center">
      <v-icon color="primary" size="x-large" class="mr-4">mdi-lightbulb-outline</v-icon>
      <div>
        <h2 class="text-h5 font-weight-bold">Course: {{ courseName }}</h2>
        <p class="text-subtitle-2 text-medium-emphasis mb-0">
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

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <div class="d-flex align-center mb-3">
        <v-icon color="primary" class="mr-2">mdi-certificate-outline</v-icon>
        <h3 class="text-subtitle-1 font-weight-bold mb-0">Learning Outcomes</h3>
      </div>

      <v-sheet rounded="lg" elevation="1" class="pa-4 mb-4 bg-grey-lighten-4">
        <div v-for="(_, index) in outcomes" :key="`outcome-${index}`" class="mb-3">
          <div class="d-flex align-center mb-1">
            <span class="text-body-2 text-primary font-weight-medium">Outcome {{index + 1}}</span>
            <v-spacer></v-spacer>
            <v-btn
              v-if="outcomes.length > 1"
              icon="mdi-close"
              size="small"
              variant="text"
              density="comfortable"
              color="grey-darken-1"
              @click="removeOutcome(index)"
            ></v-btn>
          </div>
          <v-text-field
            v-model="outcomes[index].value"
            placeholder="Input the course's Learning Outcome"
            variant="outlined"
            density="comfortable"
            class="rounded-lg"
            hide-details="auto"
          ></v-text-field>
        </div>

        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
          color="primary"
          class="text-none mt-2 rounded-lg"
          block
          @click="addOutcome"
        >
          Add Another Outcome
        </v-btn>
      </v-sheet>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pa-6">
      <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        class="rounded-lg mr-4"
        @click="$emit('close')"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        class="rounded-lg"
        prepend-icon="mdi-check-circle"
        @click="handleSubmit"
        :disabled="!isValid"
      >
        Confirm
      </v-btn>
    </v-card-actions>
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
.border-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.border-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.05);
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.3px;
}

:deep(.v-field) {
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}
</style>