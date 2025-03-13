import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { CreateNewLessonRequest,LessonResponse,UpdateLessonRequest } from "@/types/Course";

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
    async updateLessonProfessor(
        { showError, showSuccess }: AuthConfig,
        payload: UpdateLessonRequest
    ) {
        const formData = new FormData();
        formData.append("lesson_id", payload.lesson_id);
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
        

        return await ApiService.put(
            `lessons`,
            formData,
            { showError, showSuccess, headers: { "Content-Type": "multipart/form-data" } }
        );
    },
    async getLesson(
        { showError, showSuccess }: AuthConfig,
        lesson_id: string
    ) {
        return await ApiService.get<LessonResponse>(
            `lessons/${lesson_id}`,
            "",
            { showError, showSuccess }
        );
    },
    async deleteLesson(
        { showError, showSuccess }: AuthConfig,
        lesson_id: string
    ) {
        return await ApiService.delete(
            `lessons/${lesson_id}`,
            { showError, showSuccess }
        );
    }
};
