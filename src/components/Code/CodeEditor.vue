<template>
  <v-sheet class="d-flex flex-column overflow-hidden h-70">
    <!-- Language selector and actions -->
    <v-toolbar dense color="grey-darken-4">
      <v-select
        v-model="selectedLanguage"
        :items="availableLanguageIds"
        :item-title="(id) => getLanguageName(id)"
        :item-value="(id) => id"
        density="compact"
        hide-details
        class="language-select"
        bg-color="grey-darken-3"
        width="150"
      ></v-select>
      <v-spacer></v-spacer>

      <v-btn variant="tonal" color="secondary" class="mr-2" @click="onImport">Import</v-btn>
      <v-btn variant="tonal" color="secondary" class="mr-2" @click="onExport">Export</v-btn>
      <v-btn variant="tonal" color="warning" class="mr-2" @click="giveHints" :loading="isGettingHints">Give Hints</v-btn>
      <v-btn variant="tonal" color="info" class="mr-2" @click="explainCode" :loading="isExplaining">Explain Code</v-btn>
      <v-btn variant="tonal" color="success" class="mr-2" @click="runCode" :loading="isLoading">Run</v-btn>
      <v-btn variant="tonal" color="primary" @click="submitCode" :loading="isLoading">Submit</v-btn>

    </v-toolbar>

    <!-- CodeMirror Editor -->
    <div class="flex-grow-1 overflow-hidden">
      <div ref="editorContainer" class="editor-container"></div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLineGutter, hoverTooltip } from '@codemirror/view';
import { CodeExerciseService } from '@/services/CodeExerciseService';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, indentUnit } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { lintGutter } from '@codemirror/lint';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { createSubmission, pollSubmission, prepareStdin } from '@/services/Professor/judge0api';
import { llmCodeServices } from '@/services/llmCodeServices';
import { TestInput, LineExplanation, CodeAnalysisRequest, LanguageKey } from '@/types/LLM_code';
import { LanguageConfigDto } from '@/types/CodingExercise';
import { JUDGE0_LANG } from '@/constants/judge0_lang';
import { useProgrammingSubmissions } from '@/composables/useProgrammingSubmissions';
import { useFileIO } from '@/composables/useFileIO';
import { ref, watch, computed, onMounted, onUnmounted, nextTick, inject } from 'vue';
import { useRoute } from 'vue-router';

// Save user's code for each language
const codePerLanguage = new Map<number, string>();
interface RouteParam {
  exerciseId: string;

}
// Define props
const props = defineProps<{
  testInput: TestInput;
}>();

// Define types for hints
interface LineHint {
  line: number;
  hint: string;
}

// Helper function to safely get language name
const getLanguageName = (id: number): string => {
  if (typeof id !== 'number') return `Language ${id}`;
  // Type assertion here is safe because we're checking if the id exists in the object
  return JUDGE0_LANG[id as keyof typeof JUDGE0_LANG] || `Language ${id}`;
};

const availableLanguageIds = computed(() =>
  languageConfigs.value.map(config => config.judge0_language_id)
);

const route = useRoute();
const param = route.params as RouteParam;
const { submitCodeWithPolling } = useProgrammingSubmissions();

const emit = defineEmits<{
  (e: 'update:solution', value: string): void;
  (e: 'run-result', result: string): void;
  (e: 'submit-result', result: string): void;
  (e: 'update:loading', isLoading: boolean): void;
}>();

const selectedLanguage = ref<number>(54);
const code = ref<string>('// Loading code...');
const editorContainer = ref<HTMLElement | null>(null);
const isLoading = ref<boolean>(false);
const isExplaining = ref<boolean>(false);
const isGettingHints = ref<boolean>(false);
const lineExplanations = ref<LineExplanation[]>([]);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const languageConfigs = ref<LanguageConfigDto[]>([]);

let editor: EditorView | null = null;

// Create a basic setup configuration since there's no basicSetup in CM6
const createBasicSetup = () => [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  keymap.of([
    ...defaultKeymap,
    ...historyKeymap,
    ...closeBracketsKeymap
  ]),
  foldGutter(),
  indentUnit.of("  ")
];

// Language mapping for CodeMirror
const cmLanguages: Record<number, any> = {
  54: cpp(),     // C++
  62: java(),    // Java
  63: javascript(), // JavaScript
  71: python(),  // Python3
};

// Create hover tooltip handler based on line explanations
const createLineExplanationTooltip = () => {
  return hoverTooltip((view, pos) => {
    if (lineExplanations.value.length === 0) return null;

    // Get line number at position
    const line = view.state.doc.lineAt(pos);
    const lineNumber = line.number;

    // Find explanation for this line
    const explanation = lineExplanations.value.find(exp => exp.line === lineNumber);
    if (!explanation) return null;

    return {
      pos: line.from,
      end: line.to,
      above: true,
      create(view) {
        const dom = document.createElement('div');
        dom.className = 'cm-tooltip-explanation';
        dom.textContent = explanation.explanation;
        return { dom };
      }
    };
  });
};

// Create a dark theme
const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "#1e1e1e",
    color: "#ddd"
  },
  ".cm-content": {
    caretColor: "#0e9"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#0e9"
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "#074"
  },
  ".cm-gutters": {
    backgroundColor: "#1e1e1e",
    color: "#8f8f8f",
    border: "none"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#222"
  },
  ".cm-hint-line": {
    backgroundColor: "rgba(255, 217, 0, 0.1)"
  }
}, { dark: true });

// Initialize editor
const initEditor = (): void => {
  if (!editorContainer.value) return;

  // Clean up previous instance if it exists
  if (editor) {
    editor.destroy();
  }

  // Get the correct language support or default to JavaScript
  const languageId = selectedLanguage.value;
  const languageSupport = cmLanguages[languageId] || javascript();

  const startState = EditorState.create({
    doc: code.value,
    extensions: [
      ...createBasicSetup(),
      darkTheme,
      languageSupport,
      lintGutter(),
      createLineExplanationTooltip(),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          code.value = update.state.doc.toString();
          emit('update:solution', code.value);

          // Clear explanations when code changes
          lineExplanations.value = [];
        }
      })
    ]
  });

  editor = new EditorView({
    state: startState,
    parent: editorContainer.value
  });
};

// Map numeric language ID to LanguageKey for type safety
const mapLanguageIdToKey = (id: number): LanguageKey => {
  switch(id) {
    case 54: return 'cpp';
    case 62: return 'java';
    case 71: return 'python';
    // Add more mappings as needed
    default: return 'cpp'; // Default fallback
  }
};

// Function to get comment syntax for different languages
const getCommentSyntax = (language: LanguageKey): { start: string, end: string } => {
  switch (language) {
    case 'cpp':
      return { start: '// HINT: ', end: '' };
    case 'java':
      return { start: '// HINT: ', end: '' };
    case 'python':
      return { start: '# HINT: ', end: '' };
    default:
      return { start: '// HINT: ', end: '' };
  }
};

// Function to insert hints directly into the code
const insertHintsIntoCode = (originalCode: string, hints: LineHint[], language: LanguageKey): string => {
  const commentSyntax = getCommentSyntax(language);
  const lines = originalCode.split('\n');

  // Sort hints by line number in descending order to avoid position shifts
  const sortedHints = [...hints].sort((a, b) => b.line - a.line);

  for (const hint of sortedHints) {
    // Make sure the line index exists in the array
    if (hint.line > 0 && hint.line <= lines.length) {
      const hintComment = `${commentSyntax.start}${hint.hint}${commentSyntax.end}`;

      // Insert hint comment before the code line
      lines.splice(hint.line - 1, 0, hintComment);
    }
  }

  return lines.join('\n');
};

// New function to get hints and add them to the code
const giveHints = async (): Promise<void> => {
  try {
    isGettingHints.value = true;

    // Mock data - in production this would be an API call
    const mockHintsData: LineHint[] = [
      { line: 2, hint: "Consider initializing variables here" },
      { line: 5, hint: "This is where you'll need to iterate through the array" },
      { line: 10, hint: "Don't forget to check for edge cases" },
      { line: 15, hint: "Remember to return the correct indices" }
    ];

    // Convert numeric language ID to LanguageKey for type safety
    const languageKey = mapLanguageIdToKey(selectedLanguage.value);

    // Insert hints directly into the code
    const codeWithHints = insertHintsIntoCode(code.value, mockHintsData, languageKey);

    // Update the code with hints included
    code.value = codeWithHints;

    // Reinitialize editor to show updated code
    nextTick(() => {
      initEditor();
      showSuccess("Hints have been added to your code as comments.");
    });

  } catch (error) {
    console.error('Error getting code hints:', error);
    showError('Failed to add hints to your code');
  } finally {
    isGettingHints.value = false;
  }
};

// Get code explanations using the llmCodeServices
const explainCode = async (): Promise<void> => {
  try {
    isExplaining.value = true;

    // Clear previous explanations
    lineExplanations.value = [];

    // Prepare request payload
    const codeAnalysisRequest: CodeAnalysisRequest = {
      code: code.value,
      language: selectedLanguage.value // Use the mapped string value
    };

    // Call the service to get explanations
    const response = await llmCodeServices.getCodeExplanation(
      { showError, showSuccess },
      codeAnalysisRequest
    );

    // Process the response
    if (response.data && Array.isArray(response.data)) {
      lineExplanations.value = response.data;

      // Reinitialize editor to apply new tooltips
      nextTick(() => {
        initEditor();
      });
    }
  } catch (error) {
    console.error('Error getting code explanations:', error);
  } finally {
    isExplaining.value = false;
  }
};

// Helper function to get Judge0 language ID for the current language
const getJudge0LanguageId = (languageId: number): number => {
  // Map from our language IDs to Judge0 language IDs
  // This is safer than directly using LANGUAGE_MAP
  const languageMap: Record<number, number> = {
    54: 54, // C++
    62: 62, // Java
    63: 63, // JavaScript
    71: 71, // Python
    // Add more mappings as needed
  };

  return languageMap[languageId] || 54; // Default to C++ if not found
};

// Run code with test case
const runCode = async (): Promise<void> => {
  try {
    isLoading.value = true;
    emit('update:loading', true);

    // Prepare stdin
    const stdin = prepareStdin(
      mapLanguageIdToKey(selectedLanguage.value),
      props.testInput.nums,
      props.testInput.target
    );

    try {
      // Get Judge0 language ID
      const judge0LanguageId = getJudge0LanguageId(selectedLanguage.value);

      // Create submission
      const token = await createSubmission(
        code.value,
        judge0LanguageId,
        stdin,
        '[0,1]'
      );

      // Poll for results
      const result = await pollSubmission(token);

      // Format and emit results
      let resultText = '';
      if (result.status.id === 3) { // Accepted
        resultText = `Status: ${result.status.description}\n`;
        resultText += `Output: ${result.stdout || 'No output'}\n`;
        resultText += `Time: ${result.time} seconds\n`;
        resultText += `Memory: ${result.memory} KB`;
      } else {
        resultText = `Status: ${result.status.description}\n`;
        if (result.stderr) {
          resultText += `Error: ${result.stderr}\n`;
        }
        if (result.compile_output) {
          resultText += `Compiler output: ${result.compile_output}\n`;
        }
      }

      emit('run-result', resultText);
    } catch (apiError: any) {
      // Handle API errors
      if (apiError.response) {
        // Server returned an error with status code
        const errorData = apiError.response.data;
        let detailedError = `Error (${apiError.response.status}): `;

        if (errorData && typeof errorData === 'object') {
          if (errorData.error) {
            detailedError += errorData.error;
          } else if (errorData.message) {
            detailedError += errorData.message;
          } else {
            detailedError += JSON.stringify(errorData);
          }
        } else if (typeof errorData === 'string') {
          detailedError += errorData;
        } else {
          detailedError += 'Unknown error format';
        }

        emit('run-result', detailedError);
      } else if (apiError.request) {
        // Request was sent but no response received
        emit('run-result', 'Error: No response received from server');
      } else {
        // Other errors when setting up the request
        emit('run-result', `Error setting up request: ${apiError.message}`);
      }
    }
  } catch (error: any) {
    emit('run-result', `Error running code: ${error.message}`);
  } finally {
    isLoading.value = false;
    emit('update:loading', false);
  }
};

const submitCode = async (): Promise<void> => {
  isLoading.value = true;
  emit('update:loading', true);

  submitCodeWithPolling(
    param.exerciseId,
    selectedLanguage.value,
    code.value,
    {
      onComplete: (submission) => {
        const passed = submission.test_results.filter(t => t.status === 'Accepted').length;
        const total = submission.test_results.length;

        const summary = `
✅ Submission Complete
- Status: ${submission.status}
- Passed: ${passed}/${total}
- Score: ${submission.score ?? 'N/A'}
        `;
        emit('submit-result', summary);
        isLoading.value = false;
        emit('update:loading', false);
      },
      onError: (err) => {
        emit('submit-result', `❌ Submission failed: ${err.message}`);
        isLoading.value = false;
        emit('update:loading', false);
      }
    }
  );
};

// Set default code based on selected language
const setDefaultCodeForLanguage = (languageId: number) => {
  const defaultCodeMap: Record<number, string> = {
    54: "// C++ code\n#include <iostream>\n\nint main() {\n  // Your code here\n  return 0;\n}",
    62: "// Java code\npublic class Solution {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}",
    63: "// JavaScript code\n\nfunction main() {\n  // Your code here\n}\n\nmain();",
    71: "# Python code\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == '__main__':\n    main()"
  };

  return defaultCodeMap[languageId] || "// Your code here";
};

// Initialize editor when component is mounted
onMounted(() => {
  // Set initial default code
  code.value = setDefaultCodeForLanguage(selectedLanguage.value);
  initEditor();
});

// Fetch language configurations for the coding exercise
onMounted(async () => {
  try {
    const response = await CodeExerciseService.getLanguageConfigsOfAnExercise(
      param.exerciseId, {showError, showSuccess}
    );

    if (response && response.data) {
      languageConfigs.value = response.data;

      // Set initial language if available
      const config = languageConfigs.value.find(c => c.judge0_language_id === selectedLanguage.value);
      if (config) {
        // Initialize both ref and cache map
        code.value = config.boilerplate_code;
        codePerLanguage.set(config.judge0_language_id, config.boilerplate_code);
        nextTick(() => initEditor());
      }
    }
  } catch (error) {
    console.error("Failed to fetch language configs:", error);
    showError("Failed to load language configurations");
  }
});

// Clean up when component is unmounted
onUnmounted(() => {
  if (editor) {
    editor.destroy();
    editor = null;
  }
});

// Watch for language changes
watch(selectedLanguage, (newLangId, oldLangId) => {
  // Save current code before switching
  if (oldLangId !== undefined) {
    codePerLanguage.set(oldLangId, code.value);
  }

  // Retrieve code for the selected language or default
  const cached = codePerLanguage.get(newLangId);
  if (cached !== undefined) {
    code.value = cached;
  } else {
    const config = languageConfigs.value.find(c => c.judge0_language_id === newLangId);
    code.value = config?.boilerplate_code || setDefaultCodeForLanguage(newLangId);
    codePerLanguage.set(newLangId, code.value);
  }

  nextTick(() => initEditor());
  lineExplanations.value = [];
});

// Watch for external code changes
watch(code, (newCode) => {
  if (!editor) return;

  const currentValue = editor.state.doc.toString();
  if (newCode !== currentValue) {
    editor.dispatch({
      changes: { from: 0, to: currentValue.length, insert: newCode }
    });
  }
});

const { importCode, exportCode } = useFileIO();

const onImport = () => {
  importCode((importedCode) => {
    code.value = importedCode;
    nextTick(initEditor);
  });
};

const onExport = () => {
  exportCode(code.value, selectedLanguage.value);
};
</script>

<style>
.editor-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #1e1e1e;
}

.language-select {
  width: 150px;
}

/* Custom tooltip styling */
.cm-tooltip-explanation {
  background-color: #2d2d2d;
  color: #eee;
  border: 1px solid #444;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 300px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
</style>
