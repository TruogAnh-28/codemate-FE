<template>
  <div class="monaco-editor-container">
    <div ref="editorContainer" style="height: 500px; width: 100%;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

// Reference to editor container element
const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let disposables: monaco.IDisposable[] = []

onMounted(() => {
  if (editorContainer.value) {
    // Configure advanced editor options
    editor = monaco.editor.create(editorContainer.value, {
      // Basic settings
      value: '// Type your code here\nconsole.log("Hello World!");',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      
      // Font settings
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      fontLigatures: true,
      
      // Layout and display
      minimap: { 
        enabled: true,
        showSlider: 'mouseover',
        renderCharacters: true,
        maxColumn: 120
      },
      lineNumbers: 'on',
      lineDecorationsWidth: 10,
      scrollBeyondLastLine: false,
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        useShadows: true,
        verticalScrollbarSize: 14,
        horizontalScrollbarSize: 14
      },
      
      // Editor behavior
      cursorBlinking: 'blink',
      cursorStyle: 'line',
      cursorSmoothCaretAnimation: 'on',
      mouseWheelZoom: true,
      multiCursorModifier: 'alt',
      quickSuggestions: true,
      snippetSuggestions: 'inline',
      suggest: {
        snippetsPreventQuickSuggestions: false,
        filterGraceful: true,
        showIcons: true,
        // maxVisibleSuggestions: 12
      },
      tabCompletion: 'on',
      // wordBasedSuggestions: 'on',
      parameterHints: { enabled: true },
      
      // Code folding
      folding: true,
      foldingStrategy: 'auto',
      unfoldOnClickAfterEndOfLine: true,
      
      // Code intelligence
      formatOnPaste: true,
      formatOnType: true,
      bracketPairColorization: {
        enabled: true
      },
      autoIndent: 'full',
      
      // Error and linting
      renderValidationDecorations: 'on',
      // lightbulb: {
      //   enabled: 'on'  // Fixed: using 'on' instead of true
      // },
      
      // Diffing
      // renderSideBySide: true,
      
      // Version control
      // renderIndicators: true,
      
      // Accessibility
      accessibilitySupport: 'auto',
      
      // Other features
      links: true,
      renderLineHighlight: 'all',
      renderWhitespace: 'selection',
      rulers: [],
      wordWrap: 'off',
      find: {
        seedSearchStringFromSelection: 'selection',
        autoFindInSelection: 'multiline',
        addExtraSpaceOnTop: true
      }
    })
    
    // Set up JavaScript language features
    setupJavaScriptLanguageFeatures()
  }
})

const setupJavaScriptLanguageFeatures = () => {
  if (!editor) return
  
  // Register JavaScript/TypeScript language features
  const diagnosticsOptions = {
    noSemanticValidation: false,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: false
  }
  
  // Configure compiler options for TypeScript
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    noEmit: true,
    typeRoots: ["node_modules/@types"],
    jsx: monaco.languages.typescript.JsxEmit.React,
    jsxFactory: "React.createElement",
    reactNamespace: "React",
    allowJs: true,
    strict: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    lib: ['dom', 'dom.iterable', 'esnext'],
  });
  
  // Enable syntax validation for JavaScript
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(diagnosticsOptions);
  
  // Add additional libraries
  const libSource = `
    declare class Console {
      log(...data: any[]): void;
      error(...data: any[]): void;
      warn(...data: any[]): void;
      info(...data: any[]): void;
    }
    declare var console: Console;
    
    interface Document {
      getElementById(id: string): HTMLElement | null;
      querySelector(selectors: string): Element | null;
      querySelectorAll(selectors: string): NodeListOf<Element>;
    }
    declare var document: Document;
    
    interface Window {
      document: Document;
      console: Console;
      setTimeout(handler: TimerHandler, timeout?: number): number;
    }
    declare var window: Window;
  `;
  
  const libUri = 'ts:lib/browser.d.ts';
  monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
  
  // Add editor actions
  editor.addAction({
    id: 'format-document',
    label: 'Format Document',
    keybindings: [
      monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF
    ],
    contextMenuGroupId: '1_modification',
    run: (ed) => {
      const action = ed.getAction('editor.action.formatDocument');
      if (action) {
        action.run();
      }
    }
  });
  
  // Listen for model content changes
  const model = editor.getModel();
  if (model) {
    disposables.push(
      model.onDidChangeContent(() => {
        // Trigger validation
        monaco.editor.setModelMarkers(model, 'javascript', []);
        
        // You could implement custom validation logic here if needed
        const content = model.getValue();
        try {
          // Basic syntax check for JavaScript
          new Function(content);
        } catch (e) {
          if (e instanceof Error) {
            // Create a marker for the error
            const errorMessage = e.message;
            let lineNumber = 1;
            
            // Try to extract line number from error message
            const lineMatch = errorMessage.match(/line (\d+)/);
            if (lineMatch && lineMatch[1]) {
              lineNumber = parseInt(lineMatch[1], 10);
            }
            
            // Make sure line number is valid
            if (lineNumber < 1 || lineNumber > model.getLineCount()) {
              lineNumber = 1;
            }
            
            monaco.editor.setModelMarkers(model, 'javascript', [{
              startLineNumber: lineNumber,
              endLineNumber: lineNumber,
              startColumn: 1,
              endColumn: model.getLineLength(lineNumber) + 1,
              message: errorMessage,
              severity: monaco.MarkerSeverity.Error
            }]);
          }
        }
      })
    );
  }
}

onBeforeUnmount(() => {
  // Clean up resources
  if (editor) {
    editor.dispose();
  }
  
  disposables.forEach(d => d.dispose());
})

// Expose editor instance if needed
defineExpose({
  getEditor: () => editor,
  // Add more exposed methods as needed
  formatCode: () => {
    const action = editor?.getAction('editor.action.formatDocument');
    if (action) {
      action.run();
    }
  },
  findReferences: () => {
    const action = editor?.getAction('editor.action.referenceSearch.trigger');
    if (action) {
      action.run();
    }
  },
  goToDefinition: () => {
    const action = editor?.getAction('editor.action.revealDefinition');
    if (action) {
      action.run();
    }
  }
})
</script>

<style scoped>
.monaco-editor-container {
  padding: 1rem;
  border-radius: 4px;
  background-color: #1e1e1e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>