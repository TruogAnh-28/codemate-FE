<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="p-6">
          <v-row no-gutters align="center">
            <!-- Course Avatar -->
            <v-col
              cols="4"
              md="4"
              class="flex justify-center items-center pr-4"
            >
              <!-- Tailwind pr-4 for spacing -->
              <v-img height="200" max-width="300" :src="course.image">
                <template v-slot:error>
                  <v-img
                    height="200"
                    max-width="300"
                    src="../../../assets/default-course-avt.svg"
                  ></v-img>
                </template>
              </v-img>
            </v-col>

            <!-- Course Information -->
            <v-col cols="8" md="8">
              <!-- Course Name -->
              <div class="text-heading-1 font-weight-bold mb-2">
                {{ course.name }}
              </div>

              <v-row class="d-flex align-center">
                <!-- Percentage Complete -->
                <v-col cols="12" md="6" class="text-center">
                  <div class="text-heading-1 font-weight-bold mb-1">
                    {{ course.percentageComplete }}%
                  </div>
                  <v-chip color="success" outlined small class="text-body-small-1">
                    <v-icon left size="18">mdi-check-circle</v-icon>
                    Completed
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
        </v-card>

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
      </v-col>

      <!-- Recommend Learning Card -->
      <v-col cols="12" md="4">
        <v-card class="p-6">
          <div class="flex justify-center">
            <v-avatar size="120" class="bg-secondary-variant">
              <v-icon size="56">mdi-check-circle</v-icon>
            </v-avatar>
          </div>
          <div class="text-center mt-4">
            <h3 class="font-semibold text-xl">Join our Recommend Learning</h3>
            <p class="text-text-tetiary mt-2">
              Tailored lessons to reach your goals, one step at a time.
            </p>
            <v-btn icon color="primary" class="mt-4" @click="openModal">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
      <GetGoalsModal
        :dialog="dialog"
        @update:dialog="(value) => (dialog = value)"
        @submitGoal="handleGoalSubmission"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { CourseDetailData } from "@/constants/course";
import { CourseDetail } from "@/types/Course";

const course = ref<CourseDetail>(CourseDetailData);
const activeTab = ref("description");
const dialog = ref(false);

function calculateTotalDocuments(course: CourseDetail): number {
  return course.lessons.reduce(
    (total, lesson) => total + lesson.documents.length,
    0
  );
}

const openModal = () => {
  dialog.value = true;
};

const handleGoalSubmission = (goal: string) => {
  console.log("Learning Goal Submitted:", goal);
};

const tabs = [
  { label: "Description", value: "description" },
  { label: "Lessons", value: "lessons" },
  { label: "Exercises", value: "exercises" },
  { label: "Recommend Lessons", value: "recommendlessons" },
];
</script>
