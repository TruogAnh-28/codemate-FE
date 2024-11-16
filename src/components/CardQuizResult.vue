<template>
  <v-card class="mb-4">
    <v-card-title class="font-bold items-center bg-primary mb-2">
      <span class="bg-white rounded-full px-2 py-1 mr-2">{{ ordinal }}</span>
      <span class="whitespace-normal break-words text-body-large-4">{{ question.question }}</span>
    </v-card-title>

    <v-card-subtitle v-if="question.image">
      <v-img :src="question.image" class="my-3 max-h-52 contain"></v-img>
    </v-card-subtitle>

    <v-card-text>
      <ul>
        <li class="text-body-base-1"
          v-for="(option, index) in question.options"
          :key="index"
          :class="{
            correct: option === question.correctAnswer,
            incorrect: option === question.chooseUser && option !== question.correctAnswer,
          }"
        >
          {{ option }}
          <span v-if="option === question.chooseUser && option === question.correctAnswer">✔</span>
          <span v-if="option === question.chooseUser && option !== question.correctAnswer">✖</span>
        </li>
      </ul>
      <p class="text-body-base-1"><strong>Correct Answer:</strong> {{ question.correctAnswer }}</p>
      <p class="text-body-base-1"><strong>Explanation:</strong> {{ question.explanation }}</p>
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
</script>

<style scoped>
.correct {
  color: green;
  font-weight: bold;
}

.incorrect {
  color: red;
  text-decoration: line-through;
}
</style>
