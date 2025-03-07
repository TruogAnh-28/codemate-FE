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
      <div v-for="(outcome, index) in learningOutcomes" :key="`outcome-${index}`" class="mb-4">
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
        
        <!-- Document Description Inputs -->
        <div v-if="files.length > 0" class="mt-4">
          <div class="text-subtitle-1 mb-2">Document Descriptions</div>
          <v-card variant="outlined" class="pa-3">
            <div v-for="(file, index) in files" :key="`file-${index}`" class="mb-3">
              <div class="d-flex align-center mb-1">
                <v-icon size="small" class="mr-2">mdi-file-document-outline</v-icon>
                <span class="text-caption text-truncate">{{ file.name }}</span>
              </div>
              <v-text-field
                v-model="documentDescriptions[index]"
                placeholder="Enter description for this document"
                variant="outlined"
                density="compact"
                hide-details
                class="mt-1"
              ></v-text-field>
            </div>
          </v-card>
        </div>
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
import { ref, computed, watch, inject } from 'vue';
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
const documentDescriptions = ref<string[]>([]);

const showError = inject('showError') as (message: string) => void;
const showSuccess = inject('showSuccess') as (message: string) => void;

const lessonData = ref<CreateNewLessonRequest>({
  title: '',
  description: '',
  courseId: props.courseId,
  order: 0,
  learningOutcomes: [],
  documents: [],
  documentDescriptions: []
});

// Watch for changes in the files array to adjust the documentDescriptions array
watch(files, (newFiles) => {
  // Ensure documentDescriptions has an entry for each file
  if (newFiles.length > documentDescriptions.value.length) {
    // Add empty descriptions for new files
    const diff = newFiles.length - documentDescriptions.value.length;
    for (let i = 0; i < diff; i++) {
      documentDescriptions.value.push('');
    }
  } else if (newFiles.length < documentDescriptions.value.length) {
    // Remove descriptions for removed files
    documentDescriptions.value = documentDescriptions.value.slice(0, newFiles.length);
  }
}, { deep: true });

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
      documents: documents,
      documentDescriptions: documentDescriptions.value
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