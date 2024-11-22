<template>
  <div class="p-6 space-y-8 bg-gray-50">
    <div class="flex space-x-6">
      <div class="flex flex-col space-y-6 w-1/2">
        <WelcomeCard
          :student-name="User.studentName"
          :recent-course="recentCourse"
        />

        <FeedbackCard @open-feedback="openFeedback" />
      </div>

      <RecentActivityCard :activities="activities" />
    </div>

    <CourseListCard
      :courses="courses"
    />

    <FeedbackLesson
      v-model:showModal="showFeedbackDialog"
      @feedback-submitted="handleFeedbackSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { dashboardService } from '@/services/dashboardService';
import { User } from "@/constants/user";
import { CourseReviewData } from "@/constants/course";
import { RecentActivitiesResponse, RecentActivitiesRequest } from '@/types/Dashboard';
const courses = ref(CourseReviewData);
const activities = ref(<RecentActivitiesResponse[]>[]);
const recentCourse = ref<string>("");
const showFeedbackDialog = ref(false);

const showError = inject("showError") as (message: string) => void;


const recentActivityRequest: RecentActivitiesRequest = {
  student_id: User.id,
  limit: 5,
  offset: 0,
}
const fetchRecentCourse = async () => {
  recentCourse.value = await dashboardService.fetchStudentWelcome(showError, User.id) || "";
};

const fetchRecentActivities = async () => {
  activities.value = await dashboardService.fetchRecentActivities(showError, recentActivityRequest) || [];
};

const openFeedback = () => {
  showFeedbackDialog.value = true;
};

const handleFeedbackSubmit = (feedbackData: {
  lessonId: string | null;
  feedback: string;
}) => {
  console.log("Feedback submitted:", feedbackData);
};

onMounted(() => {
  fetchRecentCourse();
  fetchRecentActivities();
});
</script>
