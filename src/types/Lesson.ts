import { QuizExercise } from './Exercise';
import { Document } from './Document';
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
  }
export interface Module {
    module_id: string;
    title: string;
    objectives: string[];
    quizList?: QuizExercise[];
    documentList?: Document[];
}