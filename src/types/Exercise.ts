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