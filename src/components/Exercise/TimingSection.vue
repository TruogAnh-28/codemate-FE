<template>
  <div class="mb-6">
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
      <h3 class="text-subtitle-1 font-weight-bold mb-0">Timing Configuration</h3>
    </div>
    
    <v-sheet rounded="lg" elevation="1" class="pa-4 mb-4 bg-grey-lighten-4">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.time_open"
            type="datetime-local"
            label="Time Open"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-calendar-start"
            class="rounded-lg"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.time_close"
            type="datetime-local"
            label="Time Close"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-calendar-end"
            class="rounded-lg"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.time_limit"
            type="number"
            label="Time Limit (minutes)"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-timer-outline"
            class="rounded-lg"
            min="0"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { ExerciseQuizRequest } from '@/types/Exercise';

defineProps<{
  formData: ExerciseQuizRequest
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