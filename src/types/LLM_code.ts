export interface CodeAnalysisRequest {
  code: string;
  language: string;
}
export interface CodeExplanation {
    line: number;
    code: string;
    explanation: string;
}