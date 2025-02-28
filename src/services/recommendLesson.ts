import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { Lesson } from "@/types/Lesson";

export const lessonsService = {
  async fetchRecommendedLesson(
    { showError, showSuccess }: AuthConfig,
    recommendLessonId: string
  ) {
    return await ApiService.get<Lesson>(
      `recommend_lessons/${recommendLessonId}`,
      "",
      { showError, showSuccess }
    );
  },
};
