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

      <!-- Solution Actions Dropdown -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            variant="tonal"
            color="primary"
            class="mr-2"
            v-bind="props"
            :loading="codeSolutionStore.isLoading"
          >
            <v-icon left>mdi-code-braces</v-icon>
            Solutions
            <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click="codeSolutionStore.toggleSolution"
            :disabled="codeSolutionStore.isLoading"
          >
            <template v-slot:prepend>
              <v-icon :color="codeSolutionStore.showAISolution ? 'success' : 'primary'">
                {{ codeSolutionStore.showAISolution ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
            <v-list-item-title>
              {{ codeSolutionStore.showAISolution ? 'Show My Solution' : 'Show AI Solution' }}
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            @click="explainCode"
            :disabled="isExplaining"
          >
            <template v-slot:prepend>
              <v-icon color="info">mdi-information</v-icon>
            </template>
            <v-list-item-title>Explain Code</v-list-item-title>
          </v-list-item>

          <v-list-item
            @click="giveHints"
            :disabled="isGettingHints"
          >
            <template v-slot:prepend>
              <v-icon color="warning">mdi-lightbulb-on</v-icon>
            </template>
            <v-list-item-title>Get Hints</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

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
import { TestInput, LineExplanation, CodeAnalysisRequest, LanguageKey } from '@/types/LLM_code';
import { LanguageConfigDto } from '@/types/CodingExercise';
import { JUDGE0_LANG } from '@/constants/judge0_lang';
import { useProgrammingSubmissions } from '@/composables/useProgrammingSubmissions';
import { useFileIO } from '@/composables/useFileIO';
import { ref, watch, computed, onMounted, onUnmounted, nextTick, inject } from 'vue';
import { useRoute } from 'vue-router';
import { llmCodeServices } from '@/services/llmCodeServices';
import { useCodeSolutionStore } from "@/stores/codeSolutionStore";
import { useCodeExecution } from '@/composables/useCodeExecution';

// Save user's code for each language
const codePerLanguage = new Map<number, string>();
interface RouteParam {
  exerciseId: string;

}
// Define props
const props = defineProps<{
  testInput: TestInput;
  problemDescription: string;
  testcases: Array<{
    input: string;
    expected_output: string;
    isPublic?: boolean;
  }>;
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

const codeSolutionStore = useCodeSolutionStore();

const {
  isExecuting,
  executionResult,
  executionError,
  executeCode
} = useCodeExecution();

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

const getCommentSyntax = (judge0LangId: number): { start: string; end: string } => {
  // Map Judge0 language IDs to comment prefixes
  const lineCommentMap: Record<number, string> = {
    50: '//', // C
    54: '//', // C++
    59: '//', // C++17
    76: '//', // C++20
    51: '//', // C#
    62: '//', // Java
    63: '//', // JavaScript
    70: '#',  // Python2
    71: '#',  // Python3
    60: '//', // Go
    72: '#',  // Ruby
    73: '//', // Rust
    74: '//', // TypeScript
    78: '//', // Kotlin
    68: '//', // PHP
    85: '#',  // Perl
    81: '//', // Scala
    61: '--', // Haskell
    64: '--', // Lua
    80: '#',  // R
  };

  const commentPrefix = lineCommentMap[judge0LangId] || '//';
  return { start: `${commentPrefix} HINT: `, end: '' };
};


// Function to insert hints directly into the code
const insertHintsIntoCode = (
  originalCode: string,
  hints: LineHint[],
  judge0LangId: number
): string => {
  const commentSyntax = getCommentSyntax(judge0LangId);
  const lines = originalCode.split('\n');

  const sortedHints = [...hints].sort((a, b) => b.line - a.line);
  for (const hint of sortedHints) {
    if (hint.line > 0 && hint.line <= lines.length) {
      const hintComment = `${commentSyntax.start}${hint.hint}${commentSyntax.end}`;
      lines.splice(hint.line - 1, 0, hintComment);
    }
  }
  return lines.join('\n');
};


// New function to get hints and add them to the code
const giveHints = async (): Promise<void> => {
  try {
    isGettingHints.value = true;

    // Convert numeric language ID to LanguageKey for type safety
    const languageKey = mapLanguageIdToKey(selectedLanguage.value);

    const responseBody = await llmCodeServices.getHints({ problem_statement: props.problemDescription, code_context: code.value });
    console.log("Response body:", responseBody);

    const hints = responseBody.data.line_hints;

    // Insert hints directly into the code
    const codeWithHints = insertHintsIntoCode(code.value, hints, selectedLanguage.value);

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
const runCode = async () => {
  isLoading.value = true;
  emit('update:loading', true);

  try {
    if (!props.testcases || props.testcases.length === 0) {
      throw new Error('No test cases available');
    }

    // Execute the code with all test cases
    const { executionResults, executionError } = await executeCode(
      code.value,
      selectedLanguage.value,
      props.testcases
    );

    if (executionError) {
      emit('run-result', `❌ ${executionError}`);
    } else {
      // Format results for all test cases
      const formattedResults = executionResults.map((result, index) => {
        const testcase = props.testcases[index];
        if (result.error) {
          return `Test Case ${index + 1}:\nInput: ${testcase.input}\nExpected: ${testcase.expected_output}\n❌ ${result.error}\n`;
        } else {
          return `Test Case ${index + 1}:\nInput: ${testcase.input}\nExpected: ${testcase.expected_output}\n✅ Output: ${result.result}\n`;
        }
      }).join('\n');

      emit('run-result', formattedResults);
    }
  } catch (error) {
    emit('run-result', `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
watch(selectedLanguage, async (id) => {
  // Save current code before switching
  if (id !== undefined) {
    codePerLanguage.set(id, code.value);
  }

  // Retrieve code for the selected language or default
  const cached = codePerLanguage.get(id);
  if (cached !== undefined) {
    code.value = cached;
  } else {
    const config = languageConfigs.value.find(c => c.judge0_language_id === id);
    code.value = config?.boilerplate_code || setDefaultCodeForLanguage(id);
    codePerLanguage.set(id, code.value);
  }

  nextTick(() => initEditor());
  lineExplanations.value = [];

  // Reset solution store when language changes
  codeSolutionStore.reset();
});

// Watch for solution toggle
watch(() => codeSolutionStore.showAISolution, async (show) => {
  if (show && !codeSolutionStore.aiSolution) {
    await codeSolutionStore.fetchAISolution(param.exerciseId, selectedLanguage.value);
  }
  if (show && codeSolutionStore.aiSolution) {
    code.value = codeSolutionStore.aiSolution;
    nextTick(() => initEditor());
  } else {
    const config = languageConfigs.value.find(c => c.judge0_language_id === selectedLanguage.value);
    code.value = config?.boilerplate_code || '// No boilerplate code available';
    nextTick(() => initEditor());
  }
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

/* Solution dropdown styling */
.v-list-item {
  min-height: 40px;
}

.v-list-item__prepend {
  margin-right: 12px;
}
</style>
