import { UUID, DateString, ExerciseType } from "@/utils/commonType"


//------------------Professor----------------------
export interface CourseNameResponse {
    course_id: UUID;
    course_name: string;
}

export interface GetCoursesListResponse {
    course_name_list: CourseNameResponse[];
}

export interface ExerciseNameResponse {
    exercise_id: UUID;
    exercise_name: string;
}

export interface GetExercisesListResponse {
    exercises_name_list: ExerciseNameResponse[];
}

export interface LessonInLearningPath {
    lesson_id: UUID;
    lesson_name: string;
    description: string;
    progress: number;
}

export interface LearningPathProgressInCourse {
    learning_path_id: UUID;
    progress: number;
    objective?: string;
    lessons: LessonInLearningPath[];
}

export interface ExerciseStudentProgressInCourse {
    exercise_id: UUID
    exercise_name: string;
    score: number;
}

export interface StudentProgressInCourse {
    student_id: UUID
    student_name: string;
    exercises: ExerciseStudentProgressInCourse[];
    learning_path?: LearningPathProgressInCourse;
    average_score: number;
}

export interface GetCourseGradesResponse {
    students_list: StudentProgressInCourse[];
}

export interface AnswerQuizExercise {
    question: string;
    answers?: string[];
}

export interface StudentProgressInExercise {
    student_id: UUID
    student_name: string;
    score: number;
    date?: DateString;
    question_answers?: AnswerQuizExercise[];
}

export interface GetExerciseGradesResponse {
    students_list: StudentProgressInExercise[];
    type: ExerciseType;
}
