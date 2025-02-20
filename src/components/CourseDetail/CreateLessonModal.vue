<template>
  <v-card class="pa-4">
    <div class="d-flex align-center mb-4">
      
      <v-icon size="32" class="mr-2">mdi-book-education-outline</v-icon>
      <div>
        <h2 class="text-h6 mb-1">Course: {{courseName}}</h2>
        <p class="text-body-2 text-grey-darken-1">
          Please add a lesson for this course to guide learners effectively.
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        @click="$emit('close')"
      ></v-btn>
    </div>

    <v-form ref="form" @submit.prevent="handleSubmit">
      <div class="mb-4">
        <div class="mb-1">Title:</div>
        <v-text-field
          v-model="lessonData.title"
          placeholder="Input the title for this lesson"
          variant="outlined"
          hide-details
          density="comfortable"
          :rules="[v => !!v || 'Title is required']"
        ></v-text-field>
      </div>

      <div class="mb-4">
        <div class="mb-1">Description:</div>
        <v-text-field
          v-model="lessonData.description"
          placeholder="Input the description for this lesson"
          variant="outlined"
          hide-details
          density="comfortable"
          :rules="[v => !!v || 'Description is required']"
        ></v-text-field>
      </div>

      <!-- Learning Outcomes Section -->
      <div v-for="(outcome, index) in learningOutcomes" :key="index" class="mb-4">
        <div class="d-flex align-center mb-1">
          <span>LsO:</span>
          <v-spacer></v-spacer>
          <v-icon
            v-if="learningOutcomes.length > 1"
            size="small"
            @click="removeOutcome(index)"
            class="cursor-pointer"
            color="grey-darken-1"
          >
            mdi-close
          </v-icon>
        </div>
        <v-text-field
          v-model="outcome.value"
          placeholder="Input the course's Lesson Outcomes"
          variant="outlined"
          hide-details
          density="comfortable"
        ></v-text-field>
      </div>

      <v-btn
        variant="outlined"
        @click="addOutcome"
        class="text-none mb-4"
        block
      >
        More
      </v-btn>

      <div class="upload-area pa-8 text-center rounded-lg bg-grey-lighten-4 mb-4">
        <Uploader v-model="files" />
         
      </div>

      <v-btn
        color="primary"
        block
        class="text-none"
        :loading="loading"
        @click="handleSubmit"
        :disabled="!isValid"
      >
        Confirm
      </v-btn>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { lessonService } from '@/services/Professor/LessonServices';
import type { CreateNewLessonRequest } from '@/types/Course';

const props = defineProps<{
  courseId: string;
  courseName: string;
}>();

const emit = defineEmits(['update', 'close']);

interface LearningOutcome {
  value: string;
}

const loading = ref(false);
const files = ref<File[]>([]);
const form = ref<any>(null);
const learningOutcomes = ref<LearningOutcome[]>([{ value: '' }]);

const showError = inject('showError') as (message: string) => void;
const showSuccess = inject('showSuccess') as (message: string) => void;

const lessonData = ref<CreateNewLessonRequest>({
  title: '',
  description: '',
  courseId: props.courseId,
  order: 0,
  learningOutcomes: [],
  documents: []
});

const isValid = computed(() => {
  return lessonData.value.title.trim() !== '' && 
         lessonData.value.description.trim() !== '' &&
         learningOutcomes.value.some(outcome => outcome.value.trim() !== '');
});

const addOutcome = () => {
  learningOutcomes.value.push({ value: '' });
};

const removeOutcome = (index: number) => {
  if (learningOutcomes.value.length > 1) {
    learningOutcomes.value.splice(index, 1);
  }
};

const handleSubmit = async () => {
  if (!form.value?.validate()) {
    return;
  }

  loading.value = true;
  try {
    const documents: File[] = files.value;

    const newLesson: CreateNewLessonRequest = {
      ...lessonData.value,
      learningOutcomes: learningOutcomes.value
        .filter(outcome => outcome.value.trim() !== '')
        .map(outcome => outcome.value),
      documents: documents
    };

    await lessonService.fetchLessonProfessor(
      { showError, showSuccess },
      newLesson
    );

    showSuccess('Lesson created successfully');
    emit('update');
    emit('close');
  } catch (error) {
    showError('Failed to create lesson');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.v-field) {
  border-radius: 16px !important;
}

.upload-area {
  border: 2px dashed #E0E0E0;
  border-radius: 16px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>