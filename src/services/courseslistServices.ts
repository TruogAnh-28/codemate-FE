import ApiService from "@/common/api.service";
import {
  CoursesListPaginatedResponse,
  CourseDetailResponse,
  GetRecommendedLessonsResponse,
  ProfessorInformation,
  LessonOriginalResponse,
  StudentOfCourseListModal,
  CreateCourseRequest,
  CreateCourseResponse,
} from "@/types/Course";
import { AuthConfig } from "./authenServices";
export const coursesService = {
  async fetchCoursesList({ showError, showSuccess, search_query }: AuthConfig & { search_query?: string }) {
    return await ApiService.query<CoursesListPaginatedResponse>(
      "courses/student",
      search_query ? { search_query } : undefined,
      { showError, showSuccess }
    );
  },
  async fetchCourseDetail(
    { showError, showSuccess }: AuthConfig,
    course_id: string
  ) {
    return await ApiService.get<CourseDetailResponse>(
      `courses/${course_id}`,
      "",
      { showError, showSuccess }
    );
  },
  async getProfessorForCourse(
    { showError, showSuccess }: AuthConfig,
    course_id: string
  ) {
    return await ApiService.get<ProfessorInformation>(
      `courses/${course_id}/professor`,
      "",
      { showError, showSuccess }
    );
  },
  async getLessonsForCourse(
    { showError, showSuccess }: AuthConfig,
    course_id: string
  ) {
    return await ApiService.get<LessonOriginalResponse[]>(
      `courses/${course_id}/lessons`,
      "",
      { showError, showSuccess }
    );
  },
  async getStudentsForCourse(
    { showError, showSuccess }: AuthConfig,
    course_id: string
  ) {
    return await ApiService.get<StudentOfCourseListModal[]>(
      `courses/${course_id}/students`,
      "",
      { showError, showSuccess }
    );
  },
  async getRecommendedLessons(
    { showError, showSuccess }: AuthConfig,
    course_id: string
  ) {
    return await ApiService.get<GetRecommendedLessonsResponse[]>(
      `courses/${course_id}/lessons_recommendation/`,
      "",
      { showError, showSuccess }
    );
  },
  async createCourse(
    { showError, showSuccess }: AuthConfig,
    course: CreateCourseRequest
  ) {
    return await ApiService.post<CreateCourseResponse>("courses/", course, {
      showError,
      showSuccess,
    });
  },
};
