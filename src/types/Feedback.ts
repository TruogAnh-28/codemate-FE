import { DateTimeString, UUID } from "@/utils/commonType"
import { FeedbackCategory, FeedbackStatusType, FeedbackType } from "@/utils/constant"


export interface CreateFeedbackRequest {
  type: FeedbackType
  title: string
  category: FeedbackCategory
  description: string
  rate: number
  status: FeedbackStatusType
}

export interface CreateFeedbackResponse {
  id: string
  type: FeedbackType
  title: string
  category: FeedbackCategory
  description: string
  rate: number
  status: FeedbackStatusType
  created_at: DateTimeString
  resolved_at: DateTimeString
}

export interface GetListFeedbackResponse {
  id: string
  type: string
  title: string
  category: string
  description: string
  rate: number
  status: string
  created_at: string
  resolved_at: string
  student_id: string
}

export interface GetListFeedbackProfessorResponse {
  id: UUID;
  type: FeedbackType;
  title: string;
  category: FeedbackCategory;
  description: string;
  rate: number;
  status: FeedbackStatusType;
  created_at: string;
  resolved_at: string;
  student_id: string;
  student_name: string;
  student_email: string;
}