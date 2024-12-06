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
      <p class="text-body-base-4"><strong>Correct Answer:</strong> {{ question.correct_answer }}</p>
      <p class="text-body-base-4"><strong>Explanation:</strong> {{ question.explanation }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { QuizQuestionResponse } from "@/types/Exercise";

// Cập nhật kiểu của question để sử dụng QuizQuestionResponse
const props = defineProps<{
  question: QuizQuestionResponse;
  ordinal: number;
}>();

const selectedAnswer = ref<number | null>(null);

// Lấy giá trị đã chọn từ user_choice và cập nhật selectedAnswer
selectedAnswer.value = props.question.options.indexOf(
  props.question.options[props.question.user_choice ?? ''] // xử lý nếu user_choice không có giá trị
);

// Hàm để thay đổi màu sắc của lựa chọn
const getOptionColor = (option: string): string => {
  if (option === props.question.correct_answer) return 'green';
  if (option === props.question.options[props.question.user_choice ?? ''] && option !== props.question.correct_answer) return 'red';
  return 'inherit';
};
</script>

<style scoped>
/* Có thể thêm các style tùy chỉnh nếu cần */
</style>
