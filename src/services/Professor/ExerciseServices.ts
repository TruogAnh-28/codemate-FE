import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { IResponseData } from "@/modals/apis/response";

import { ExerciseCodeRequest,ExerciseCodeResponse, ExerciseQuizResponse, ExerciseQuizRequest } from "@/types/Exercise";
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
    async deleteExerciseQuiz(
        { showError, showSuccess }: AuthConfig,
        exercise_id: string,
    ) {
        return await ApiService.delete<IResponseData<ExerciseQuizResponse>>(
            `exercises/${exercise_id}/quizzes`,
            { showError, showSuccess }
        );
    },
    async postExerciseCode(
        { showError, showSuccess }: AuthConfig,
        payload: ExerciseCodeRequest
      ) {
        return await ApiService.post<IResponseData<ExerciseCodeResponse>>(
          `exercises/code`,
          payload,
          { showError, showSuccess }
        );
      },
      async getExerciseCode(
        { showError, showSuccess }: AuthConfig,
        exercise_id: string,
      ) {
        return await ApiService.get<IResponseData<ExerciseCodeResponse>>(
          `exercises/${exercise_id}/code`,
          "",
          { showError, showSuccess }
        );
      },
      async editExerciseCode(
        { showError, showSuccess }: AuthConfig,
        exercise_id: string,
        payload: ExerciseCodeRequest
      ) {
        return await ApiService.put<IResponseData<ExerciseCodeResponse>>(
          `exercises/${exercise_id}/code`,
          payload,
          { showError, showSuccess }
        );
      },
      async deleteExerciseCode(
        { showError, showSuccess }: AuthConfig,
        exercise_id: string,
      ) {
        return await ApiService.delete<IResponseData<ExerciseCodeResponse>>(
          `exercises/${exercise_id}/code`,
          { showError, showSuccess }
        );
      }
};
