<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <!-- Course Details Header -->
        <v-card class="p-6">
          <v-row class="align-center">
            <v-col cols="4" class="flex justify-center">
              <!-- Course Avatar -->
              <v-img
                class="flex-shrink-0"
                :max-width="300"
                :max-height="200"
                src="../../../assets/default-course-avt.svg"
                cover
              >
                <template v-slot:error>
                  <v-img
                    :max-width="300"
                    :max-height="200"
                    src="../../../assets/default-course-avt.svg"
                    alt="Course Avatar"
                    cover
                  />
                </template>
              </v-img>
            </v-col>
            <v-col cols="8">
              <div class="text-4xl font-semibold">{{ course.name }}</div>
              <div class="text-gray-600">
                {{ course.percentageComplete }}% Completed
              </div>
            </v-col>
            <v-col cols="8">
              <AvatarStack :avatars="course.studentList" :maxVisible="5"
            /></v-col>
          </v-row>
        </v-card>

        <v-tabs v-model="activeTab" background-color="primary" grow dark>
          <v-tab
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            class="text-secondary font-bold"
          >
            {{ tab.label }}
          </v-tab>
        </v-tabs>

        <v-tab-items>
          <v-tab-item v-if="activeTab === 'description'" :key="'description'">
            <CourseDescription :learning-outcomes="course.learningOutcomes" />
          </v-tab-item>
          <v-tab-item v-if="activeTab === 'lessons'" :key="'lessons'">
            <CourseLessons :lessons="course.lessons" />
          </v-tab-item>
          <v-tab-item v-if="activeTab === 'exercises'" :key="'exercises'">
            <CourseExercises :exercises="course.exercises" />
          </v-tab-item>
          <v-tab-item
            v-if="activeTab === 'recommendlessons'"
            :key="'recommendlessons'"
          >
            <CourseRecommendLessons :course="course" />
          </v-tab-item>
        </v-tab-items>
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
            <v-btn icon color="primary" class="mt-4">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { CourseDetailData } from "@/constants/course";
import { CourseDetail } from "@/types/Course";

// Course Data
const course = ref<CourseDetail>(CourseDetailData);

// Active Tab (initially set to 'description')
const activeTab = ref("description");

// Tabs Configuration
const tabs = [
  { label: "Description", value: "description" },
  { label: "Lessons", value: "lessons" },
  { label: "Exercises", value: "exercises" },
  { label: "Recommend Lessons", value: "recommendlessons" },
];
</script>
