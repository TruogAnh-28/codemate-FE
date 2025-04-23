<template>
  <div class="mb-6">
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-cog-outline</v-icon>
      <h3 class="text-subtitle-1 font-weight-bold mb-0">Quiz Options</h3>
    </div>
    
    <v-sheet rounded="lg" elevation="1" class="pa-4 mb-4 ">
      <v-row>
        <v-col cols="12" md="6">
          <v-switch
            v-model="formData.shuffle_questions"
            label="Shuffle Questions"
            color="primary"
            density="comfortable"
            hide-details
            class="mb-2"
          ></v-switch>
          
          <v-switch
            v-model="formData.shuffle_answers"
            label="Shuffle Answers"
            color="primary"
            density="comfortable"
            hide-details
            class="mb-2"
          ></v-switch>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-switch
            v-model="formData.review_after_completion"
            label="Review After Completion"
            color="primary"
            density="comfortable"
            hide-details
            class="mb-2"
          ></v-switch>
          
          <v-switch
            v-model="formData.show_correct_answers"
            label="Show Correct Answers"
            color="primary"
            density="comfortable"
            hide-details
          ></v-switch>
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