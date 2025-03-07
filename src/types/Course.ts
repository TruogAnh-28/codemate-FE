import { UUID, DateString, DateTimeString, DocumentType, Status } from "@/utils/commonType"

//---------------------------------Student---------------------------------
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

export interface CreateCourseRequest {
  id: number
  name: string
  professorID: string
  creditNumber: number
  studentIDs: string[]
  nSemester: number
  courseID: string
  startDate: Date
  endDate: Date
}

export interface CoursesListDashBoardRequest {
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

export interface CoursesAdminListResponse {
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
  percentage_complete?:number
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
  course_image_url: string
  course_nCredit: number;
  course_nSemester: number;
  course_courseID: string;
  course_class_name: string;
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
  nDocuments: number
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
  document_url: string
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

//---------------------------------Professor---------------------------------
export interface PutLearningOutcomesCoursesResponse {
  course_id: UUID;
  learning_outcomes: string[];
}

export interface GetDocumentsProfessor {
  id: UUID;
  name: string;
  type: DocumentType;
  document_url: string;
}

export interface GetExercisesProfessor {
  id: UUID;
  name: string;
  description: string;
  type: string;
}

export interface GetLessonProfessor {
  id: UUID;
  title: string;
  description: string;
  order: number;
  documents: GetDocumentsProfessor[];
}

export interface GetProfessorCoursesResponse {
  id: UUID;
  name: string;
  start_date: DateString;
  end_date: DateString;
  student_list: StudentCoursesList[];
  learning_outcomes: string[];
  professor: ProfessorInformation;
  status: Status;
  image_url: string;
  nSemester: number;
  nCredit: number;
  courseID: string;
  class_name: string;
}

export interface GetProfessorCoursesPaginatedResponse {
  content: GetProfessorCoursesResponse[];
  currentPage: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

// export interface GetCourseDetailProfessorResponse {
//   course_id: UUID;
//   course_name: string;
//   course_start_date: DateString;
//   course_end_date: DateString;
//   course_learning_outcomes: string[];
//   course_professor: ProfessorInformation;
//   course_status: Status;
//   course_image: string;
//   exercises: GetExercisesProfessor[];
//   students: StudentCoursesList[];
//   lessons: GetLessonProfessor[];
// }
export interface GetCourseDetailProfessorResponse {
  course_id: UUID;
  course_name: string;
  course_start_date: DateString;
  course_end_date: DateString;
  course_learning_outcomes: string[];
  course_professor: ProfessorInformation;
  course_status: Status;
  course_image_url: string;
  course_nCredit: number;
  course_nSemester: number;
  course_courseID: string;
  course_class_name: string;
  nStudents: number;
  nLessons: number;
  nExercises: number;
  nDocuments: number;
}
export interface DocumentResponse {
  name: string;
  type: string;
  documentUrl: string;
  lessonId: UUID;
}

export interface CreateNewLessonResponse {
  id: UUID;
  title: string;
  description: string;
  courseId: UUID;
  order: number;
  learningOutcomes?: string[];
  documents?: DocumentResponse[];
}
export interface CreateNewLessonRequest {
  title: string;
  description: string;
  courseId: UUID;
  order: number;
  learningOutcomes?: string[];
  documents?: File[];
  documentDescriptions?: string[];
}

export interface PutLessonResponse {
  lessonId: UUID;
  title: string;
  description?: string;
  order: number;
  learningOutcomes?: string[];
}
export interface GetCoursesTitle{
  course_id: UUID; 
  course_name: string;
  course_courseID: string;
  course_nSemester: number;
  course_start_date: DateString;
  course_end_date: DateString;
}
