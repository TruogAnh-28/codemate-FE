<template>
  <v-dialog 
    v-model="dialogVisible" 
    max-width="600" 
    persistent
  >
    <v-card class="rounded-xl border-card" elevation="3">
      <div class="card-header pa-6 d-flex align-center">
        <v-icon color="primary" size="x-large" class="mr-4">mdi-help-circle-outline</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">Generate Custom Quiz</h2>
          <p class="text-subtitle-2 text-medium-emphasis mb-0">
            Select the number of questions for each difficulty level
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="closeDialog"
        ></v-btn>
      </div>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="generateCustomQuiz">
          <v-sheet rounded="lg" elevation="1" class="pa-4 mb-4 bg-grey-lighten-4">
            <!-- <p class="text-body-2 mb-4 text-medium-emphasis">
              Total questions must not exceed 40. Distribute questions across difficulty levels.
            </p> -->

            <div class="mb-3">
              <div class="d-flex align-center mb-1">
                <span class="text-body-2 text-primary font-weight-medium">Easy Questions</span>
              </div>
              <v-text-field
                v-model.number="easyQuestions"
                type="number"
                placeholder="Number of easy questions"
                variant="outlined"
                density="comfortable"
                min="0"
                max="100"
                class="rounded-lg"
                hide-details="auto"
              ></v-text-field>
            </div>

            <div class="mb-3">
              <div class="d-flex align-center mb-1">
                <span class="text-body-2 text-primary font-weight-medium">Medium Questions</span>
              </div>
              <v-text-field
                v-model.number="mediumQuestions"
                type="number"
                placeholder="Number of medium questions"
                variant="outlined"
                density="comfortable"
                min="0"
                max="100"
                class="rounded-lg"
                hide-details="auto"
              ></v-text-field>
            </div>

            <div class="mb-3">
              <div class="d-flex align-center mb-1">
                <span class="text-body-2 text-primary font-weight-medium">Hard Questions</span>
              </div>
              <v-text-field
                v-model.number="hardQuestions"
                type="number"
                placeholder="Number of hard questions"
                variant="outlined"
                density="comfortable"
                min="0"
                max="100"
                class="rounded-lg"
                hide-details="auto"
              ></v-text-field>
            </div>

          </v-sheet>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-end pa-6">
        <v-btn
          variant="outlined"
          class="rounded-lg mr-4"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
            color="primary"
            variant="elevated"
            class="rounded-lg"
            :disabled="isGenerating"
            @click.stop="generateCustomQuiz"
            >
            <v-progress-circular 
                v-if="isGenerating" 
                indeterminate 
                size="24" 
                class="mr-2"
            ></v-progress-circular>
            {{ isGenerating ? 'Generating...' : 'Generate Quiz' }}
            </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { aiGenerateServices } from "@/services/aiGenerateServices";

const props = defineProps<{
  moduleId: string;
  lessonId: string;
}>();

const emit = defineEmits(['quiz-generated', 'close']);

const dialogVisible = ref(false);
const easyQuestions = ref(10);
const mediumQuestions = ref(10);
const hardQuestions = ref(10);
const isGenerating = ref(false);

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const closeDialog = () => {
  dialogVisible.value = false;
  emit('close');
};

const generateCustomQuiz = async () => {
  if (isGenerating.value) return;

  try {
    isGenerating.value = true;
    const response = await aiGenerateServices.generateQuiz(
      { showError, showSuccess },
      { 
        module_id: props.moduleId,
        difficulty_distribution: {
          easy: easyQuestions.value,
          medium: mediumQuestions.value,
          hard: hardQuestions.value
        }
      }
    );
    
    if (response && response.data) {
      showSuccess("Custom quiz generated successfully!");
      
      emit('quiz-generated');
      
      closeDialog();
    }
  } catch (error) {
    console.error("Error generating custom quiz:", error);
    showError("Failed to generate custom quiz. Please try again.");
  }
  finally {
    isGenerating.value = false;
  }
};

defineExpose({
  openDialog: () => {
    dialogVisible.value = true;
  }
});
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