import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { IResponseData } from "@/modals/apis/response";

import { ExerciseCodeResponse, ExerciseQuizResponse, ExerciseQuizRequest } from "@/types/Exercise";
export const exercisesService = {
    async postExerciseQuiz(
        { showError, showSuccess }: AuthConfig,
        payload: ExerciseQuizResponse
    ) {
        return await ApiService.post<ExerciseQuizResponse>(
            `exercises/quizzes`,
            payload,
            { showError, showSuccess }
        );
    },
    async getExerciseQuiz(
        { showError, showSuccess }: AuthConfig,
        exercise_id: string,
    ) {
        return await ApiService.get<IResponseData<ExerciseQuizResponse>>(
            `exercises/${exercise_id}/quizzes`,
            "",
            { showError, showSuccess }
        );
    },
    async editExerciseQuiz(
        { showError, showSuccess }: AuthConfig,
        exercise_id: string,
        payload: ExerciseQuizRequest
    ) {
        return await ApiService.put<IResponseData<ExerciseQuizResponse>>(
            `exercises/${exercise_id}/quizzes`,
            payload,
            { showError, showSuccess }
        );
    },
    async postExerciseCode(
        { showError, showSuccess }: AuthConfig,
        payload: ExerciseCodeResponse
    ) {
        return await ApiService.post<ExerciseCodeResponse>(
            `exercises/code`,
            payload,
            { showError, showSuccess }
        );
    }
};
