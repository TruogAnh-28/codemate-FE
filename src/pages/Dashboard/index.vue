<template>
  <div class="p-6 space-y-8 bg-gray-50">
    <!-- Main Dashboard Layout -->
    <div class="flex space-x-6">
      <!-- Left Column -->
      <div class="flex flex-col space-y-6 w-1/2">
        <!-- Welcome Section -->
        <v-card
          class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 overflow-hidden"
          elevation="3"
        >
          <!-- Decorative Elements -->
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full transform -translate-y-16 translate-x-16"
          />
          <div
            class="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100/30 rounded-full transform translate-y-12 -translate-x-8"
          />

          <!-- Content -->
          <v-card-text class="relative z-10 p-6">
            <div class="space-y-4">
              <div class="space-y-1">
                <h2 class="text-2xl font-semibold text-gray-800">
                  Welcome back,
                </h2>
                <p class="text-xl text-blue-600 font-medium">
                  Swetha Shankaresh
                </p>
              </div>

              <p class="text-gray-600 leading-relaxed">
                Glad to see you again! Keep up the momentum in your
                <span class="font-medium">Data Science Basics</span> course.
              </p>

              <v-btn
                variant="text"
                color="primary"
                class="px-4 py-2 mt-2 font-medium hover:bg-blue-50 transition-colors"
              >
                Tap to learn
                <v-icon end icon="mdi-arrow-right" class="ml-1" />
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Feedback Section -->
        <v-card
          class="border border-primary/20 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
          elevation="1"
        >
          <v-card-text class="p-4">
            <div class="flex items-start space-x-4">
              <v-icon color="error" size="28" class="mt-1"
                >mdi-help-circle</v-icon
              >
              <div class="flex-grow">
                <p class="text-lg font-medium text-gray-800">Need help?</p>
                <p class="text-gray-600">Please send us your feedback</p>
              </div>
            </div>
            <v-btn
              block
              class="mt-4 bg-primary text-white font-medium"
              elevation="1"
              @click="openFeedback"
            >
              Send Feedback
            </v-btn>
          </v-card-text>
        </v-card>
      </div>

      <!-- Activity Display Section -->
      <v-card class="flex-1 rounded-lg overflow-hidden" elevation="2">
        <v-card-title class="py-4 px-6 bg-gray-50 border-b">
          <h3 class="text-xl font-semibold text-gray-800">Recent Activity</h3>
        </v-card-title>
        <v-list class="max-h-96 overflow-y-auto px-2">
          <ActivityItem
            v-for="activity in activities"
            :key="activity.id"
            :icon="activity.icon"
            :description="activity.description"
            :timestamp="activity.timestamp"
            :iconColor="activity.iconColor"
          />
        </v-list>
      </v-card>
    </div>

    <!-- Courses Section -->
    <v-card class="rounded-lg overflow-hidden" elevation="2">
      <!-- Fixed header with original layout -->
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800">Courses</h3>
          <v-btn variant="text" color="secondary" :to="`/courselist`">
            View Details
          </v-btn>
        </div>

        <!-- Table Header -->
        <div
          class="flex justify-between items-center py-3 border-b border-gray-200 font-medium text-gray-700"
        >
          <span class="w-1/3">Course Name</span>
          <span class="w-1/4">Members</span>
          <span class="w-1/4">Progress</span>
        </div>

        <!-- Table Body -->
        <div class="max-h-80 overflow-y-auto">
          <div
            v-for="course in courses"
            :key="course.id"
            class="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-0"
          >
            <!-- Course Name and Image -->
            <div class="flex items-center w-1/3 space-x-3">
              <v-img
                :max-width="50"
                :max-height="50"
                :src="course.image"
                class="rounded-lg"
                cover
              >
                <template v-slot:error>
                  <v-img
                    :max-width="50"
                    :max-height="50"
                    src="../../assets/default-course-avt.svg"
                    alt="Course Avatar"
                    class="rounded-lg"
                    cover
                  />
                </template>
              </v-img>
              <span class="font-medium text-gray-800">{{ course.name }}</span>
            </div>

            <!-- Members (Avatar Stack) -->
            <div class="w-1/4">
              <AvatarStack :students="course.studentList" :maxVisible="3" />
            </div>

            <!-- Progress Bar -->
            <div class="w-1/4">
              <v-progress-linear
                v-model="course.percentageComplete"
                height="15"
                class="mb-4 rounded-lg"
                color="secondary"
              >
                <template #default>
                  <strong class="text-text-primary">
                    {{ String(Math.ceil(Number(course.percentageComplete))) }}%
                  </strong>
                </template>
              </v-progress-linear>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Feedback Dialog -->
    <FeedbackLesson
      v-model:showModal="showFeedbackDialog"
      @feedback-submitted="handleFeedbackSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { CourseReviewData } from "@/constants/course";
import { CourseReview } from "@/types/Course";

const activities = ref([
  {
    id: 1,
    icon: "mdi-book-check",
    iconColor: "primary",
    description: "Completed lesson: Introduction to Data Science",
    timestamp: "1 day ago",
  },
  {
    id: 2,
    icon: "mdi-school",
    iconColor: "secondary",
    description: "Enrolled in the course: Machine Learning Basics",
    timestamp: "2 days ago",
  },
  {
    id: 3,
    icon: "mdi-message-text",
    iconColor: "info",
    description: "Submitted feedback for lesson: Data Visualization Essentials",
    timestamp: "3 days ago",
  },
  {
    id: 4,
    icon: "mdi-trophy",
    iconColor: "success",
    description: "Earned the Data Explorer badge for completing 5 lessons",
    timestamp: "4 days ago",
  },
  {
    id: 5,
    icon: "mdi-forum",
    iconColor: "warning",
    description: "Commented on Understanding Neural Networks discussion",
    timestamp: "5 days ago",
  },
]);

const courses = ref<CourseReview[]>(CourseReviewData);

const showFeedbackDialog = ref(false);

const openFeedback = () => {
  showFeedbackDialog.value = true;
};

const handleFeedbackSubmit = (feedbackData: {
  lessonId: string | null;
  feedback: string;
}) => {
  console.log("Feedback submitted:", feedbackData);
};
</script>
