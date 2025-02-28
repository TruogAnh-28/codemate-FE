export interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface SubmissionResponse {
  token: string;
}

export interface SubmissionStatus {
  id: number;
  description: string;
}

export interface SubmissionResult {
  status: SubmissionStatus;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string;
  memory: number;
  message: string | null;
  exit_code: number;
}