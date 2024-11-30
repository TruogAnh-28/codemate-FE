import { b } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export interface QuizQuestion {
    id: string,
    image?: string,
    question: string,
    options: string[],
    correctAnswer: string,
    explanation: string
    chooseUser?: string
  }
export interface QuizExercise {
    id: string;
    status: 'new' | 'on going' | 'completed';
    name: string;
    quizList: QuizQuestion[];
    difficulty: 'easy' | 'medium' | 'hard';
    score?: number;
}
export interface QuizList {
  id: string;  // UUID
  name: string;
  status: 'new' | 'on going' | 'completed'; 
  difficulty: 'easy' | 'medium' | 'hard';
  score?: number;                           
}

export interface ModuleQuizResponse {
  moduleId: string;    // UUID
  title: string;
  objectives: string[];
  quizzes: QuizList[];
}
export interface QuizQuestionResponse {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  user_choice?: string;
}

export interface QuizExerciseResponse {
  id: string;
  name: string;
  status: string;
  difficulty: string;
  score: number;
  questions: QuizQuestionResponse[];
}
export interface QuizAnswerRequest {
  quizId: string
  answers: (number | null)[];
}
export interface QuizQuestionResult {
  questionId: string;
  isCorrect: boolean;
}

export interface QuizScoreResponse {
  quiz_id: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  results: QuizQuestionResult[];
}
export interface ClearAnswerResponse {
  success: boolean;
}
