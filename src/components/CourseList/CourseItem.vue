<template>
  <v-container>
    <v-row v-if="props.courses.length > 0">
      <v-col
        v-for="course in coursesWithProfessors"
        :key="course.id"
        cols="12"
        class="mb-6"
      >
        <v-card class="rounded-lg shadow-md course-card" :elevation="2" v-ripple>
          <div class="d-flex p-4 gap-4 course-content">
            <div class="image-container">
              <template v-if="course.image">
                <v-img
                  class="flex-shrink-0 course-image"
                  width="150px"
                  height="150px"
                  :src="course.image"
                  cover
                >
                  <template v-slot:error>
                    <CourseInitialAvatar :course-name="course.name" />
                  </template>
                </v-img>
              </template>
              <template v-else>
                <CourseInitialAvatar :course-name="course.name" />
              </template>
            </div>

            <div class="flex-grow-1 middle-content">
              <div class="mb-4 course-header">
                <h3 class="text-body-large-1 font-bold text-wrap mb-1 course-title">
                  {{ course.name }}
                </h3>

                <p
                  v-if="course.start_date !== 'None' && course.end_date !== 'None'"
                  class="text-body-small-1 text-wrap"
                >
                  {{ formatStart_EndDate(course.start_date) }} to
                  {{ formatStart_EndDate(course.end_date) }}
                </p>
                <p v-else class="text-body-small-1 text-wrap">
                  Your professor haven't set the start and end date yet
                </p>
              </div>

              <AvatarStack :courses="course" :max-visible="3" class="avatar-stack" />
            </div>

            <!-- Learning Outcomes with fixed width -->
            <div class="outcomes-section">
              <LearningOutcomes
                :outcomes="course.learning_outcomes"
                :nameCourse="course.name"
              />
            </div>
            <!-- Professor Info and Status -->
            <div class="d-flex flex-column justify-space-between align-end info-section">
              <div class="text-end mb-2">
                <p class="text-body-base-4 mb-4 professor-info">
                  <strong>Professor:</strong>
                  {{ course.professorInfo?.professor_name || "N/A" }}
                </p>
                <v-chip
                  :color="renderStatusLabel(course.status)"
                  outlined
                  small
                  class="text-body-small-1 status-chip"
                >
                  <v-icon left size="18" class="mr-2 status-icon">
                    mdi-check-circle
                  </v-icon>
                  {{ course.status }}
                </v-chip>
              </div>
            </div>

            <!-- View Course Button with hover effect -->
            <v-btn
              color="secondary"
              :to="`/courselist/course/${course.id}`"
              rounded
              class="view-button"
            >
              View Course
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-card class="rounded-lg shadow-md p-6">
          <h3 class="text-heading-4 font-semibold text-center">
            You have not enrolled any courses
          </h3>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { coursesService } from "@/services/courseslistServices";
import { CoursesListResponse, ProfessorInformation } from "@/types/Course";
import { renderStatusLabel } from "@/utils/functions/render";
import { formatStart_EndDate } from "@/utils/functions/time";

const props = defineProps<{
  courses: CoursesListResponse[];
}>();
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Reactive array to store courses with their professor information
const coursesWithProfessors = ref<
  (CoursesListResponse & { professorInfo?: ProfessorInformation })[]
>([]);

// Function to fetch professor for a single course
const fetchProfessorForCourse = async (courseId: string) => {
  try {
    const response = await coursesService.getProfessorForCourse(
      { showError, showSuccess },
      courseId
    );

    if (response && "data" in response && response.data) {
      return response.data as ProfessorInformation;
    }
    return undefined;
  } catch (error) {
    showError("Failed to fetch professor information");
    return undefined;
  }
};

// Function to fetch professors for all courses
const fetchProfessorsForCourses = async () => {
  // Create a copy of courses to modify
  const coursesWithProfs = [...props.courses];

  // Use Promise.all to fetch professors concurrently
  const professorPromises = coursesWithProfs.map((course) =>
    fetchProfessorForCourse(course.id)
  );

  const professorResults = await Promise.all(professorPromises);

  // Combine courses with their respective professor information
  coursesWithProfessors.value = coursesWithProfs.map((course, index) => ({
    ...course,
    professorInfo: professorResults[index],
  }));
};

// Fetch professors when component mounts
onMounted(() => {
  fetchProfessorsForCourses();
});
</script>

<style scoped>
.course-card {
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.course-content {
  position: relative;
  height: 200px;
}

.image-container {
  width: 300px;
  overflow: hidden;
  border-radius: 8px;
}

.course-image {
  transition: transform 0.5s ease;
}

.image-container:hover .course-image {
  transform: scale(1.05);
}
.middle-content {
  width: 300px; /* Fixed width */
  padding: 0 16px;
}

.course-title {
  position: relative;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.outcomes-section {
  width: 400px; /* Fixed width */
  padding: 0 16px;
}

.info-section {
  width: 200px; /* Fixed width */
  padding: 0 16px;
}

.professor-info {
  transition: transform 0.3s ease;
}

.professor-info:hover {
  transform: translateX(-4px);
}

.status-chip {
  transition: all 0.3s ease;
}

.status-chip:hover {
  transform: scale(1.05);
}

.status-icon {
  transition: transform 0.3s ease;
}

.status-chip:hover .status-icon {
  transform: rotate(360deg);
}

.view-button {
  position: absolute;
  bottom: 16px;
  right: 16px;
  transition: all 0.3s ease;
}

.view-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-stack {
  transition: transform 0.3s ease;
}

.avatar-stack:hover {
  transform: translateX(4px);
}
</style>
