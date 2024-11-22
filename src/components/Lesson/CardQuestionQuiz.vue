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
      <v-radio-group v-model="selectedAnswer" @change="emitAnswer" hide-details>
        <v-radio
          v-for="(option, index) in question.options"
          :key="index"
          :label="option"
          :value="index"
          :style="{ opacity: 1 }"
        ></v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>

const props = defineProps<{
  question: {
    text: string;
    image?: string;
    options: string[];
  };
  ordinal: number;
}>();

const emit = defineEmits(['answerSelected']);
const selectedAnswer = ref<number | null>(null);

function emitAnswer() {
  emit('answerSelected', selectedAnswer.value);
}
</script>

<style scoped>
/* No custom CSS needed - using Vuetify and Tailwind classes */
</style>
