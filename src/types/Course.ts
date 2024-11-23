import { UUID, DateString, DateTimeString, DocumentType, Status} from "@/utils/commonType"
export interface CoursesListDashBoardRequest{
  student_id: UUID
  offset: number
  page_size: number
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
  status: string
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
  course_id: UUID
  student_id: UUID
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
