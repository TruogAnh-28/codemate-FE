import ApiService from "@/common/api.service";
import { IResponseData } from "@/modals/apis/response";
import { AuthConfig } from "@/services/authenServices";
import {
  Lesson,
  RegenerateRecommendLesson,
  RegenerateRecommendLessonRequest,
} from "@/types/Lesson";

export const lessonsService = {
  async fetchRecommendedLesson(
    { showError, showSuccess }: AuthConfig,
    recommendLessonId: string
  ) {
    return await ApiService.get<IResponseData<Lesson>>(
      `recommend_lessons/${recommendLessonId}`,
      "",
      { showError, showSuccess }
    );
  },
  async regenerateRecommendedLesson(
    { showError, showSuccess }: AuthConfig,
    lessonId: string,
    request: RegenerateRecommendLessonRequest
  ) {
    return await ApiService.post<IResponseData<RegenerateRecommendLesson>>(
      `ai/regenerate-lesson-content`,
      request,
      { showError, showSuccess }
    );
  },
};
