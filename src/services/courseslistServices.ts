import ApiService from "@/common/api.service";
import {
  CoursesListDashBoardRequest,
  CoursesListPaginatedResponse,
  CourseDetailResponse,
} from "@/types/Course";
export const coursesService = {
  async fetchCoursesList(
    showError: (message: string) => void,
    request: CoursesListDashBoardRequest
  ) {
    try {
      const response = await ApiService.post<CoursesListPaginatedResponse>(
        "courses/",
        request,
        showError
      );

      if (response && response.data && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to fetch courses.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      return null;
    }
  },
  async fetchCourseDetail(
    showError: (message: string) => void,
    course_id: string,
    student_id: string
  ) {
    try {
      const response = await ApiService.get<CourseDetailResponse>(
        `courses/${course_id}/students/${student_id}`
      );

      if (response && response.data && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to fetch course detail.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching course detail:", error);
      return null;
    }
  },
  async bookmarkLesson(
    showError: (message: string) => void,
    student_id: string,
    course_id: string,
    lesson_id: string
  ) {
    try {
      const response = await ApiService.put<Boolean>(
        `courses/${course_id}/students/${student_id}/lessons/${lesson_id}/bookmark`,
        {}
      );

      if (response && response.isSuccess) {
        return response.data;
      } else {
        console.error("Failed to bookmark lesson.");
        return false;
      }
    } catch (error) {
      console.error("Error bookmarking lesson:", error);
      return false;
    }
  },
};
