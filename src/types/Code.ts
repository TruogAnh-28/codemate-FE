

export interface EditorOptions {
  automaticLayout: boolean;
  fontSize: number;
  minimap: { enabled: boolean };
  scrollBeyondLastLine: boolean;
  lineNumbers: 'on' | 'off';
  glyphMargin: boolean;
  folding: boolean;
  renderLineHighlight: 'all' | 'line' | 'none';
  scrollbar: {
    vertical: 'visible' | 'hidden' | 'auto';
    horizontal: 'visible' | 'hidden' | 'auto';
  };
}

export interface LanguageMap {
  cpp: number;
  java: number;
  python: number;
}

export interface DefaultCode {
  cpp: string;
  java: string;
  python: string;
}

export interface TestInput {
  nums: string;
  target: string;
}

export interface ProblemExample {
  title: string;
  input: TestInput;
  output: string;
  explanation: string;
}