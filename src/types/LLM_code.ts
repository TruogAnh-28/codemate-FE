export interface CodeAnalysisRequest {
  code: string;
  language: string;
}
export interface CodeExplanation {
    line: number;
    code: string;
    explanation: string;
}

export interface TestInput {
  nums: string;
  target: string;
}

export interface LineExplanation {
  line: number;
  explanation: string;
  code: string;
}

export interface CodeAnalysisRequest {
  code: string;
  language: string;
}

// Define a type for the language mapping
export type LanguageKey = 'cpp'| 'python' | 'java';
