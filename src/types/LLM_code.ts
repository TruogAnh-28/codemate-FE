export interface CodeAnalysisRequest {
  code: string;
  language: number;
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

export interface LineHint {
  line: number;
  hint: string;
}

export interface HintOutput {
  global_hint: string;
  line_hints: LineHint[];
}


// Define a type for the language mapping
export type LanguageKey = 'cpp'| 'python' | 'java';
