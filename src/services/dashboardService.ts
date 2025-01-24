import ApiService from "@/common/api.service";
import {
  GetRecentCourseResponse,
  RecentActivitiesResponse,
  AddActivityRequest,
} from "@/types/Dashboard";
import { AuthConfig } from "./authenServices";
export const dashboardService = {
  async fetchRecentCourse({ showError, showSuccess }: AuthConfig) {
    return await ApiService.get<GetRecentCourseResponse>(
      "dashboard/student-recent-course",
      "",
      { showError, showSuccess }
    );
  },
  async fetchRecentActivities(
    { showError, showSuccess }: AuthConfig,
  ) {
    return await ApiService.get<RecentActivitiesResponse[]>(
      "dashboard/student-activities",
      "",
      { showError, showSuccess }
    );
  },
  async addActivity(
    { showError, showSuccess }: AuthConfig,
    request: AddActivityRequest
  ) {
    return await ApiService.post("dashboard/student-activities/", request, {
      showError,
      showSuccess,
    });
  },
};
