import ApiService from "@/common/api.service";
import { IResponseData } from "@/modals/apis/response";
import { AuthConfig } from "@/services/authenServices";
import { ProgressTrackingStudent } from "@/types/ProgressTracking";

export const progressTrackingServices = {
  async getProgressTrackingStudent(
    { showError, showSuccess }: AuthConfig,
    requestData: {
      courseId: string;
      student_goal: string;
      lessons: any[];
    }
  ): Promise<IResponseData<ProgressTrackingStudent>> {
    const { courseId, ...requestBody } = requestData;

    return ApiService.post(
      `/progress_tracking/student/${courseId}/assessment`,
      requestBody,
      {
        showError,
        showSuccess,
      }
    );
  },
  async updateTimeSpent(
    { showError, showSuccess }: AuthConfig,
    recommend_lesson_id: string,
    time_spent: string
  ): Promise<
    IResponseData<{
      recommend_lesson_id: string;
      updated_time_spent: string;
    }>
  > {
    return ApiService.post(
      `progress_tracking/student/recommend_lessons/${recommend_lesson_id}/time_spent`,
      { time_spent },
      {
        showError,
        showSuccess,
      }
    );
  },
};
