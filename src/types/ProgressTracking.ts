import { UUID, DateString, ExerciseType } from "@/utils/commonType"
//-------------------Student----------------------
export interface ProgressTrackingStudent {
    student_assessment: StudentAssessment
  }
  
  export interface StudentAssessment {
    student_info: StudentInfo
    learning_goal: string
    assessment_date: string
    assessment_summary: AssessmentSummary
    progress_review: ProgressReview
    advice: Advice
  }
  
  export interface StudentInfo {
    name: string
    email: string
  }
  
  export interface AssessmentSummary {
    situation: string
    task: string
    action: Action
    result: string
  }
  
  export interface Action {
    theoretical_knowledge: string
    coding_skills: string
    effort: string
  }
  
  export interface ProgressReview {
    strengths: string
    areas_to_note: string
  }
  
  export interface Advice {
    theoretical_knowledge: string
    coding_skills: string
    effort: string
  }
  

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
    student_email: string;
    student_mssv: string;
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
    student_email: string;
    student_mssv: string;
    score: number;
    date?: DateString;
    question_answers?: AnswerQuizExercise[];
}

export interface GetExerciseGradesResponse {
    students_list: StudentProgressInExercise[];
    type: ExerciseType;
}
