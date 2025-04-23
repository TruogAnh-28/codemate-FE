import ApiService from "@/common/api.service";
import { IResponseData } from "@/modals/apis/response";
import { LearningPathGenerateRequest, LearningPathGenerateResponse, SuggestGoalsResponse, GenerateQuizRequest, GenerateQuizResponse, RecommendLessonMonitor } from "@/types/AI_generate";

export interface AuthConfig {
  showError: (message: string) => void;
  showSuccess?: (message: string) => void;
}

export const aiGenerateServices = {
  async generateStudentGoals({ showError, showSuccess }: AuthConfig,
    course_id: string
  ) {
    return await ApiService.get<IResponseData<SuggestGoalsResponse>>(
      `ai/generate-student-goals/${course_id}`,
      "",
      { showError, showSuccess }
    );
  },
  async generateLearningPath(
    { showError, showSuccess }: AuthConfig,
    request: LearningPathGenerateRequest
  ) {
    return await ApiService.post<IResponseData<LearningPathGenerateResponse>>("ai/generate-learning-path", request, {
      showError,
      showSuccess,
    });
  },
  async generateQuiz(
    { showError, showSuccess }: AuthConfig,
    request: GenerateQuizRequest
  ) {
    return await ApiService.post<IResponseData<GenerateQuizResponse>>(
      "ai/generate-quiz",
      request,
      {
        showError,
        showSuccess,
      }
    );
  },

  async getMonitorRecommendLesson(
    { showError, showSuccess }: AuthConfig,
    course_id: string,
    recommend_lesson_id: string
  ) {
    return await ApiService.get<IResponseData<RecommendLessonMonitor>>(
      `ai/monitor-study-progress/course/${course_id}/recommend_lesson/${recommend_lesson_id}`,
      "",
      { showError, showSuccess }
    );
  }
}