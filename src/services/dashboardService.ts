import ApiService from "@/common/api.service";
import {
  GetRecentCorseRespounse,
  RecentActivitiesResponse,
  AddActivityRequest,
} from "@/types/Dashboard";
import { AuthConfig } from "./authenServices";
export const dashboardService = {
  async fetchRecentCourse({ showError, showSuccess }: AuthConfig) {
    return await ApiService.get<GetRecentCorseRespounse>(
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
    return await ApiService.post<boolean>("dashboard/student-activities/", request, {
      showError,
      showSuccess,
    });
  },
};
