import ApiService from "@/common/api.service";
import { IResponseData } from "@/modals/apis/response";
import {
  CreateFeedbackRequest,
  CreateFeedbackResponse,GetListFeedbackResponse
} from "@/types/Feedback";

export interface AuthConfig {
  showError: (message: string) => void;
  showSuccess?: (message: string) => void;
}

interface GetFeedbackParams {
  month?: number;
  year?: number;
  feedback_type?: 'system' | 'course';
  status?: 'pending' | 'in_progress' | 'resolved';
  category?: 'user_interface' | 'feature_request' | 'bug_report' | 'performance' | 'others';
  start_date?: string;
  end_date?: string;
}

export const feedbackServices = {
  async sendFeedback(
    { showError, showSuccess }: AuthConfig,
    request: CreateFeedbackRequest
  ) {
    return ApiService.post<IResponseData<CreateFeedbackResponse>>(
      "/feedback/",
      request,
      {
        showError,
        showSuccess,
      }
    );
  },
  async getListFeedbacks(
    params?: GetFeedbackParams,
    config: { showError?: (message: string) => void; showSuccess?: (message: string) => void } = {}
  ) {
    const queryParams: Record<string, string | number> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams[key] = value;
        }
      });
    }

    return ApiService.query<IResponseData<GetListFeedbackResponse[]>>(
      "/feedback",
      queryParams,
      {
        showError: config.showError,
        showSuccess: config.showSuccess,
      }
    );
  },
  async updateFeedback(
    { showError, showSuccess }: AuthConfig,
    feedbackId: string,
    request: {status: string}
  ) {
    return ApiService.update<IResponseData<boolean>>(
      `/feedback`,
      feedbackId,
      request,
      {
        showError,
        showSuccess,
      }
    )
  },
  async deleteFeedback( 
    { showError, showSuccess }: AuthConfig,
    feedbackId: string
  ) {
    return ApiService.delete<IResponseData<boolean>>(
      `/feedback/${feedbackId}/`,
      {
        showError,
        showSuccess,
      }
    );
  }
};
