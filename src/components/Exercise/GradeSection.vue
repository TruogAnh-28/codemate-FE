<template>
  <div class="mb-6">
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-medal-outline</v-icon>
      <h3 class="text-subtitle-1 font-weight-bold mb-0">Grading Configuration</h3>
    </div>
    
    <v-sheet rounded="lg" elevation="1" class="pa-4 mb-4 bg-grey-lighten-4">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.attempts_allowed"
            type="number"
            label="Attempts Allowed"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-restart"
            class="rounded-lg mb-4"
            min="1"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="formData.grading_method"
            :items="gradingMethodOptions"
            label="Grading Method"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-calculator"
            class="rounded-lg mb-4"
            hide-details="auto"
          ></v-select>
        </v-col>
        <!-- <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.penalty_per_attempt"
            type="number"
            label="Penalty Per Attempt (%)"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-minus-circle-outline"
            class="rounded-lg mb-4"
            min="0"
            max="100"
            hide-details="auto"
          ></v-text-field>
        </v-col> -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.pass_mark"
            type="number"
            label="Pass Mark (%)"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-check-circle-outline"
            class="rounded-lg"
            min="0"
            max="100"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { ExerciseQuizRequest,ExerciseCodeRequest } from '@/types/Exercise';

defineProps<{
  formData: ExerciseQuizRequest|ExerciseCodeRequest,
  gradingMethodOptions: string[]
}>();

defineEmits<{
  'update:formData': [value: ExerciseQuizRequest]
}>();
</script>

<style scoped>
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