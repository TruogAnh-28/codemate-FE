<template>
  <v-container fluid class="ma-0">
    <v-row>
      <v-col
        v-for="(question, index) in questions"
        :key="index"
        cols="12"
      >
        <CardQuestionQuiz
          :question="question"
          :ordinal="index + 1"
          @answerSelected="handleAnswer(index, $event)"
        />
      </v-col>
    </v-row>
    <v-btn color="primary" @click="submitAnswers">Submit</v-btn>
  </v-container>
</template>

<script lang="ts" setup>

const questions = ref([
  {
    text: 'What will happen when you try to assign a string to a number variable in TypeScript?',
    image: '',
    options: [
      'The value will be converted automatically.',
      'It will result in an error.',
      'The variable will remain undefined.',
    ],
  },
  {
    text: 'How can you assign the value of a variable value: any = "123" to a number variable using type assertion?',
    image: '',
    options: [
      'let num: number = value;',
      'let num: number = value as number;',
      'let num: number = Number(value);',
    ],
  },
  {
    text: 'Which line of code will cause a type compatibility error?',
    image: 'path-to-your-image.png',
    options: [
      'let num: number = value;',
      'let num: number = value as number;',
      'let num: number = Number(value);',
    ],
  },
]);

// Mảng để lưu câu trả lời của từng câu hỏi
const answers = ref(Array(questions.value.length).fill(null));

// Ghi nhận câu trả lời cho từng câu hỏi
function handleAnswer(questionIndex: number, selectedAnswer: number | null) {
  answers.value[questionIndex] = selectedAnswer;
}

// Xử lý khi nhấn nút Submit
function submitAnswers() {
  console.log('All answers:', answers.value);
  // Thực hiện các thao tác cần thiết, ví dụ: gửi kết quả lên server
}
</script>

<style scoped>

</style>
