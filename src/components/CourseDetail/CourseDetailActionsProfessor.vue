<template>
  <div class="d-flex gap-4 mb-6">
    <v-btn 
      color="primary" 
      @click="showLearningOutcomesModal = true"
    >
      Update Learning Outcomes
    </v-btn>
    <!-- <v-btn 
      color="primary" 
      :to="`/courses/${courseId}/exercise-quiz`"
    >
      Add Exercise Quiz
    </v-btn>
    <v-btn 
      color="primary" 
      :to="`/courses/${courseId}/exercise-code`"
    >
      Add Exercise Code
    </v-btn> -->
    <v-btn 
      color="primary" 
      @click="showCreateLessonModal = true"
    >
     Create Lesson
    </v-btn>

    <!-- Learning Outcomes Modal -->
    <v-dialog v-model="showLearningOutcomesModal" persistent max-width="600px" max-height="calc(100% - 130px)">
      <ChangeLearningOutcomesModal 
        :courseId="courseId"
        :courseName="courseName"
        :course_outcomes="course_outcomes"
        @close="showLearningOutcomesModal = false"
        @submit="handleLearningOutcomesSubmit"
      />
    </v-dialog>

    <v-dialog v-model="showCreateLessonModal" persistent max-width="800px" max-height="calc(100% - 130px)">
      <CreateLessonModal 
        :courseId="courseId"
        :courseName="courseName"
        @close="showCreateLessonModal = false"
        @update="handleLessonUpdate"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { coursesService } from '@/services/Professor/CourseServices';
import { PutLearningOutcomesCoursesResponse } from '@/types/Course';
import CreateLessonModal from './CreateLessonModal.vue';

const props = defineProps<{
  courseId: string;
  courseName: string;
  course_outcomes: string[];
}>();

const emit = defineEmits(['update:course']);

const showCreateLessonModal = ref(false);
const showLearningOutcomesModal = ref(false);
const showError = inject('showError') as (message: string) => void;
const showSuccess = inject('showSuccess') as (message: string) => void;

const handleLearningOutcomesSubmit = async (data: PutLearningOutcomesCoursesResponse) => {
  try {
    await coursesService.putLearningOutcomesCourse(
      { showError, showSuccess },
      props.courseId,
      data
    );
    showLearningOutcomesModal.value = false;
    showSuccess('Learning outcomes updated successfully');

    emit('update:course');
  } catch (error) {
    showError('Failed to update learning outcomes');
  }
};

const handleLessonUpdate = () => {
  showCreateLessonModal.value = false;
 
  emit('update:course');
}
</script>