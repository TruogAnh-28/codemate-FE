import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { DocumentOriginalResponse } from "@/types/Course";
import { IResponseData } from "@/modals/apis/response";
export const lessonService = {
    async getDocumentsfromLesson(
        { showError, showSuccess }: AuthConfig,
        lesson_id: string
    ) {
        return await ApiService.query<IResponseData<DocumentOriginalResponse[]>>(
            `lessons/${lesson_id}/documents`,
            { showError, showSuccess }
        );
    },
};
