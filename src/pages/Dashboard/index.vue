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
import { RecentActivitiesResponse, RecentActivitiesRequest } from '@/types/Dashboard';
import { CoursesListDashBoardRequest, CoursesListPaginatedResponse } from '@/types/Course';
const courses = ref<CoursesListPaginatedResponse>({
  content: [],
  currentPage: 0,
  pageSize: 0,
  totalRows: 0,
  totalPages: 0
});
const activities = ref(<RecentActivitiesResponse[]>[]);
const recentCourse = ref<string>("");
const showFeedbackDialog = ref(false);

const showError = inject("showError") as (message: string) => void;


const recentActivityRequest: RecentActivitiesRequest = {
  student_id: User.id,
  limit: 5,
  offset: 0,
}

const courseReviewRequest: CoursesListDashBoardRequest = {
  student_id: User.id,
  offset: 0,
  page_size: 10,
}
const fetchRecentCourse = async () => {
  recentCourse.value = await dashboardService.fetchStudentWelcome(showError, User.id) || "";
};

const fetchRecentActivities = async () => {
  activities.value = await dashboardService.fetchRecentActivities(showError, recentActivityRequest) || [];
};


const fetchCoursesList = async () => {
  courses.value = await dashboardService.fetchCoursesList(showError, courseReviewRequest) || {
    content: [],
    currentPage: 0,
    pageSize: 0,
    totalRows: 0,
    totalPages: 0
  };
  console.log(courses.value);
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
  fetchCoursesList();
});
</script>
