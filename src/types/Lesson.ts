import { RecommendLessonMonitor } from "./AI_generate";
import { QuizExercise } from "./Exercise";

import { UUID, DocumentType } from "@/utils/commonType";
export interface GetDocumentsfromLesson {
  id: UUID;
  name: string;
  type: DocumentType;
  document_url: string;
  description: string;
}
export interface Lesson {
  id: string;
  name: string;
  learning_outcomes: string[];
  content: string;
  description: string;
  recommendTime: string;
  progress: number;
  status: string;
  recommend_content: string;
  explain: string;
  modules: Module[];
  start_date?: string;
  end_date?: string;
  duration_notes?: string;
}
export interface Module {
  module_id: string;
  title: string;
  progress: number;
  objectives?: string[];
  quizList?: QuizExercise[];
}

export interface RegenerateRecommendLesson {
  recommended_content: string;
  explain: string;
  start_date: string;
  end_date: string;
  duration_notes: string;
  modules: RegenerateRecommendLesson_Module[];
  recommend_documents: RecommendDocument[];
}

export interface RegenerateRecommendLesson_Module {
  id: string;
  title: string;
  objectives: string[];
  is_supplementary: boolean;
}

export interface RecommendDocument {
  id: string;
  module_id: string;
  content: string;
}

export interface RegenerateRecommendLessonRequest {
  recommend_lesson_id: string;
  analysis_result: RecommendLessonMonitor;
}
