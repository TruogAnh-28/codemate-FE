<template>
  <div class="mb-6">
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
      <h3 class="text-subtitle-1 font-weight-bold mb-0">General Information</h3>
    </div>
    
    <v-sheet rounded="lg" elevation="1" class="pa-4 mb-4 bg-grey-lighten-4">
      <v-text-field
        v-model="formData.name"
        label="Title*"
        placeholder="Input the title for this exercise"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-format-title"
        class="mb-4 rounded-lg"
        :rules="[v => !!v || 'Title is required']"
        hide-details="auto"
      ></v-text-field>

      <v-textarea
        v-model="formData.description"
        label="Description*"
        placeholder="Input the description for this exercise"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-text-box-outline"
        class="mb-4 rounded-lg"
        rows="4"
        :rules="[v => !!v || 'Description is required']"
        hide-details="auto"
      ></v-textarea>
      
      <!-- <v-text-field
        v-model="formData.topic"
        label="Topic"
        placeholder="Input the topic for this exercise"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-tag-outline"
        class="rounded-lg"
        hide-details="auto"
      ></v-text-field> -->
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { ExerciseQuizRequest,ExerciseCodeRequest } from '@/types/Exercise';

defineProps<{
  formData: ExerciseQuizRequest|ExerciseCodeRequest
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