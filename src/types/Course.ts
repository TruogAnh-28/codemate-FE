import { UUID, DateString, DateTimeString, DocumentType, Status} from "@/utils/commonType"
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

export interface CoursesListResponse {
  id: UUID
  name: string
  start_date: DateTimeString
  end_date: DateTimeString
  student_list: StudentOfCourseListModal[]
  learning_outcomes: string[]
  professor: ProfessorInformation
  status: Status
  image: string
  percentage_complete: string
  last_accessed: DateTimeString
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
  course_professor: ProfessorInformation
  course_status: Status
  course_image: string
  course_percentage_complete: string
  course_last_accessed: string
  completed_lessons: number
  time_spent: string
  assignments_done: number
  lessons: LessonOriginalResponse[]
}

export interface LessonOriginalResponse {
  id: UUID
  title: string
  description: string
  lesson_type: string
  bookmark: boolean
  order: number
  status: string
  exercises: ExerciseOriginalResponse[]
  documents: DocumentOriginalResponse[]
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
