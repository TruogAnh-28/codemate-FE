<template>
  <v-container fluid class="py-6">
    <v-row>
      <!-- Main Content -->
      <v-col cols="12" md="8">
        <v-card class="p-6">
          <v-row no-gutters align="center" class="p-6">
            <!-- Course Banner -->
            <v-col
              cols="4"
              md="4"
              class="flex justify-center items-center pr-4"
            >
              <v-img
                :max-height="200"
                :max-width="300"
                src="../../../assets/default-course-avt.svg"
              >
                <template v-slot:error>
                  <v-img
                    :max-height="200"
                    :max-width="300"
                    src="../../../assets/default-course-avt.svg"
                  ></v-img>
                </template>
              </v-img>
            </v-col>

            <!-- Course Information -->
            <v-col cols="8" md="8">
              <!-- Course Name -->
              <div class="text-heading-3 font-weight-bold mb-2">
                {{ course.name }}
              </div>

              <v-row class="d-flex align-center">
                <!-- Percentage Complete -->
                <v-col cols="12" md="6" class="text-center">
                  <div class="text-heading-3 font-weight-bold mb-1">
                    {{ course.percentageComplete }}%
                  </div>
                  <v-chip
                    :color="renderStatusLabel(course.status)"
                    outlined
                    small
                    class="text-body-small-1"
                  >
                    <v-icon left size="18" class="mr-2"
                      >mdi-check-circle</v-icon
                    >
                    {{ course.status }}
                  </v-chip>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="d-flex align-center mb-2 text-body-small-2">
                    <v-icon size="18" color="primary" class="mr-1"
                      >mdi-calendar</v-icon
                    >
                    <span>{{ course.startDate }} to {{ course.endDate }}</span>
                  </div>
                  <div class="d-flex align-center mb-2 text-body-small-2">
                    <v-icon size="18" color="primary" class="mr-1"
                      >mdi-book-open-variant</v-icon
                    >
                    <span>{{ calculateTotalDocuments(course) }} Documents</span>
                  </div>
                  <div class="d-flex align-center mb-2 text-body-small-2">
                    <v-icon size="18" color="primary" class="mr-1"
                      >mdi-account</v-icon
                    >
                    <span>{{ course.professor }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- Tabs Section -->
          <v-tabs v-model="activeTab" bg-color="background" grow dark>
            <v-tab
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              class="text-secondary font-bold"
            >
              {{ tab.label }}
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="description">
              <CourseDescription :learning-outcomes="course.learningOutcomes" />
            </v-window-item>

            <v-window-item value="lessons">
              <CourseLessons :lessons="course.lessons" />
            </v-window-item>

            <v-window-item value="exercises">
              <CourseExercises :exercises="course.exercises" />
            </v-window-item>

            <v-window-item value="recommendlessons">
              <CourseRecommendLessons :course="course" />
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>

      <!-- Ad -->
      <v-col cols="12" md="4">
        <v-card class="rounded-lg">
          <v-card-text class="text-center pa-6">
            <v-avatar size="80" class="mb-4">
              <CheckCircle />
            </v-avatar>

            <h3 class="text-h6 font-weight-bold mb-2">
              Join our Recommended Learning
            </h3>

            <p class="text-body-2 text-grey mb-4">
              Get personalized course recommendations based on your goals and
              interests.
            </p>

            <v-btn
              color="text-primary"
              block
              elevation="2"
              @click="openRecommendationModal"
            >
              Get Recommendations
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Progress Statistics -->
        <v-card class="mt-4 rounded-lg shadow-lg">
          <v-card-text>
            <h4 class="text-xl font-semibold mb-4">Progress Statistics</h4>
            <v-list>
              <v-list-item
                v-for="(stat, index) in progressStats"
                :key="index"
                class="flex items-center justify-between py-3 border-b border-gray-200"
              >
                <template v-slot:prepend>
                  <v-icon :color="stat.color" size="32" class="mr-3">
                    {{ stat.icon }}
                  </v-icon>
                </template>
                <v-list-item-title
                  class="text-body-large-1 font-medium text-gray-800 flex-grow"
                >
                  {{ stat.label }}
                </v-list-item-title>
                <v-list-item-subtitle
                  class="text-body-large-4 text-right text-gray-600"
                >
                  {{ stat.value }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recommendation Modal -->
    <v-dialog v-model="dialog" max-width="500">
      <GetGoalsModal
        :dialog="dialog"
        @update:dialog="dialog = $event"
        @submitGoal="handleGoalSubmission"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { CourseDetail } from "@/types/Course";
import { CourseDetailData } from "@/constants/course";
import CheckCircle from "@/assets/icons/check-circle.vue";
import { renderStatusLabel } from "@/utils/functions/render";

const course = ref<CourseDetail>({ ...CourseDetailData });
const activeTab = ref("description");
const dialog = ref(false);

const progressStats = [
  {
    label: "Completed Lessons",
    value: `${course.value.completedLessons}/${course.value.lessons.length}`,
    icon: "mdi-book-check",
    color: "success",
  },
  {
    label: "Time Spent",
    value: course.value.timeSpent,
    icon: "mdi-clock",
    color: "info",
  },
  {
    label: "Assignments Done",
    value: `${course.value.assignmentsDone}/${course.value.exercises.length}`,
    icon: "mdi-file-check",
    color: "primary",
  },
];

const tabs = [
  {
    label: "Description",
    value: "description",
  },
  {
    label: "Lessons",
    value: "lessons",
  },
  {
    label: "Exercises",
    value: "exercises",
  },
  {
    label: "Recommendations",
    value: "recommendlessons",
  },
];
function calculateTotalDocuments(course: CourseDetail): number {
  return course.lessons.reduce(
    (total, lesson) => total + lesson.documents.length,
    0
  );
}

const openRecommendationModal = () => {
  dialog.value = true;
};

const handleGoalSubmission = (goal: string) => {
  console.log("Learning Goal Submitted:", goal);
  dialog.value = false;
};
</script>
