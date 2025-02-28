import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import {
    GetListFeedbackProfessorResponse,
} from "@/types/Feedback";

export const feedbackServices = {
    async fetchFeedbackProfessor({ showError, showSuccess }: AuthConfig,
        course_id: string) {
        return await ApiService.query<GetListFeedbackProfessorResponse[]>(
            `feedback/courses/${course_id}`,
            { showError, showSuccess }
        );
    },
};
