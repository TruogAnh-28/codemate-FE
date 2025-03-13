<template>
  <div class="mb-6">
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-help-circle-outline</v-icon>
      <h3 class="text-subtitle-1 font-weight-bold mb-0">Quiz Questions</h3>
    </div>
    
    <v-sheet v-for="(question, index) in questions" :key="`question-${index}`" 
      rounded="lg" elevation="1" class="pa-4 mb-4 bg-grey-lighten-4">
      <div class="d-flex align-center">
        <div class="d-flex align-center" style="flex: 1">
          <span class="text-primary font-weight-medium">Question {{ index + 1 }}</span>
          <span class="ml-3 text-truncate" v-if="!expanded[index]">{{ question.question }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-btn          
          size="small"
          variant="text"
          color="primary"
          @click="toggleExpand(index)"
          class="mr-2"
        ><v-icon>{{ expanded[index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon></v-btn>
        <v-btn
          v-if="questions.length > 1"
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="removeQuestion(index)"
        ></v-btn>
      </div>
      
      <v-expand-transition>
        <div v-if="expanded[index]" class="mt-4">
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="question.question"
                label="Question Text*"
                placeholder="Enter the question text"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-help-circle-outline"
                class="rounded-lg mb-4"
                :rules="[v => !!v || 'Question text is required']"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="question.type"
                :items="questionTypes"
                label="Question Type*"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-format-list-bulleted-type"
                class="rounded-lg mb-4"
                hide-details="auto"
              ></v-select>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="question.difficulty"
                :items="difficultyLevels"
                label="Difficulty Level"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-speedometer"
                class="rounded-lg mb-4"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="question.score"
                type="number"
                label="Question Score*"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-star-outline"
                class="rounded-lg mb-4"
                min="0"
                :rules="[v => !!v || 'Score is required']"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <!-- Options -->
          <div class="mb-4">
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" size="small" class="mr-2">mdi-format-list-bulleted</v-icon>
              <div class="text-subtitle-2 font-weight-medium">Answer Options</div>
            </div>
            
            <div v-for="(_, optionIndex) in question.options" :key="`option-${index}-${optionIndex}`" 
              class="d-flex align-center mb-2">
              <v-checkbox
                v-if="question.type === 'multiple_choice'"
                v-model="question.answer"
                :value="optionIndex.toString()"
                density="comfortable"
                color="primary"
                hide-details
                class="mr-2"
              ></v-checkbox>
              <v-radio
                v-else
                :value="optionIndex.toString()"
                v-model="question.answer[0]"
                density="comfortable"
                color="primary"
                hide-details
                class="mr-2"
              ></v-radio>
              
              <v-text-field
                v-model="question.options[optionIndex]"
                :placeholder="`Option ${optionIndex + 1}`"
                variant="outlined"
                density="comfortable"
                class="rounded-lg flex-grow-1"
                hide-details="auto"
              ></v-text-field>
              
              <v-btn
                v-if="question.options.length > 2"
                icon="mdi-close"
                size="small"
                variant="text"
                color="grey-darken-1"
                class="ml-2"
                @click="removeOption(question, optionIndex)"
              ></v-btn>
            </div>
            
            <v-btn
              variant="tonal"
              prepend-icon="mdi-plus"
              color="primary"
              class="text-none mt-2 rounded-lg"
              size="small"
              @click="addOption(question)"
            >
              Add Option
            </v-btn>
          </div>
          
          <v-textarea
            v-model="question.feedback"
            label="Feedback"
            placeholder="Enter feedback for this question"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-comment-text-outline"
            class="rounded-lg"
            rows="2"
            hide-details="auto"
          ></v-textarea>
        </div>
      </v-expand-transition>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';

const props = defineProps<{
  questions: any[],
  questionTypes: string[],
  difficultyLevels: string[]
}>();

const emit = defineEmits<{
  'update:questions': [value: any[]]
}>();

// Track expanded state for each question
const expanded = ref<boolean[]>([]);

// Initialize expanded state when questions change
watch(() => props.questions, (newQuestions) => {
  // Keep existing expanded states if possible
  if (expanded.value.length < newQuestions.length) {
    // For new questions, set them as expanded by default
    for (let i = expanded.value.length; i < newQuestions.length; i++) {
      expanded.value[i] = true;
    }
  } else if (expanded.value.length > newQuestions.length) {
    // Trim expanded array if questions were removed
    expanded.value = expanded.value.slice(0, newQuestions.length);
  }
}, { immediate: true });

const toggleExpand = (index: number) => {
  expanded.value[index] = !expanded.value[index];
};

const removeQuestion = (index: number) => {
  const updatedQuestions = [...props.questions];
  updatedQuestions.splice(index, 1);
  expanded.value.splice(index, 1);
  emit('update:questions', updatedQuestions);
};

const addOption = (question: any) => {
  question.options.push('');
};

const removeOption = (question: any, optionIndex: number) => {
  if (question.options.length > 2) {
    question.options.splice(optionIndex, 1);
    
    // Update answer array if needed
    if (question.type === 'multiple_choice') {
      question.answer = question.answer.filter((ans: string) => 
        parseInt(ans) !== optionIndex && (parseInt(ans) < optionIndex || 
        parseInt(ans) >= question.options.length));
      
      // Adjust answer indices for options after the removed one
      question.answer = question.answer.map((ans: string) => {
        const ansNum = parseInt(ans);
        return ansNum > optionIndex ? (ansNum - 1).toString() : ans;
      });
    } else if (parseInt(question.answer[0]) === optionIndex) {
      question.answer = ['0']; // Reset to first option if selected one was removed
    } else if (parseInt(question.answer[0]) > optionIndex) {
      // Adjust answer index if it was after the removed option
      question.answer = [(parseInt(question.answer[0]) - 1).toString()];
    }
  }
};

// Setup watchers for deep reactivity
watch(() => props.questions, (newVal) => {
  // Handle deep reactivity if needed
}, { deep: true });
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
:deep(.v-selection-control) {
  margin: 0 !important;
  padding: 0 !important;
  flex: 0 0 auto !important;
}
</style>