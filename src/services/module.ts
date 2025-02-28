import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { ModuleQuizResponse, QuizExerciseResponse, ClearAnswerResponse } from "@/types/Exercise";
import { DocumentResponse } from "@/types/Document";
import { QuizScoreResponse, QuizAnswerRequest } from "@/types/Exercise";

export const moduleService = {
  async fetchModuleQuizzes(
    { showError, showSuccess }: AuthConfig,
    moduleId: string
  ) {
    return await ApiService.get<ModuleQuizResponse>(
      `modules/${moduleId}/quizzes`,
      "",
      { showError, showSuccess }
    );
  },

  async fetchQuizDetails(
    { showError, showSuccess }: AuthConfig,
    moduleId: string,
    quizId: string
  ) {
    return await ApiService.get<QuizExerciseResponse>(
      `modules/${moduleId}/quizzes/${quizId}`,
      "",
      { showError, showSuccess }
    );
  },

  async submitQuizAnswers(
    { showError, showSuccess }: AuthConfig,
    moduleId: string,
    quizId: string,
    request: QuizAnswerRequest
  ) {
    return await ApiService.put<QuizScoreResponse>(
      `modules/${moduleId}/quizzes/${quizId}/submit`,
      request,
      { showError, showSuccess }
    );
  },

  async clearQuizAnswers(
    { showError, showSuccess }: AuthConfig,
    moduleId: string,
    quizId: string
  ) {
    return await ApiService.put<ClearAnswerResponse>(
      `modules/${moduleId}/quizzes/${quizId}/clear`,
      {},
      { showError, showSuccess }
    );
  },
  
  async fetchDocumentDetails(
    { showError, showSuccess }: AuthConfig,
    moduleId: string
  ) {
    return await ApiService.get<DocumentResponse>(
      `modules/${moduleId}/documents`,
      "",
      { showError, showSuccess }
    );
  }
};