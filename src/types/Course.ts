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
