export interface StudentReview {
  name: string,
  email: string,
  studentId: string,
  avatar: string
}

export interface CourseReview {
  id: string
  name: string
  startDate: string
  endDate: string
  studentList: StudentReview[]
  learningOutcomes: string[]
  professor: string
  status: string
  image: string
}

export interface CourseRecent {
  id: string
  name: string
  learningOutcomes: string[]
  lastAccessed: string
  percentageComplete: string
  status: string
}

export interface CourseDetail {
  id: string
  name: string
  learningOutcomes: string[]
  professor: string
  startDate: string
  endDate: string
  status: string
  percentageComplete: string
  image: string
  lastAccessed: string
  studentList: StudentList[]
  lessons: Lesson[]
  exercises: Exercise[]
  recommendedLessons: RecommendedLesson[]
}

export interface StudentList {
  studentId: string
  name: string
  review: string
}

export interface Lesson {
  id: string
  name: string
  description: string
  documents: Document[]
}

export interface Document {
  id: string
  name: string
  type: string
  documentUrl: string
}

export interface Exercise {
  id: string
  name: string
  description: string
  questions: Question[]
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
}
