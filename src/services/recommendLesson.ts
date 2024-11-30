import ApiService from "@/common/api.service";
import { Lesson } from "@/types/Lesson";

export const lessonsService = {
  /**
   * Fetch recommended lesson details by ID.
   * @param showError Function to display error messages.
   * @param recommendLessonId ID of the recommended lesson.
   * @returns Recommended lesson details or null if an error occurs.
   */
  async fetchRecommendedLesson(
    showError: (message: string) => void,
    recommendLessonId: string
  ) {
    try {
      const response = await ApiService.get<Lesson>(
        `recommend_lessons/${recommendLessonId}`
      );

      if (response && response.data && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to fetch recommended lesson.");
        showError("Could not fetch the recommended lesson. Please try again.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching recommended lesson:", error);
      showError("An error occurred while fetching the lesson details.");
      return null;
    }
  },
};
