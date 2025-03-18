import { UUID, DateTimeString, ExerciseType } from "@/utils/commonType"

export interface GetRecentCorseRespounse {
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