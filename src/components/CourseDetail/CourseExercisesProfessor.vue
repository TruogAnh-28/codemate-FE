<template>
  <div class="space-y-6">
    <v-container>
      <div v-if="exercises.length === 0">
        <v-card-title class="text-heading-4 font-semibold">Exercises:</v-card-title>
        <v-card-text>No exercises available</v-card-text>
      </div>

      <v-row v-for="(exercise, index) in exercises" :key="index" align="center">
        <v-col cols="12">
          <v-card class="rounded-lg shadow-md p-4">
            <v-row align="center" class="m-0">
              <v-col cols="6">
                <div class="font-semibold text-body-large-1 mb-2">
                  {{ exercise.name }}
                </div>
                <div class="text-body-base-1 text-text-tetiary">
                  {{ exercise.description }}
                </div>
              </v-col>
              <v-col cols="3" class="text-center">
                <v-chip
                  color="primary"
                  outlined
                  small
                  class="text-body-small-1"
                >
                  <v-icon left size="18" class="mr-2">mdi-check-circle</v-icon>
                  {{ exercise.type }}
                </v-chip>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-btn
                  icon
                  small
                  variant="text"
                  class="mr-2"
                  @click="viewExercise(exercise)"
                >
                  <v-icon color="primary">mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  variant="text"
                  class="mr-2"
                  @click="handleEditExercise(exercise)"
                >
                  <v-icon color="warning">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  variant="text"
                  @click="confirmDelete(exercise)"
                >
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this exercise?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="deleteExercise"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Exercise Quiz Edit Modal -->
    <!-- <ExerciseQuizModal
      v-if="showQuizModal"
      :course-id="props.course?.course_id || ''"
      :course-name="props.course?.course_name || ''"
      :initial-data="selectedExercise"
      @close="closeQuizModal"
      @submit="handleQuizSubmit"
    /> -->
    <v-dialog v-model="showQuizModal" persistent max-width="1200px" max-height="calc(100% - 130px)" class="mx-10">
      <ExerciseQuizModal 
        :course-id="props.course?.course_id || ''"
        :course-name="props.course?.course_name || ''"
        :data="selectedExercise"
        @close="closeQuizModal"
        @submit="handleQuizSubmit"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { GetCourseDetailProfessorResponse, GetExercisesProfessor } from "@/types/Course";
import { ExerciseQuizResponse, ExerciseQuizRequest } from '@/types/Exercise';
import { exercisesService } from '@/services/Professor/ExerciseServices';
import { coursesService } from '@/services/Professor/CourseServices';
import {GetExercisesList} from "@/types/Exercise";
const props = defineProps<{
  course: GetCourseDetailProfessorResponse;
}>();
const router = useRouter();
const exercises = ref<GetExercisesList[]>([]);
const deleteDialog = ref(false);
const selectedExercise = ref<ExerciseQuizResponse | null>(null);
const showQuizModal = ref(false);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const emit = defineEmits(['view', 'edit', 'delete', 'update']);

// watchEffect(() => {
//   if (props.course?.exercises) {
//     exercises.value = props.course.exercises;
//   }
// });

const viewExercise = (exercise: GetExercisesProfessor) => {
  emit('view', exercise);
};

const handleEditExercise = async (exercise: GetExercisesProfessor) => {
  if (exercise.type === 'quiz') {
    router.push(`/courses/${props.course.course_id}/exercise-quiz/${exercise.id}`);
  } else {
    emit('edit', exercise);
  }
};

const closeQuizModal = () => {
  showQuizModal.value = false;
  selectedExercise.value = null;
};

const handleQuizSubmit = async (data: ExerciseQuizRequest) => {
  if (selectedExercise.value) {
    try {
      const response = await exercisesService.editExerciseQuiz(
        { showError, showSuccess },
        selectedExercise.value.exercise_id,
        data as ExerciseQuizRequest
      );
      
      // Update the exercises list with the edited exercise
      // const index = exercises.value.findIndex(e => e.id === selectedExercise.value?.exercise_id);
      // if (index !== -1) {
      //   exercises.value[index] = response;
      // }
      
      emit('update', response);
      closeQuizModal();
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  }
};

const confirmDelete = (exercise: GetExercisesProfessor) => {
  deleteDialog.value = true;
};

const deleteExercise = () => {
  if (selectedExercise.value) {
    emit('delete', selectedExercise.value);
    deleteDialog.value = false;
    selectedExercise.value = null;
  }
};
const fetchExercises = async () => {
    const response = await coursesService.fetchExercisesTitleList(
      { showError, showSuccess },
      props.course.course_id
    );
    if (response && "data" in response && response.data  ) {
      exercises.value = response.data as GetExercisesList[];
      console.log("exercises:",exercises.value);
    }
};
onMounted(async () => {
  await fetchExercises();
});
</script>

<style scoped>
.v-row.m-0 {
  margin: 0 !important;
}
</style>