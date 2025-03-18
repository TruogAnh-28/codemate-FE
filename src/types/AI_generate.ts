export interface SuggestGoalsResponse {
  suggested_goals: SuggestedGoal[]
}

export interface SuggestedGoal {
  proficiency_level: "Struggling" | "Average" | "Advanced"
  goal: string
  explanation: string
  key_lessons: string[]
}

export interface LearningPathGenerateRequest{
  course_id: string
  goal: string;
}

export interface LearningPathGenerateResponse {
  learning_path_id: string
  learning_path_start_date: string
  learning_path_end_date: string
  learning_path_objective: string
  learning_path_progress: number
  student_id: string
  course_id: string
  recommend_lessons: LearningPathGenerateRecommendLesson[]
  modules: LearningPathGenerateModule[]
}

export interface LearningPathGenerateRecommendLesson {
  lesson_id: string
  recommended_content: string
  explain: string
  status: string
  progress: number
  bookmark: boolean
  start_date: string
  end_date: string
  duration_notes: string
}

export interface LearningPathGenerateModule {
  recommend_lesson_id: string
  title: string
  objectives: string[]
  last_accessed: string
}