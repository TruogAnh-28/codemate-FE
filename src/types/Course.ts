import { UUID, DateString, DateTimeString, DocumentType, Status} from "@/utils/commonType"
import { ExcelFileHeaderToAddCourses } from "@/utils/constant";
export interface CreateCourseResponse {
  course_id: string
  courseID: string
  name: string
  professor_id: string
  start_date: string
  end_date: string
  status: string
  nCredit: number
  nSemester: number
  learning_outcomes: string
  image_url: string
  student_courses_list: StudentCoursesList[]
}

export interface StudentCoursesList {
  student_id: string
  course_id: string
  last_accessed: string
  completed_lessons: number
  time_spent: string
  assignments_done: number
}
export interface CreateCourseRequest_Courses {
  professor_email: string
  name: string
  nCredit: number
  nSemester: number
  student_list: string[]
  courseID: string
}

// export interface ImportData {
//   headers: ExcelFileHeaderToAddCourses;
//   courses: ExcelFileCourse[];
// }

export interface CreateCourseRequest {
  headers: string[]
  courses: CreateCourseRequest_Courses[]
}

export interface CoursesListDashBoardRequest{
  student_id: UUID
  offset?: number
  page_size?: number
  search_query?: string
}
export interface CoursesListPaginatedResponse {
  content: CoursesListResponse[]
  currentPage: number
  pageSize: number
  totalRows: number
  totalPages: number
}

interface CoursesAdminListResponse {
  id: string;
  name: string;
  courseID: string;
  start_date: string;
  end_date: string;
  status: string;
  nCredit: number;
  nSemester: number;
}

export interface CoursesAdminListPaginatedResponse {
  content: CoursesAdminListResponse[]
  currentPage: number
  pageSize: number
  totalRows: number
  totalPages: number
}

export interface CoursesListResponse {
  id: UUID
  name: string
  start_date: DateString
  end_date: DateString
  learning_outcomes: string[]
  status: Status
  last_accessed: DateTimeString
  nCredit: number
  nSemester: number
  courseID: string
  image: string
}

export interface StudentOfCourseListModal {
  student_id: UUID
  student_name: string
  student_email: string
  student_avatar: string
}

export interface ProfessorInformation {
  professor_id: UUID
  professor_name: string
  professor_email: string
  professor_avatar: string
}
export interface CourseDetailResponse {
  course_id: string
  course_name: string
  course_start_date: DateString
  course_end_date: DateString
  course_learning_outcomes: string[]
  course_status: Status
  course_image: string
  course_percentage_complete: string
  course_last_accessed: DateTimeString
  completed_lessons: number
  time_spent: string
  assignments_done: number
}

export interface LessonOriginalResponse {
  id: UUID
  title: string
  description: string
  learning_outcomes: string[]
  order: number
}

export interface ExerciseOriginalResponse {
  id: UUID
  name: string
  description: string
  status: string
  type: string
}

export interface DocumentOriginalResponse {
  id: string
  name: string
  description: string
  type: DocumentType
  url: string
}


export interface GetRecommendedLessonsResponse {
  course_id: string
  course_name: string
  lesson_id: string
  bookmark: boolean
  status: string
  title: string
  description: string
  order: number
}
