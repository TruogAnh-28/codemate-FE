import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { IResponseData } from "@/modals/apis/response";
import { GetDashboardProfessorResponse, StudentActivityResponse, FeedbackSummaryResponse } from "@/types/Dashboard";

export const dashboardService = {
  async fetchDashboardProfessor({ showError, showSuccess }: AuthConfig) {
    return await ApiService.query<GetDashboardProfessorResponse>(
      "dashboard/professors",
      { showError, showSuccess }
    );
  },

  // New service to fetch student activities for the professor dashboard
  async fetchStudentActivities({ showError, showSuccess }: AuthConfig, limit: number = 5) {
    return await ApiService.post<IResponseData<StudentActivityResponse[]>>(
      "dashboard/professors/student-activities",
      { limit, showError, showSuccess }
    );
  },

  // New service to fetch recent feedback summaries for the professor dashboard
  async fetchRecentFeedback({ showError, showSuccess }: AuthConfig, courseId?: string, limit: number = 5) {
    const params: any = { limit };
    if (courseId) {
      params.course_id = courseId;
    }
    
    return await ApiService.post<IResponseData<FeedbackSummaryResponse[]>>(
      "feedback/professors",
      params,
      { showError, showSuccess }
    );
  },

  // New service to fetch student performance distribution data
  async fetchStudentPerformance({ showError, showSuccess }: AuthConfig, courseId?: string) {
    const params: any = {};
    if (courseId) {
      params.course_id = courseId;
    }
    
    return await ApiService.query<IResponseData<{
      excellent: number,
      good: number,
      average: number,
      needsImprovement: number
    }>>(
      "dashboard/professors/performance-distribution",
      params,
      { showError, showSuccess }
    );
  }
};