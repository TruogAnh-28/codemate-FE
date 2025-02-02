
export interface GetRecentCourseResponse {
  course: string
  course_id: string
  last_accessed: string
}

export interface RecentActivitiesRequest{
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
