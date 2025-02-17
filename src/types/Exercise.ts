import { UUID, DateTimeString, ExerciseType, DifficultyLevel } from "@/utils/commonType"
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
  status: 'new' | 'on going' | 'completed';
  name: string;
  quizList: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  score?: number;
}
export interface QuizList {
  id: UUID;
  name: string;
  status: 'new' | 'on going' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
  score?: number;
}

export interface ModuleQuizResponse {
  module_id: UUID;
  title: string;
  objectives: string[];
  quizzes: QuizList[];
}
export interface QuizQuestionResponse {
  id: UUID;
  question: string;
  image?: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  user_choice?: string;
}

export interface QuizExerciseResponse {
  id: UUID;
  name: string;
  status: string;
  difficulty: string;
  score: number;
  questions: QuizQuestionResponse[];
}
export interface QuizAnswerRequest {
  quizId: UUID
  answers: (number | null)[];
}
export interface QuizQuestionResult {
  questionId: string;
  isCorrect: boolean;
}

export interface QuizScoreResponse {
  quiz_id: UUID;
  total_questions: number;
  correct_answers: number;
  score: number;
  results: QuizQuestionResult[];
}
export interface ClearAnswerResponse {
  success: boolean;
}
export enum QuestionType {
  MultipleChoice = "multiple_choice",
  SingleChoice = "single_choice",
  TrueFalse = "true_false",
  FillInTheBlank = "fill_in_the_blank",
  ShortAnswer = "short_answer",
  LongAnswer = "long_answer",
  Matching = "matching",
  Ordering = "ordering",
  Essay = "essay",
  ProblemSolving = "problem_solving",
  Project = "project",
  Presentation = "presentation",
  Report = "report",
  CaseStudy = "case_study",
  Other = "other"
}
export interface QuestionModel {
  question: string;
  answer: string[];
  options: string[];
  type: QuestionType;
  score: number;
}

export interface TestCaseModel {
  input: string;
  output: string;
}

export interface CodeModel {
  question: string;
  testcases: TestCaseModel[];
}
export interface ExerciseQuizRequest {
  name: string;
  description?: string;
  deadline?: DateTimeString;
  time?: number;
  topic?: string;
  difficulty: DifficultyLevel;
  questions: QuestionModel[];
  max_score?: number;
  type: ExerciseType;
  course_id: UUID;
}
export interface ExerciseQuizResponse {
  exercise_id: UUID;
  name: string;
  description?: string;
  deadline?: DateTimeString;
  time?: number;
  topic?: string;
  difficulty: DifficultyLevel;
  questions: QuestionModel[];
  max_score?: number;
  type: ExerciseType;
  course_id: UUID;
}

export interface ExerciseCodeResponse {
  exercise_id: UUID;
  name: string;
  description?: string;
  deadline?: string;
  time?: number;
  topic?: string;
  difficulty: DifficultyLevel;
  questions: CodeModel[];
  max_score?: number;
  type: ExerciseType;
  course_id: UUID;
}
