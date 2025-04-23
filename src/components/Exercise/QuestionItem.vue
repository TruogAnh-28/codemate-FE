<template>
  <div>
    <!-- True/False Question -->
    <template v-if="question.type === 'true-false'">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="question.options[0]"
            label="Option 1"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="question.options[1]"
            label="Option 2"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-radio-group v-model="question.answer[0]">
        <v-radio
          :label="question.options[0] || 'Option 1'"
          :value="question.options[0]"
        ></v-radio>
        <v-radio
          :label="question.options[1] || 'Option 2'"
          :value="question.options[1]"
        ></v-radio>
      </v-radio-group>
    </template>

    <!-- Single/Multiple Choice Questions -->
    <template v-else>
      <div v-for="(option, optIndex) in question.options" :key="optIndex" class="mb-3">
        <v-text-field
          v-model="question.options[optIndex]"
          :label="`Option ${optIndex + 1}`"
          placeholder="Input option"
          variant="outlined"
          required
        >
          <template v-slot:append>
            <v-checkbox
              :model-value="isOptionSelected(question, option)"
              density="compact"
              hide-details
              @change="handleAnswerChange(index, optIndex, question.type)"
            ></v-checkbox>
            <v-btn
              icon="mdi-delete"
              variant="text"
              density="comfortable"
              @click="$emit('remove-option', index, optIndex)"
              :disabled="question.options.length <= 2"
            ></v-btn>
          </template>
        </v-text-field>
      </div>
      <v-btn
        variant="tonal"
        prepend-icon="mdi-plus"
        @click="$emit('add-option', index)"
        class="mb-2"
      >
        Add Option
      </v-btn>
    </template>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  question: any,
  index: number
}>();

const emit = defineEmits<{
  'add-option': [questionIndex: number],
  'remove-option': [questionIndex: number, optionIndex: number],
  'answer-change': [questionIndex: number, optionIndex: number, type: string]
}>();

const isOptionSelected = (question: any, option: string) => {
  return question.answer.includes(option);
};

const handleAnswerChange = (questionIndex: number, optionIndex: number, type: string) => {
  emit('answer-change', questionIndex, optionIndex, type);
};
</script>