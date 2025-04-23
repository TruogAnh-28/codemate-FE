import ApiService from "@/common/api.service";
import { IResponseData } from "@/modals/apis/response";
import { AuthConfig } from "@/services/authenServices";
import { GetListFeedbackProfessorResponse } from "@/types/Feedback";

export const feedbackServices = {
  async fetchFeedbackProfessor(
    { showError, showSuccess }: AuthConfig,
    course_id: string
  ) {
    return await ApiService.get<
      IResponseData<GetListFeedbackProfessorResponse[]>
    >(`/feedback/courses/${course_id}`, "", { showError, showSuccess });
  },
};
