<template>
  <v-card class="mb-4">
    <v-card-title class="font-bold items-center bg-primary mb-2">
      <span class="bg-white rounded-full px-2 py-1 mr-2">{{ ordinal }}</span>
      <span class="whitespace-normal break-words text-body-large-4">{{
        question.question
      }}</span>
    </v-card-title>

    <v-card-subtitle v-if="question.image">
      <v-img :src="question.image" class="my-3 max-h-52 contain"></v-img>
    </v-card-subtitle>

    <v-card-text>
      <!-- Radio buttons -->
      <v-radio-group v-model="selectedAnswer" hide-details readonly>
        <v-radio
          v-for="(option, index) in question.options"
          :key="index"
          :label="option"
          :value="index"
          :style="{ color: getOptionColor(option), opacity: 1 }"
          :disabled="true"
        ></v-radio>
      </v-radio-group>

      <!-- Correct answer and explanation -->
      <p class="text-body-base-4"><strong>Correct Answer:</strong> {{ question.correctAnswer }}</p>
      <p class="text-body-base-4"><strong>Explanation:</strong> {{ question.explanation }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  question: {
    text: string;
    image?: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    chooseUser?: string;
  };
  ordinal: number;
}>();

const selectedAnswer = ref<number | null>(null);
if (props.question.chooseUser) {
  selectedAnswer.value = props.question.options.indexOf(
    props.question.chooseUser
  );
}
const getOptionColor = (option: string): string => {
  if (option === props.question.correctAnswer) return 'green';
  if (option === props.question.chooseUser && option !== props.question.correctAnswer) return 'red';
  return 'inherit';
};
</script>

<style scoped>
</style>
