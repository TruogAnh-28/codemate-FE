import { UUID, DateTimeString, ExerciseType } from "@/utils/commonType"
import { FeedbackCategory } from "@/utils/constant"
export interface GetRecentCourseResponse {
  course: string
  course_id: string
  last_accessed: string
}

export interface RecentActivitiesRequest {
  student_id: string
  limit: number
  offset?: number
}
export interface RecentActivitiesResponse {
  activity_id: string;
  activity_description: string;
  activity_type: string;
  activity_date: string;
}
export interface AddActivityRequest {
  type: string
  description: string
}

//-------------------Professor-------------------------
export interface UpcomingEvent {
  exercise_id: UUID;
  exercise_name: string;
  exercise_time_open: DateTimeString;
  exercise_time_close: DateTimeString;
  exercise_type: ExerciseType;
  course_name: string;
  course_id: UUID;
  course_courseID: string
  course_nSemester: number
}

export interface GetDashboardProfessorResponse {
  professor_id: UUID;
  professor_name: string;
  nCourses: number;
  nLessons: number;
  nStudents: number;
  nExercises: number;
  upcoming_events?: UpcomingEvent[];
}

// New types for the enhanced dashboard
export interface StudentActivityResponse {
  activity_id: UUID;
  student_id: UUID;
  student_name: string;
  activity_type: string;
  activity_description: string;
  activity_timestamp: DateTimeString;
  course_id?: UUID;
  course_name?: string;
}

export interface FeedbackSummaryResponse {
  id: UUID;
  student_id: UUID;
  student_name: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  rate: number;
  created_at: DateTimeString;
  course_id?: UUID;
  course_name?: string;
}

export interface PerformanceDistributionResponse {
  excellent: number; // 90-100%
  good: number;      // 75-89%
  average: number;   // 60-74%
  needsImprovement: number; // <60%
}

export interface GetRecentCourseResponse {
  course: string
  course_id: string
  last_accessed: string
}

export interface RecentActivitiesRequest {
  student_id: string
  limit: number
  offset?: number
}

export interface RecentActivitiesResponse {
  activity_id: string;
  activity_description: string;
  activity_type: string;
  activity_date: string;
}

export interface AddActivityRequest {
  type: string
  description: string
}