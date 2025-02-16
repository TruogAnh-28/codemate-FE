import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import {
    GetCoursesListResponse,
    GetExercisesListResponse,
    GetCourseGradesResponse,
    GetExerciseGradesResponse,
} from "@/types/ProgressTracking";

export const progressServices = {
    async fetchCoursesList({ showError, showSuccess }: AuthConfig) {
        return await ApiService.query<GetCoursesListResponse>(
            "teacher_progress_tracking/courses",
            { showError, showSuccess }
        );
    },
    async fetchExercisesList(
        { showError, showSuccess }: AuthConfig,
        course_id: string
    ) {
        return await ApiService.query<GetExercisesListResponse>(
            `teacher_progress_tracking/courses/${course_id}/exercises`,
            { showError, showSuccess }
        );
    },
    async fetchCourseGrades(
        { showError, showSuccess }: AuthConfig,
        course_id: string) {
        return await ApiService.query<GetCourseGradesResponse>(
            `teacher_progress_tracking/courses/${course_id}/grades`,
            { showError, showSuccess }
        );
    },
    async fetchExerciseGrades(
        { showError, showSuccess }: AuthConfig,
        course_id: string,
        exercise_id: string,
    ) {
        return await ApiService.query<GetExerciseGradesResponse>(
            `teacher_progress_tracking/courses/${course_id}/exercies/${exercise_id}/grades`,
            { showError, showSuccess }
        );
    },
};
