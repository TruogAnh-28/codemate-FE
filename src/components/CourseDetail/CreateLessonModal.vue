<template>
  <v-card class="rounded-xl border-card" elevation="3">
    <div class="card-header pa-6 d-flex align-center">
      <v-icon color="primary" size="x-large" class="mr-4">mdi-book-education-outline</v-icon>
      <div>
        <h2 class="text-h5 font-weight-bold">Course: {{courseName}}</h2>
        <p class="text-subtitle-2 text-medium-emphasis mb-0">
          {{ props.lessonId ? 'Edit this lesson' : 'Please add a lesson for this course to guide learners effectively.' }}
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

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="lessonData.title"
          label="Title*"
          placeholder="Input the title for this lesson"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-format-title"
          class="mb-4 rounded-lg"
          :rules="[v => !!v || 'Title is required']"
          hide-details="auto"
        ></v-text-field>

        <v-text-field
          v-model="lessonData.description"
          label="Description*"
          placeholder="Input the description for this lesson"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-text-box-outline"
          class="mb-4 rounded-lg"
          :rules="[v => !!v || 'Description is required']"
          hide-details="auto"
        ></v-text-field>

        <!-- Learning Outcomes Section -->
        <div class="d-flex align-center mb-3">
          <v-icon color="primary" class="mr-2">mdi-certificate-outline</v-icon>
          <h3 class="text-subtitle-1 font-weight-bold mb-0">Learning Outcomes</h3>
        </div>

        <v-sheet rounded="lg" elevation="1" class="pa-4 mb-4 bg-grey-lighten-4">
          <div v-for="(outcome, index) in learningOutcomes" :key="`outcome-${index}`" class="mb-3">
            <div class="d-flex align-center mb-1">
              <span class="text-body-2 text-primary font-weight-medium">Outcome {{index + 1}}</span>
              <v-spacer></v-spacer>
              <v-btn
                v-if="learningOutcomes.length > 1"
                icon="mdi-close"
                size="small"
                variant="text"
                density="comfortable"
                color="grey-darken-1"
                @click="removeOutcome(index)"
              ></v-btn>
            </div>
            <v-text-field
              v-model="outcome.value"
              placeholder="Input the course's Lesson Outcome"
              variant="outlined"
              density="comfortable"
              class="rounded-lg"
              hide-details="auto"
            ></v-text-field>
          </div>

          <v-btn
            variant="tonal"
            prepend-icon="mdi-plus"
            color="primary"
            class="text-none mt-2 rounded-lg"
            block
            @click="addOutcome"
          >
            Add Another Outcome
          </v-btn>
        </v-sheet>

        <!-- Document Upload Section (chỉ hiển thị khi tạo mới) -->
        <div v-if="!props.lessonId">
          <div class="d-flex align-center mb-3">
            <v-icon color="primary" class="mr-2">mdi-cloud-upload-outline</v-icon>
            <h3 class="text-subtitle-1 font-weight-bold mb-0">Upload Documents</h3>
          </div>

          <div class="drop-zone pa-8 text-center rounded-lg mb-4">
            <Uploader v-model="files" />
            
            <!-- Document Description Inputs -->
            <v-expand-transition>
              <div v-if="files.length > 0" class="mt-6">
                <div class="d-flex align-center mb-2">
                  <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold mb-0">Document Descriptions</h3>
                  <v-spacer></v-spacer>
                  <v-chip color="success" size="small">{{ files.length }} Files</v-chip>
                </div>
                <v-card variant="outlined" class="pa-4 bg-grey-lighten-4">
                  <div v-for="(file, index) in files" :key="`file-${index}`" class="mb-3">
                    <div class="d-flex align-center mb-1">
                      <v-icon size="small" color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                      <span class="text-caption font-weight-medium text-truncate">{{ file.name }}</span>
                    </div>
                    <v-text-field
                      v-model="documentDescriptions[index]"
                      placeholder="Enter description for this document"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                      class="mt-1 rounded-lg"
                    ></v-text-field>
                  </div>
                </v-card>
              </div>
            </v-expand-transition>
          </div>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pa-6">
      <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        class="rounded-lg mr-4"
        @click="$emit('close')"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        class="rounded-lg"
        :loading="loading"
        prepend-icon="mdi-check-circle"
        @click="handleSubmit"
        :disabled="!isValid"
      >
        {{ props.lessonId ? 'Update Lesson' : 'Create Lesson' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { CreateNewLessonRequest, LessonResponse } from '@/types/Course';
import { lessonService } from '@/services/Professor/LessonServices';

const props = defineProps<{
  courseId: string;
  courseName: string;
  lessonId?: string;
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

// Watch cho files để điều chỉnh documentDescriptions
watch(files, (newFiles) => {
  if (newFiles.length > documentDescriptions.value.length) {
    const diff = newFiles.length - documentDescriptions.value.length;
    for (let i = 0; i < diff; i++) {
      documentDescriptions.value.push('');
    }
  } else if (newFiles.length < documentDescriptions.value.length) {
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

const fetchLesson = async () => {
  if (!props.lessonId) return;
  
  loading.value = true;
  try {
    const response = await lessonService.getLesson({showError, showSuccess}, props.lessonId);
    
    if (response && "data" in response && response.data) {
      const lesson = response.data as LessonResponse;
      
      lessonData.value.title = lesson.title;
      lessonData.value.description = lesson.description || '';
      lessonData.value.order = lesson.order || 0;
      
      if (lesson.learning_outcomes && lesson.learning_outcomes.length > 0) {
        learningOutcomes.value = lesson.learning_outcomes.map(outcome => ({ value: outcome }));
      } else {
        learningOutcomes.value = [{ value: '' }];
      }
    }
  } catch (error) {
    showError('Failed to fetch lesson details');
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.value?.validate()) {
    return;
  }
  
  loading.value = true;
  try {
    const outcomes = learningOutcomes.value
      .filter(outcome => outcome.value.trim() !== '')
      .map(outcome => outcome.value);

    if (props.lessonId) {
      const updateData = {
        lesson_id: props.lessonId,
        title: lessonData.value.title,
        description: lessonData.value.description,
        courseId: props.courseId,
        order: lessonData.value.order,
        learningOutcomes: outcomes
      };
      
      await lessonService.updateLessonProfessor(
        { showError, showSuccess },
        updateData
      );
      
      showSuccess('Lesson updated successfully');
    } else {
      // Tạo mới lesson với đầy đủ thông tin bao gồm file
      const newLesson = {
        ...lessonData.value,
        learningOutcomes: outcomes,
        documents: files.value,
        documentDescriptions: documentDescriptions.value
      };
      
      await lessonService.fetchLessonProfessor(
        { showError, showSuccess },
        newLesson
      );
      
      showSuccess('Lesson created successfully');
    }
    
    emit('update');
    emit('close');
  } catch (error) {
    showError(props.lessonId ? 'Failed to update lesson' : 'Failed to create lesson');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchLesson();
});
</script>

<style scoped>
.border-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.border-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.05);
}

.drop-zone {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  background-color: rgba(var(--v-theme-primary), 0.03);
  transition: all 0.3s ease;
}

.drop-zone:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.3px;
}

:deep(.v-field) {
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}
</style>