import { DateString, DateTimeString, DocumentType, Status} from "@/utils/commonType"

export interface StudentReview {
  name: string,
  email: string,
  studentId: string,
  avatar: string
}

export interface CourseReview {
  id: string
  name: string
  startDate: DateString
  endDate: DateString
  studentList: StudentReview[]
  learningOutcomes: string[]
  professor: string
  status: Status
  image: string
  percentageComplete: string
}

export interface CourseRecent {
  id: string
  name: string
  learningOutcomes: string[]
  lastAccessed: DateTimeString
  percentageComplete: string
  status: Status
}

export interface CourseDetail {
  id: string
  name: string
  learningOutcomes: string[]
  professor: string
  startDate: DateString
  endDate: DateString
  status: Status
  percentageComplete: string
  image: string
  lastAccessed: DateTimeString
  studentList: StudentReview[]
  lessons: Lesson[]
  exercises: Exercise[]
  recommendedLessons: RecommendedLesson[]
  completedLessons: string
  timeSpent: string
  assignmentsDone: string

}
export interface Lesson {
  id: string
  name: string
  description: string
  documents: Document[]
  bookmarked: boolean
}

export interface Document {
  id: string
  name: string
  type: DocumentType
  documentUrl: string
}

export interface Exercise {
  id: string
  name: string
  description: string
  questions: Question[]
  status: Status
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

export interface RecommendedLesson {
  id: string
  lessonId: string
  bookmarked: boolean
}
