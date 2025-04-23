export interface SubmissionDto {
  id: string;
  user_id: string;
  exercise_id: string;
  judge0_language_id: number;
  created_at: string; // ISO 8601 timestamp
}

export interface LanguageConfigDto {
  id: string;
  judge0_language_id: number;
  boilerplate_code: string;
  time_limit: number;
  memory_limit: number;
}

export interface TestCaseDto {
  id: string;
  input: string;
  expected_output: string;
  is_public: boolean;
  score: number;
}

export interface ProgrammingLanguageConfig {
  id: string;
  judge0_language_id: number;
  boilerplate_code: string;
  time_limit: number;
  memory_limit: number;
}

export interface GeneratedCodeExerciseBrief {
  id: string;
  name: string;
}
