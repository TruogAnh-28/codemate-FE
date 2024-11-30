import ApiService from "@/common/api.service";
import { ModuleQuizResponse,QuizExerciseResponse, ClearAnswerResponse } from "@/types/Exercise";
import { DocumentResponse } from "@/types/Document";
import {QuizScoreResponse,QuizAnswerRequest} from "@/types/Exercise";
export const moduleService = {
  async fetchModuleQuizzes(
    showError: (message: string) => void,
    moduleId: string
  ) {
    try {
      const response = await ApiService.get<ModuleQuizResponse>(
        `modules/${moduleId}/quizzes`
      );

      if (response && response.data && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to fetch module quizzes.");
        showError("Could not fetch the module and quizzes. Please try again.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching module quizzes:", error);
      showError("An error occurred while fetching the module and quizzes.");
      return null;
    }
  },
  async fetchQuizDetails(
    showError: (message: string) => void,
    moduleId: string,
    quizId: string
  ): Promise<QuizExerciseResponse | null> {
    try {
      const response = await ApiService.get<QuizExerciseResponse>(
        `modules/${moduleId}/quizzes/${quizId}`
      );

      if (response && response.data) {
        return response.data;
      } else {
        console.error("Failed to fetch quiz details.");
        showError("Could not fetch the quiz details. Please try again.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      showError("An error occurred while fetching the quiz details.");
      return null;
    }
  },
  async submitQuizAnswers(
    showError: (message: string) => void,
    moduleId: string,
    quizId: string,
    request: QuizAnswerRequest
  ):Promise<QuizScoreResponse | null> {
    try {
      const response = await ApiService.put<QuizScoreResponse>(
        `modules/${moduleId}/quizzes/${quizId}/submit`,
        request
      );
      
      if (response && response.data && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to submit quiz answers.");
        showError("Could not submit quiz answers. Please try again.");
        return null;
      }
    } catch (error) {
      console.log(`Endpoint: modules/${moduleId}/quizzes/${quizId}/submit`);

      console.error("Error submitting quiz answers:", error);
      showError("An error occurred while submitting the quiz answers.");
      return null;
    }
  },
  async clearQuizAnswers(
    showError: (message: string) => void,
    moduleId: string,
    quizId: string
  ): Promise<ClearAnswerResponse> {
    try {
      const response = await ApiService.put<ClearAnswerResponse>(
        `modules/${moduleId}/quizzes/${quizId}/clear`,
        {}
      );
  
      if (response && response.data && response.isSuccess) {
        return response.data; 
      } else {
        console.error("Failed to clear quiz answers.");
        showError("Could not clear quiz answers. Please try again.");
        return { success: false }; 
      }
    } catch (error) {
      console.log(`Endpoint: modules/${moduleId}/quizzes/${quizId}/clear`);
      console.error("Error clearing quiz answers:", error);
      showError("An error occurred while clearing the quiz answers.");
      return { success: false }; 
    }
  },  
  async fetchDocumentDetails(
    showError: (message: string) => void,
    moduleId: string
  ): Promise<DocumentResponse | null> {
    try {
      const response = await ApiService.get<DocumentResponse>(
        `modules/${moduleId}/documents`
      );

      if (response && response.data) {
        return response.data;
      } else {
        console.error("Failed to fetch document details.");
        showError("Could not fetch the document details. Please try again.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching document details:", error);
      showError("An error occurred while fetching the document details.");
      return null;
    }
  },
};
