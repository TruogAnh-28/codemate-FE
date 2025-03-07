

export interface EditorOptions {
  // Basic layout
  automaticLayout: boolean;
  fontSize: number;
  fontFamily?: string;
  fontLigatures?: boolean;
  lineHeight?: number;
  
  // Display features
  minimap: { 
    enabled: boolean;
    showSlider?: 'mouseover' | 'always';
    renderCharacters?: boolean;
  };
  scrollBeyondLastLine: boolean;
  lineNumbers: 'on' | 'off';
  lineDecorationsWidth?: number;
  glyphMargin: boolean;
  folding: boolean;
  foldingStrategy?: 'auto' | 'indentation';
  
  // Visual indicators
  renderLineHighlight: 'all' | 'line' | 'none';
  renderWhitespace?: 'none' | 'boundary' | 'selection' | 'all';
  renderControlCharacters?: boolean;
  renderIndentGuides?: boolean;
  
  // Scrolling behavior
  scrollbar: {
    vertical: 'visible' | 'hidden' | 'auto';
    horizontal: 'visible' | 'hidden' | 'auto';
    useShadows?: boolean;
    verticalScrollbarSize?: number;
    horizontalScrollbarSize?: number;
  };
  
  // Editor behavior
  cursorBlinking?: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  cursorStyle?: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  cursorSmoothCaretAnimation?: 'on' | 'off';
  mouseWheelZoom?: boolean;
  multiCursorModifier?: 'alt' | 'ctrlCmd';
  
  // Code intelligence
  quickSuggestions?: boolean | { other: boolean; comments: boolean; strings: boolean };
  snippetSuggestions?: 'top' | 'bottom' | 'inline' | 'none';
  formatOnPaste?: boolean;
  formatOnType?: boolean;
  autoIndent?: 'none' | 'keep' | 'brackets' | 'advanced' | 'full';
  
  // Error highlighting
  renderValidationDecorations?: 'on' | 'off' | 'editable';
  lightbulb?: { enabled: 'on' | 'off' };
  
  // Code aesthetics
  bracketPairColorization?: { enabled: boolean };
  guides?: {
    bracketPairs?: boolean | 'active';
    indentation?: boolean;
  };
  
  // Search features
  find?: {
    addExtraSpaceOnTop?: boolean;
    autoFindInSelection?: 'never' | 'always' | 'multiline';
    seedSearchStringFromSelection?: boolean | 'never' | 'always' | 'selection';
  };
  
  // Miscellaneous
  links?: boolean;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  tabCompletion?: 'on' | 'off' | 'onlySnippets';
  wordBasedSuggestions?: 'on' | 'off' | 'matchingDocuments';
  accessibilitySupport?: 'auto' | 'on' | 'off';
  occurrencesHighlight?: boolean;
  selectionHighlight?: boolean;
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