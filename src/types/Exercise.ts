import { UUID} from "@/utils/commonType"
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
