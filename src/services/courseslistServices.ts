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
  CoursesAdminListPaginatedResponse,
  GetAvailableCourses
} from "@/types/Course";
import { AuthConfig } from "./authenServices";
import { IResponseData } from "@/modals/apis/response";

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search_query?: string;
  nCredit?: number;
  nSemester?: number;
  start_date?: string;
  end_date?: string;
}


export const coursesService = {
  async fetchCoursesList({ showError, showSuccess, ...params }: AuthConfig & PaginationParams) {
    return await ApiService.query<CoursesListPaginatedResponse>(
      "courses/student",
      params,
      { showError, showSuccess }
    );
  },

  async fetchAdminCoursesList({ showError, showSuccess, ...params }: AuthConfig & PaginationParams) {
    return await ApiService.query<IResponseData<CoursesAdminListPaginatedResponse>>(
      "courses/admin",
      params,
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
    course: CreateCourseRequest[]
  ) {
    return await ApiService.post<CreateCourseResponse>("courses/", course, {
      showError,
      showSuccess,
    });
  },
  async countCourses({ showError, showSuccess }: AuthConfig) {
    return await ApiService.query<IResponseData<number>>(
      "courses/count/",
      undefined,
      { showError, showSuccess }
    );
  },
  async getAvailableCourses({ showError, showSuccess }: AuthConfig) {
    return await ApiService.get<IResponseData<GetAvailableCourses[]>>(
      "courses/available/",
      undefined,
      { showError, showSuccess }
    );
  },
};
