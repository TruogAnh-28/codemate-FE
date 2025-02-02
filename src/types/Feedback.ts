import { DateTimeString } from "@/utils/commonType"
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
