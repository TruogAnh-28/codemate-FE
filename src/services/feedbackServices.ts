import ApiService from "@/common/api.service";
import { IResponseData } from "@/modals/apis/response";
import {
  CreateFeedbackRequest,
  CreateFeedbackResponse,
} from "@/types/Feedback";

export interface AuthConfig {
  showError: (message: string) => void;
  showSuccess?: (message: string) => void;
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
};
