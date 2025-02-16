<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <v-icon icon="mdi-book-open-variant" class="me-2"></v-icon>
        <span class="text-h6">Add Exercise: Code</span>
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        @click="$emit('close')"
      ></v-btn>
    </div>

    <div class="text-subtitle-1 text-grey-darken-1 mb-4">
      Course: {{ props.courseName }}
    </div>
    <div class="text-caption text-grey mb-6">
      Please add a exercise for this course to guide learners effectively.
    </div>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.name"
            label="Title"
            placeholder="Input the title for this exercise"
            variant="outlined"
            required
          ></v-text-field>

          <v-textarea
            v-model="formData.description"
            label="Description"
            placeholder="Input the description for this exercise"
            variant="outlined"
            rows="4"
          ></v-textarea>
        </v-col>

        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.deadline"
                type="date"
                label="Deadline"
                placeholder="Select date"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="timeInput"
                type="time"
                label="Time Limit (HH:mm)"
                placeholder="Select time"
                variant="outlined"
                :error-messages="timeError"
                @input="handleTimeInput"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.difficulty"
                :items="difficultyLevels"
                label="Difficulty"
                placeholder="Select Difficulty"
                variant="outlined"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.topic"
                label="Topic"
                placeholder="Select Topic"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Questions Section -->
      <v-card 
        v-for="(question, index) in formData.questions" 
        :key="index" 
        class="mt-4 pa-4"
        variant="outlined"
      >
        <div class="d-flex justify-space-between align-center mb-4">
          <span class="text-h6">Question {{ index + 1 }}</span>
          <v-btn
            icon="mdi-delete"
            variant="text"
            color="error"
            @click="removeQuestion(index)"
            :disabled="formData.questions.length === 1"
          ></v-btn>
        </div>

        <v-textarea
          v-model="question.question"
          label="Question"
          placeholder="Input the coding question"
          variant="outlined"
          rows="4"
          required
        ></v-textarea>

        <!-- Test Cases Section -->
        <div class="mt-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-1">Test Cases</span>
          </div>

          <v-card class="mt-2 pa-3" variant="outlined">
            <v-row>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="inputFiles[index]"
                  label="Input File"
                  accept=".txt"
                  placeholder="Upload input test case file"
                  prepend-icon="mdi-upload"
                  variant="outlined"
                  @update:model-value="(file) => handleInputFileUpload(Array.isArray(file) ? file[0] : file, index)"
                  :show-size="true"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="outputFiles[index]"
                  label="Output File"
                  accept=".txt"
                  placeholder="Upload output test case file"
                  prepend-icon="mdi-upload"
                  variant="outlined"
                  @update:model-value="(file) => handleOutputFileUpload(Array.isArray(file) ? file[0] : file, index)"
                  :show-size="true"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-card>

      <div class="d-flex justify-space-between mt-4">
        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="addQuestion"
        >
          Add Question
        </v-btn>
        <div>
          <v-btn 
            color="grey" 
            variant="tonal" 
            class="me-2"
            @click="$emit('close')"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            Save
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { ExerciseCodeResponse } from '@/types/Exercise';

const props = defineProps<{
  courseId: string;
  courseName: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: ExerciseCodeResponse): void;
}>();

const difficultyLevels = ['easy', 'medium', 'hard'];
const timeInput = ref('');
const timeError = ref('');
// Separate arrays to store file references for each question
const inputFiles = ref<(File | null)[]>([null]);
const outputFiles = ref<(File | null)[]>([null]);

const formData = ref<ExerciseCodeResponse>({
  exercise_id: crypto.randomUUID(),
  course_id: props.courseId,
  name: '',
  description: '',
  topic: '',
  difficulty: 'medium',
  type: 'code',
  questions: [{
    question: '',
    testcases: [{
      input: '',
      output: ''
    }]
  }],
  max_score: 0,
  time: 0,
  deadline: ''
});

const handleTimeInput = () => {
  timeError.value = '';
  if (timeInput.value) {
    const [hours, minutes] = timeInput.value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      timeError.value = 'Invalid time format';
      return;
    }
    // Convert time to minutes
    formData.value.time = hours * 60 + minutes;
  } else {
    formData.value.time = 0;
  }
};

const isFormValid = computed(() => {
  return formData.value.questions.every(question => 
    question.question.trim() !== '' &&
    question.testcases[0].input.trim() !== '' &&
    question.testcases[0].output.trim() !== ''
  ) && formData.value.name.trim() !== '';
});

const addQuestion = () => {
  formData.value.questions.push({
    question: '',
    testcases: [{
      input: '',
      output: ''
    }]
  });
  inputFiles.value.push(null);
  outputFiles.value.push(null);
};

const removeQuestion = (index: number) => {
  formData.value.questions.splice(index, 1);
  inputFiles.value.splice(index, 1);
  outputFiles.value.splice(index, 1);
};

const readFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

const handleInputFileUpload = async (file: File | null, questionIndex: number) => {
  if (!file) {
    formData.value.questions[questionIndex].testcases[0].input = '';
    return;
  }

  try {
    const content = await readFile(file);
    formData.value.questions[questionIndex].testcases[0].input = content.trim();
  } catch (error) {
    console.error('Error reading input file:', error);
    // You might want to show an error message to the user
  }
};

const handleOutputFileUpload = async (file: File | null, questionIndex: number) => {
  if (!file) {
    formData.value.questions[questionIndex].testcases[0].output = '';
    return;
  }

  try {
    const content = await readFile(file);
    formData.value.questions[questionIndex].testcases[0].output = content.trim();
  } catch (error) {
    console.error('Error reading output file:', error);
    // You might want to show an error message to the user
  }
};

const handleSubmit = () => {
  // Each question is worth 100 points
  formData.value.max_score = formData.value.questions.length * 100;
  if (!timeInput.value) {
    timeError.value = 'Time limit is required';
    return;
  }
  console.log(formData.value);
  emit('submit', formData.value);
};
</script>