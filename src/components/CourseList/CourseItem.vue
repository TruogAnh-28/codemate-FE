<template>
  <v-container>
    <v-row>
      <v-col
        v-for="course in props.courses"
        :key="course.id"
        cols="12"
        class="mb-6"
      >
        <v-card
          class="rounded-lg shadow-md course-card"
          :elevation="2"
          v-ripple
        >
          <div class="d-flex p-4 gap-4 course-content">
            <!-- Course Image with zoom effect -->
            <div class="image-container">
              <v-img
                class="flex-shrink-0 course-image"
                width="300px"
                height="200px"
                :src="course.image"
                cover
              >
                <template v-slot:error>
                  <v-img
                    width="300px"
                    height="200px"
                    src="../../assets/default-course-avt.svg"
                    alt="Course Avatar"
                    cover
                  />
                </template>
              </v-img>
            </div>

            <!-- Middle Content with fixed width -->
            <div class="flex-grow-1 middle-content">
              <div class="mb-4 course-header">
                <h3 class="text-body-large-1 font-bold text-wrap mb-1 course-title">
                  {{ course.name }}
                </h3>
                <p class="text-body-small-1 text-text-tetiary course-date">
                  {{ formatStart_EndDate(course.start_date)  }} to {{ formatStart_EndDate(course.end_date)  }}
                </p>
              </div>

              <AvatarStack
                :students="course.student_list"
                :max-visible="3"
                class="avatar-stack"
              />
            </div>

            <!-- Learning Outcomes with fixed width -->
            <div class="outcomes-section">
              <LearningOutcomes :outcomes="course.learning_outcomes" :nameCourse="course.name" />
            </div>

            <!-- Professor Info and Status -->
            <div class="d-flex flex-column justify-space-between align-end info-section">
              <div class="text-end mb-2">
                <p class="text-body-base-4 mb-4 professor-info">
                  <strong>Professor:</strong>
                  {{ course.professor.professor_name }}
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
  </v-container>
</template>

<script lang="ts" setup>
import { CoursesListResponse } from "@/types/Course";
import { renderStatusLabel } from "@/utils/functions/render";
import { formatStart_EndDate } from "@/utils/functions/time";
const props = defineProps<{
  courses: CoursesListResponse[];
}>();

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
  -webkit-line-clamp: 2;
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
