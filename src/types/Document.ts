export interface DocumentResponse {
  id: string;
  name: string;
  theoryContent: TheoryContent[];
  practicalGuide: PracticalGuide[];
  references: Reference[];
  summaryAndReview: SummaryAndReview;
}

export interface TheoryContent {
  title: string;
  prerequisites: string[];
  description: string[];
  examples: Example[];
}

export interface Example {
  title: string;
  codeSnippet: string;
  explanation: string;
}

export interface PracticalGuide {
  title: string;
  steps: string[];
  commonErrors: string[];
}

export interface Reference {
  title: string;
  link: string;
  description: string;
}

export interface SummaryAndReview {
  keyPoints: string[];
  reviewQuestions: ReviewQuestion[];
  quizLink: string;
}

export interface ReviewQuestion {
  id: string;
  question: string;
  answer: string;
  maxscore: number;
  score: any;
  inputUser: any;
}
