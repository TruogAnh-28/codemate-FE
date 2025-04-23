import { UUID, DateTimeString, ExerciseType, DifficultyLevel, GradingMethodType } from "@/utils/commonType"
export interface QuizQuestion {
  id: UUID,
  image?: string,
  question: string,
  options: string[],
  correctAnswer: string,
  explanation: string
  chooseUser?: string
}
export interface QuizExercise {
  id: UUID;
  status: 'new' | 'in Progress' | 'completed';
  name: string;
  quizList: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  score?: number;
}
export interface QuizListResponse {
  id: UUID;
  name: string;
  description: string;
  status: 'new' | 'in Progress' | 'completed';
  score?: number;
  max_score: number;
  time_limit?: number;
  duration?: number;
  question_count?: number;
}

export interface ModuleQuizResponse {
  module_id: UUID;
  title: string;
  objectives: string[];
  quizzes: QuizListResponse[];
}

export interface QuizQuestionResponse {
  id: UUID;
  question_text: string;
  question_type: string;
  image?: string;
  options: string[];
  correct_answer: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  explanation: string;
  user_choice?: string|string[];
}

export interface QuizExerciseResponse {
  id: UUID;
  name: string;
  description: string;
  status: 'new' | 'on going' | 'completed';
  score?: number;
  max_score: number;
  time_limit?: number;
  duration?: number;
  questions: QuizQuestionResponse[];
}

export interface QuizAnswerRequest {
  quizId: UUID
  answers: (string | "")[];
}
export interface QuizQuestionResult {
  questionId: string;
  isCorrect: boolean;
}

export interface Achievement {
  type: string;
  description: string;
  earned_date: string;
  related_topics: string[];
  difficulty: string;
}

export interface LearningIssue {
  type: string;
  description: string;
  frequency: number;
  related_lessons: string[];
  related_modules: string[];
  last_occurrence: string;
}

export interface QuizScoreResponse {
  quiz_id: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  results: QuizQuestionResult[];
  identified_issues?: LearningIssue[];
  new_achievements?: Achievement[];
}
export interface ClearAnswerResponse {
  success: boolean;
}
export enum QuestionType {
  MultipleChoice = "multiple_choice",
  SingleChoice = "single_choice",
  // TrueFalse = "true_false",
  // FillInTheBlank = "fill_in_the_blank",
  // ShortAnswer = "short_answer",
  // LongAnswer = "long_answer",
  // Matching = "matching",
  // Ordering = "ordering",
  // Essay = "essay",
  // ProblemSolving = "problem_solving",
  // Project = "project",
  // Presentation = "presentation",
  // Report = "report",
  // CaseStudy = "case_study",
  // Other = "other"
}
export interface QuizModal {
  question: string;
  answer: string[];
  options: string[];
  feedback: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  score: number;
}

export interface TestCaseModel {
  inputs: any[];
  output: any;
  is_hidden?: boolean;
  description?: string;
}

export interface CodeModel {
  question: string;
  testcases: TestCaseModel[];
  starter_code?: string;
  solution_code?: string;
  hints?: string[];
  score?: number;
  difficulty?: DifficultyLevel;
  allowed_languages?: string[];
  time_limit_seconds?: number;
  memory_limit_mb?: number;
}
export interface ExerciseQuizRequest {
  name: string;
  description?: string;
  topic?: string;
  questions: QuizModal[];
  max_score?: number;
  type: ExerciseType;
  time_open?: DateTimeString;
  time_close?: DateTimeString;
  time_limit?: number;
  attempts_allowed?: number;
  grading_method: GradingMethodType;
  shuffle_questions?: boolean;
  shuffle_answers?: boolean;
  review_after_completion?: boolean;
  show_correct_answers?: boolean;
  penalty_per_attempt?: number;
  pass_mark?: number;
  course_id: UUID;
}

export interface ExerciseQuizResponse {
  exercise_id: UUID;
  course_id: UUID;
  name: string;
  description?: string;
  topic?: string;
  questions: QuizModal[];
  max_score?: number;
  type: ExerciseType;
  time_open?: DateTimeString;
  time_close?: DateTimeString;
  time_limit?: number;
  attempts_allowed?: number;
  grading_method: GradingMethodType;
  shuffle_questions?: boolean;
  shuffle_answers?: boolean;
  review_after_completion?: boolean;
  show_correct_answers?: boolean;
  penalty_per_attempt?: number;
  pass_mark?: number;
}


export interface ExerciseCodeRequest  {
  name: string;
  description?: string;
  topic?: string;
  type: ExerciseType;
  course_id: string;
  questions: CodeModel[];
  max_score?: number;
  time_open?: DateTimeString;
  time_close?: DateTimeString;
  time_limit?: number;
  attempts_allowed?: number;
  grading_method?: GradingMethodType;
  shuffle_questions?: boolean;
  shuffle_answers?: boolean;
  review_after_completion?: boolean;
  show_correct_answers?: boolean;
  penalty_per_attempt?: number;
  pass_mark?: number;
}

export interface ExerciseCodeResponse extends ExerciseCodeRequest {
  id: string;
}

export interface GetExercisesList{
  id: UUID;
  name: string;
  description: string;
  type: ExerciseType;
  time_open: string;
  time_close: string;
  time_limit: number;
  attempts_allowed: number;
  grading_method: GradingMethodType
}
