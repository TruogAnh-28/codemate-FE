import ApiService from "@/common/api.service";
import {
  WelcomeMessageResponse,
  RecentActivitiesResponse,
  RecentActivitiesRequest,
  AddActivityRequest,
} from "@/types/Dashboard";
import {
  CoursesListDashBoardRequest,
  CoursesListPaginatedResponse,
} from "@/types/Course";
export const dashboardService = {
  async fetchStudentWelcome(
    showError: (message: string) => void,
    student_id: string
  ) {
    try {
      const response = await ApiService.get<WelcomeMessageResponse>(
        "dashboard/welcome",
        student_id,
        showError
      );

      if (response && response.data && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to fetch courses.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      return null;
    }
  },
  async fetchRecentActivities(
    showError: (message: string) => void,
    request: RecentActivitiesRequest
  ) {
    try {
      const response = await ApiService.post<RecentActivitiesResponse[]>(
        "dashboard/activities",
        request,
        showError
      );

      if (response && response.data && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to fetch recent activities.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return null;
    }
  },
  async fetchCoursesList(
    showError: (message: string) => void,
    request: CoursesListDashBoardRequest
  ) {
    try {
      const response = await ApiService.post<CoursesListPaginatedResponse>(
        "courses/",
        request,
        showError
      );

      if (response && response.data && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to fetch courses.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      return null;
    }
  },
  async addActivity(
    showError: (message: string) => void,
    request: AddActivityRequest
  ) {
    try {
      const response = await ApiService.post(
        "/activities/",
        request,
        showError
      );

      if (response && response.isSuccess) {
        return true;
      } else {
        console.error("Failed to add activity.");
        return false;
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      return false;
    }
  },
};
