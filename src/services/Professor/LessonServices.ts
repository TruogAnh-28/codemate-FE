import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { CreateNewLessonRequest } from "@/types/Course";

export const lessonService = {
    async fetchLessonProfessor(
        { showError, showSuccess }: AuthConfig,
        payload: CreateNewLessonRequest
    ) {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        formData.append("course_id", payload.courseId);
        formData.append("order", payload.order.toString());
        if (payload.learningOutcomes) {
            payload.learningOutcomes.forEach(outcome => {
                if (outcome.trim()) {
                    formData.append("learning_outcomes", outcome.trim());
                }
            });
        }
        if (payload.documents) {
            payload.documents.forEach((file, index) => {
                const description = payload.documentDescriptions?.[index] || "";
                formData.append("description_file", description);
                formData.append("files", file);
            });
        }

        return await ApiService.post(
            "lessons",
            formData,
            { showError, showSuccess, headers: { "Content-Type": "multipart/form-data" } }
        );
    },
};
