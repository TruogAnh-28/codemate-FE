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
  class_name: string
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
  class_name: string;
  professor_id: string;
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
  image_url: string
  percentage_complete?:number
}

export interface StudentOfCourseListModal {
  student_id: UUID
  student_name: string
  student_email: string
  student_avatar: string
  student_mssv?: string
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
  course_nCredit: number;
  course_nSemester: number;
  course_courseID: string;
  course_class_name: string;
  course_percentage_complete: string
  course_last_accessed: DateTimeString
  completed_lessons: number
  time_spent: string
  percentage_done: number
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
export interface _GetRecommendedLessonsResponse {
  student_goal: string
  lessons: GetRecommendedLessonsResponse[]
}

export interface GetRecommendedLessonsResponse {
  id: string
  learning_path_id: string
  lesson_id: string
  progress: number
  explain: string
  status: string
  start_date: string
  end_date: string
  duration_notes: string
  bookmark: boolean
  modules: Module[]
  lesson_title: string
  order: number
  time_spent?: string
}

export interface Module {
  id: string
  recommend_lesson_id: string
  title: string
  objectives: string[]
  last_accessed: string
  progress: number
}

export interface UpdateCourseRequest {
  name?: string;
  professor_id?: string;
  start_date?: string;  
  end_date?: string; 
  status?: string;
  n_credit?: number;
  n_semester?: number;
  courseID?: string;
  class_name?: string;
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
  id: UUID;
  name: string;
  type: string;
  documentUrl: string;
  description: string;
  lessonId: UUID;
}

export interface CreateNewLessonResponse {
  id: UUID;
  title: string;
  description: string;
  courseId: UUID;
  order: number;
  learningOutcomes?: string[];
  // documents?: DocumentResponse[];
}
export interface CreateNewLessonRequest {
  title: string;
  description: string;
  courseId: UUID;
  learningOutcomes?: string[];
  documents?: File[];
  documentDescriptions?: string[];
}
export interface UpdateLessonRequest {
  lesson_id: UUID;
  title: string;
  description: string;
  courseId: UUID;
  learningOutcomes?: string[];
  // documents?: File[];
  // documentDescriptions?: string[];
}

export interface LessonResponse {
  lessonId: UUID;
  title: string;
  description?: string;
  order: number;
  learning_outcomes?: string[];
  documents?: DocumentResponse[];
}
export interface GetCoursesTitle{
  course_id: UUID; 
  course_name: string;
  course_courseID: string;
  course_nSemester: number;
  course_start_date: DateString;
  course_end_date: DateString;
}

//---------------------------------Admin---------------------------------
export interface GetAvailableCourses{
  courseID: string;
  name: string;
  nCredit: number;
  have_code?: boolean;
}

export interface StudentCourseInfo {
  student_id: string;
  student_mssv?: string | null; // Optional and can be null
  course_id: string;
  last_accessed?: string | null; // Optional and can be null
  completed_lessons?: number | null; // Optional and can be null
  time_spent?: string | null; // Optional and can be null
  percentage_done?: number | null; // Optional and can be null
}

export interface AddStudentsToCourseResponse {
  course_id: string;
  course_name: string;
  added_students_count: number;
  already_enrolled_count: number;
  student_courses_list: StudentCourseInfo[];
}

