import { UUID, DateTimeString } from "@/utils/commonType"

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
export interface Event {
  exercise_id: UUID;
  exercise_name: string;
  exercise_deadline: DateTimeString;
}

export interface GetDashboardProfessorResponse {
  professor_id: UUID;
  professor_name: string;
  nCourses: number;
  nLessons: number;
  nStudents: number;
  nExercises: number;
  upcoming_events?: Event[];
}