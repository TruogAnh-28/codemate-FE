<template>
  <div class="bg-gray-50 min-h-screen">
    <main class="px-6 py-8">
      <!-- Header Section -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <h1 class="text-3xl font-bold gradient-text">Progress Course</h1>
            <v-select
              v-model="selectedCourseId"
              :items="formattedCourses"
              item-title="formatted_title"
              item-value="course_id"
              label="Select Course"
              variant="outlined"
              density="comfortable"
              class="w-64 rounded-lg transition-all hover:border-primary-lighten-1"
              hide-details
              prepend-icon="mdi-book-open-variant"
            ></v-select>
          </div>
          <div class="flex items-center gap-4">
            <v-btn
              @click="viewMode = 'course'"
              variant="tonal"
              color="primary"
              class="rounded-lg transition-all duration-200 hover:scale-105"
              :class="{ 'bg-primary-lighten-1 text-white': viewMode === 'course' }"
            >
              <v-icon start>mdi-view-dashboard</v-icon>
              Course Overview
            </v-btn>
            <v-btn
              @click="viewMode = 'exercise'"
              variant="tonal"
              color="primary"
              class="rounded-lg transition-all duration-200 hover:scale-105"
              :class="{ 'bg-primary-lighten-1 text-white': viewMode === 'exercise' }"
              :disabled="!selectedCourseId"
            >
              <v-icon start>mdi-file-document</v-icon>
              Exercise Details
            </v-btn>
          </div>
        </div>
      </div>

      <ProgressCourseGrade
        v-if="viewMode === 'course' && selectedCourseId"
        :courseId ="selectedCourseId"
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { progressServices } from "@/services/Professor/ProgressServices";
import type {
  GetCourseGradesResponse,
  GetExerciseGradesResponse,
} from "@/types/ProgressTracking";
import { coursesService } from "@/services/Professor/CourseServices";
import { GetCoursesTitle } from "@/types/Course";
import { GetExercisesList } from "@/types/Exercise";
import "../table.css";

const loading = ref(false);
const viewMode = ref<'course' | 'exercise'>('course');
const selectedCourseId = ref('');
const selectedExerciseId = ref('');
const courses = ref<GetCoursesTitle[]>([]);
const exercises = ref<GetExercisesList[]>([]);
const courseGrades = ref<GetCourseGradesResponse | null>(null);
const exerciseGrades = ref<GetExerciseGradesResponse | null>(null);

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const formattedCourses = computed(() => {
  if (!courses.value || courses.value.length === 0) return [];
  
  return courses.value.map(course => ({
    ...course,
    formatted_title: `[${course.course_nSemester}] ${course.course_name} (${course.course_courseID})`
  }));
});

const fetchCourses = async () => {
  try {
    const response = await coursesService.fetchCoursesTitleList({
      showError,
      showSuccess,
    });

    if ("data" in response && response.data) {
      courses.value = response.data as GetCoursesTitle[];
      if (courses.value.length > 0 && !selectedCourseId.value) {
        selectedCourseId.value = courses.value[0].course_id;
      }
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

const fetchExercises = async () => {
  if (!selectedCourseId.value) return;
  
  try {
    const response = await coursesService.fetchExercisesTitleList(
      { showError, showSuccess },
      selectedCourseId.value
    );

    if ("data" in response && response.data) {
      exercises.value = response.data as GetExercisesList[];
    }
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