import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import {
    GetCourseGradesResponse,
    GetExerciseGradesResponse,
} from "@/types/ProgressTracking";

export const progressServices = {
    
    async fetchCourseGrades(
        { showError, showSuccess }: AuthConfig,
        course_id: string) {
        return await ApiService.query<GetCourseGradesResponse>(
            `professor_progress_tracking/courses/${course_id}/grades`,
            { showError, showSuccess }
        );
    },
    async fetchExerciseGrades(
        { showError, showSuccess }: AuthConfig,
        course_id: string,
        exercise_id: string,
    ) {
        return await ApiService.query<GetExerciseGradesResponse>(
            `professor_progress_tracking/courses/${course_id}/exercises/${exercise_id}/grades`,
            { showError, showSuccess }
        );
    },
};
