<template>
  <v-layout class="bg-gray-50 min-h-screen">
    <v-main class="px-6 py-8">
      <!-- Header Section -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <h1 class="text-3xl font-bold text-gray-900">Progress Course</h1>
            <v-select
              v-model="selectedCourseId"
              :items="courses?.course_name_list || []"
              item-title="course_name"
              item-value="course_id"
              label="Select Course"
              variant="outlined"
              density="comfortable"
              class="w-64 rounded-lg"
              hide-details
            ></v-select>
          </div>
          <div class="flex items-center gap-4">
            <v-btn
              @click="viewMode = 'course'"
              variant="tonal"
              class="rounded-lg"
              :class="{ 'bg-primary text-white': viewMode === 'course' }"
            >
              Course Overview
            </v-btn>
            <v-btn
              @click="viewMode = 'exercise'"
              variant="tonal"
              class="rounded-lg"
              :class="{ 'bg-primary text-white': viewMode === 'exercise' }"
              :disabled="!selectedCourseId"
            >
              Exercise Details
            </v-btn>
          </div>
        </div>
      </div>

      <ProgressCourseGrade
        v-if="viewMode === 'course' && selectedCourseId"
        :course-grades="courseGrades"
        :loading="loading"
      />

      <ProgressExerciseGrade
        v-if="viewMode === 'exercise' && selectedCourseId"
        :exercises="exercises"
        :exercise-grades="exerciseGrades"
        :selected-exercise-id="selectedExerciseId"
        :loading="loading"
        @update:selected-exercise-id="selectedExerciseId = $event"
      />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, watch, inject, onMounted } from 'vue';
import { progressServices } from "@/services/Professor/ProgressServices";
import type {
  GetCoursesListResponse,
  GetExercisesListResponse,
  GetCourseGradesResponse,
  GetExerciseGradesResponse,
} from "@/types/ProgressTracking";

const loading = ref(false);
const viewMode = ref<'course' | 'exercise'>('course');
const selectedCourseId = ref('');
const selectedExerciseId = ref('');
const courses = ref<GetCoursesListResponse>();
const exercises = ref<GetExercisesListResponse>();
const courseGrades = ref<GetCourseGradesResponse | null>(null);
const exerciseGrades = ref<GetExerciseGradesResponse | null>(null);

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// ... (rest of the fetch functions and watchers remain the same)
const fetchCourses = async () => {
  try {
    const response = await progressServices.fetchCoursesList({
      showError,
      showSuccess,
    });

    if ("data" in response && response.data) {
      courses.value = response.data as GetCoursesListResponse;
      if (courses.value.course_name_list.length > 0 && !selectedCourseId.value) {
        selectedCourseId.value = courses.value.course_name_list[0].course_id;
      }
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

const fetchExercises = async () => {
  if (!selectedCourseId.value) return;
  
  try {
    const response = await progressServices.fetchExercisesList(
      { showError, showSuccess },
      selectedCourseId.value
    );

    if ("data" in response && response.data) {
      exercises.value = response.data as GetExercisesListResponse;
    }
    console.log(exercises.value)
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
};

const fetchCourseGrades = async () => {
  if (!selectedCourseId.value) return;
  
  loading.value = true;
  try {
    const response = await progressServices.fetchCourseGrades(
      { showError, showSuccess },
      selectedCourseId.value
    );

    if ("data" in response && response.data) {
      courseGrades.value = response.data as GetCourseGradesResponse;
    }
  } catch (error) {
    console.error("Error fetching course grades:", error);
  } finally {
    loading.value = false;
  }
};

const fetchExerciseGrades = async () => {
  if (!selectedCourseId.value || !selectedExerciseId.value) return;
  
  loading.value = true;
  try {
    const response = await progressServices.fetchExerciseGrades(
      { showError, showSuccess },
      selectedCourseId.value,
      selectedExerciseId.value
    );

    if ("data" in response && response.data) {
      exerciseGrades.value = response.data as GetExerciseGradesResponse;
    }
  } catch (error) {
    console.error("Error fetching exercise grades:", error);
  } finally {
    loading.value = false;
  }
};

watch(selectedCourseId, () => {
  if (viewMode.value === 'course') {
    fetchCourseGrades();
  } else {
    fetchExercises();
  }
  selectedExerciseId.value = '';
  exerciseGrades.value = null;
});

watch(selectedExerciseId, () => {
  if (selectedExerciseId.value) {
    fetchExerciseGrades();
  }
});

watch(viewMode, () => {
  if (viewMode.value === 'course') {
    fetchCourseGrades();
  } else {
    fetchExercises();
  }
});

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
:deep(.v-data-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.v-data-table__thead) {
  background-color: rgb(249, 250, 251);
}

:deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  text-transform: none !important;
  white-space: nowrap;
}

:deep(.v-data-table-footer) {
  background-color: rgb(249, 250, 251);
}
</style>
