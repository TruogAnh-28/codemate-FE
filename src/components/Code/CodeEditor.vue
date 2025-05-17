<template>
  <v-sheet class="d-flex flex-column fill-height">
    <!-- Language selector and actions -->
    <v-toolbar dense color="grey-darken-4">
      <v-select
        v-model="selectedLanguage"
        :items="availableLanguageIds"
        :item-title="(id) => getLanguageName(id)"
        :item-value="(id) => id"
        :disabled="codeSolutionStore.isShowingAISolution(selectedLanguage)"
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
            :loading="codeSolutionStore.isLoading || isGettingHints || isExplaining"
          >
            <v-icon left>mdi-code-braces</v-icon>
            Solutions
            <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click="codeSolutionStore.toggleSolution(selectedLanguage)"
            :disabled="codeSolutionStore.isLoading || (props.submissionCount !== undefined && props.submissionCount < 5)"
          >
            <template v-slot:prepend>
              <v-icon :color="codeSolutionStore.isShowingAISolution(selectedLanguage) ? 'success' : 'primary'">
                {{ codeSolutionStore.isShowingAISolution(selectedLanguage) ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
            <v-list-item-title>
              {{ codeSolutionStore.isShowingAISolution(selectedLanguage) ? 'Show My Solution' : 'Show AI Solution' }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="props.submissionCount !== undefined && props.submissionCount < 5" class="text-caption text-grey">
              Complete at least 5 submissions to unlock AI solution
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            @click="getOptimizationSuggestions"
            :disabled="isExplaining"
          >
            <template v-slot:prepend>
              <v-icon color="info">mdi-information</v-icon>
            </template>
            <v-list-item-title>Get optimizing suggestions</v-list-item-title>
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

      <v-btn variant="tonal" color="success" class="mr-2" @click="runCode" :loading="isRunning">Run</v-btn>
      <v-btn variant="tonal" color="primary" @click="submitCode" :loading="isSubmitting" :disabled="codeSolutionStore.isShowingAISolution(selectedLanguage)">Submit</v-btn>
    </v-toolbar>

    <!-- CodeMirror Editor -->
    <div class="editor-wrapper flex-grow-1 d-flex flex-column">
      <div ref="editorContainer" class="editor-container" tabindex="0"></div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { EditorState, EditorSelection } from '@codemirror/state';
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
import { TestInput, LineExplanation } from '@/types/LLM_code';
import { LanguageConfigDto } from '@/types/CodingExercise';
import { JUDGE0_LANG } from '@/constants/judge0_lang';
import { useProgrammingSubmissions } from '@/composables/useProgrammingSubmissions';
import { ref, watch, computed, onMounted, nextTick, inject } from 'vue';
import { useRoute } from 'vue-router';
import { llmCodeServices } from '@/services/llmCodeServices';
import { useCodeSolutionStore } from "@/stores/codeSolutionStore";
import { useCodeExecution } from '@/composables/useCodeExecution';
import { useCodeEditorStore } from '@/composables/useCodeEditor';

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
    stdout?: string,
    stderr?: string,
    isPublic?: boolean;
  }>;
  submissionCount?: number;
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
  (e: 'update:submissionCount', count: number): void;
}>();

const { code, selectedLanguage } = useCodeEditorStore();
const languageConfigs = ref<LanguageConfigDto[]>([]);
const editorContainer = ref<HTMLElement | null>(null);
const isRunning = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const isExplaining = ref<boolean>(false);
const isGettingHints = ref<boolean>(false);
const lineExplanations = ref<LineExplanation[]>([]);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

let editor: EditorView | null = null;

const codeSolutionStore = useCodeSolutionStore();

const {
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
    {
      key: 'Tab',
      preventDefault: true,
      run: (view) => {
        const tabChar = '\t';
        const { state } = view;
        const changes = state.changeByRange(range => ({
          changes: { from: range.from, to: range.to, insert: tabChar },
          range: EditorSelection.cursor(range.from + tabChar.length)
        }));

        view.dispatch(changes);
        return true;
      }
    },
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
    doc: codeSolutionStore.isShowingAISolution(selectedLanguage.value) ? codeSolutionStore.solutionCache.get(selectedLanguage.value) : code.value,
    extensions: [
      ...createBasicSetup(),
      darkTheme,
      languageSupport,
      lintGutter(),
      createLineExplanationTooltip(),
      EditorView.lineWrapping,
      codeSolutionStore.isShowingAISolution(selectedLanguage.value) ? EditorView.editable.of(false) : EditorView.editable.of(true),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !codeSolutionStore.isShowingAISolution(selectedLanguage.value)) {
          code.value = update.state.doc.toString();
          emit('update:solution', code.value);

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
  return { start: `${commentPrefix} `, end: '' };
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

    const responseBody = await llmCodeServices.getHints({ problem_statement: props.problemDescription, code_context: code.value });
    if (!responseBody.data?.line_hints) {
      throw new Error('No hints available');
    }

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

// Get optimization suggestions using the llmCodeServices
const getOptimizationSuggestions = async (): Promise<void> => {
  try {
    isExplaining.value = true;

    // Clear previous explanations
    lineExplanations.value = [];

    // Call the service to get optimization hints
    const response = await llmCodeServices.getHints({
      problem_statement: props.problemDescription,
      code_context: code.value,
      optimize: true
    });

    // Process the response
    if (response.data?.line_hints) {
      // Convert hints to explanations format for tooltips
      lineExplanations.value = response.data.line_hints.map(hint => ({
        line: hint.line,
        explanation: hint.hint,
        code: '' // We don't have the code snippet in hints
      }));

      // Insert optimization suggestions into the code as comments
      const codeWithSuggestions = insertHintsIntoCode(code.value, response.data.line_hints, selectedLanguage.value);
      code.value = codeWithSuggestions;

      // Reinitialize editor to apply new tooltips and show updated code
      nextTick(() => {
        initEditor();
        showSuccess("Optimization suggestions have been added to your code as comments.");
      });
    }
  } catch (error) {
    console.error('Error getting optimization suggestions:', error);
    showError('Failed to get optimization suggestions');
  } finally {
    isExplaining.value = false;
  }
};

const runCode = async () => {
  isRunning.value = true;
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
      emit('run-result', `❌ Execution Error:\n${executionError}`);
    } else {
      // Format results for all test cases
      const formattedResults = executionResults.map((result, index) => {
        const testcase = props.testcases[index];

        let output = `🧪 **Test Case ${index + 1}**\n`;
        output += `🔸 Input:\n${testcase.input}\n\n`;
        output += `🔸 Expected Output:\n${testcase.expected_output}\n\n`;
        output += `🔸 Your Output:\n${result.stdout}\n\n`;

        if (result.stderr) {
          output += `🔸 stderr:\n${result.stderr}\n\n`;
        }

        if (result.status.id === 3) {
          // 3 = Accepted
          output += `✅ Result: Passed\n`;
        } else {
          output += `❌ Result: ${result.status.description}\n`;
        }

        return output;
      }).join('\n' + '-'.repeat(40) + '\n');

      emit('run-result', formattedResults);
    }
  } catch (error) {
    emit('run-result', `❌ Internal Error:\n${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    isRunning.value = false;
    emit('update:loading', false);
  }
};

const submitCode = async (): Promise<void> => {
  isSubmitting.value = true;
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
        `;
        emit('submit-result', summary);
        isSubmitting.value = false;
        emit('update:loading', false);
        
        // Update submission count after successful submission
        if (props.submissionCount !== undefined) {
          emit('update:submissionCount', props.submissionCount + 1);
        }
      },
      onError: (err) => {
        emit('submit-result', `❌ Submission failed: ${err.message}`);
        isSubmitting.value = false;
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
  // Don't set initial default code here, wait for language configs
});

// Fetch language configurations for the coding exercise
onMounted(async () => {
  try {
    const response = await CodeExerciseService.getLanguageConfigsOfAnExercise(
      param.exerciseId, {showError, showSuccess}
    );

    if (response && response.data) {
      languageConfigs.value = response.data;

      // Set the first available language as default if none is selected
      if (languageConfigs.value.length > 0) {
        const firstConfig = languageConfigs.value[0];
        selectedLanguage.value = firstConfig.judge0_language_id;

        // Try to load stored code first
        const storedCode = loadCodeFromStorage(param.exerciseId, firstConfig.judge0_language_id);
        if (storedCode) {
          code.value = storedCode;
        } else {
          code.value = firstConfig.boilerplate_code;
        }

        codePerLanguage.set(firstConfig.judge0_language_id, code.value);
        nextTick(() => initEditor());
      }
    }
  } catch (error) {
    console.error("Failed to fetch language configs:", error);
    showError("Failed to load language configurations");
  }
});

// Helper function to get storage key for a specific language
const getStorageKey = (exerciseId: string, languageId: number): string => {
  return `code_solution_${exerciseId}_${languageId}`;
};

// Helper function to save code to localStorage
const saveCodeToStorage = (exerciseId: string, languageId: number, code: string): void => {
  try {
    localStorage.setItem(getStorageKey(exerciseId, languageId), code);
  } catch (error) {
    console.error('Failed to save code to localStorage:', error);
  }
};

// Helper function to load code from localStorage
const loadCodeFromStorage = (exerciseId: string, languageId: number): string | null => {
  try {
    return localStorage.getItem(getStorageKey(exerciseId, languageId));
  } catch (error) {
    console.error('Failed to load code from localStorage:', error);
    return null;
  }
};

// Helper function to get the appropriate code for a language
const getCodeForLanguage = (langId: number, isAISolution: boolean): string => {
  if (isAISolution) {
    return codeSolutionStore.solutionCache.get(langId) || '';
  }
  // Try to get code from localStorage first
  const storedCode = loadCodeFromStorage(param.exerciseId, langId);
  if (storedCode) {
    return storedCode;
  }
  return codePerLanguage.get(langId) || '';
};

// Helper function to set code for a language
const setCodeForLanguage = (langId: number, newCode: string, isAISolution: boolean): void => {
  if (isAISolution) {
    codeSolutionStore.solutionCache.set(langId, newCode);
  } else {
    codePerLanguage.set(langId, newCode);
    // Save to localStorage
    saveCodeToStorage(param.exerciseId, langId, newCode);
  }
};

// Watch for language changes
watch(selectedLanguage, async (newId, oldId) => {
  if (newId === undefined) return;

  // Get the current code before any changes
  const currentCode = code.value;

  // Save current code for the previous language
  setCodeForLanguage(oldId, currentCode, codeSolutionStore.isShowingAISolution(oldId));

  // Reset solution state for the new language
  codeSolutionStore.reset(newId);

  // Try to load stored code first
  const storedCode = loadCodeFromStorage(param.exerciseId, newId);
  if (storedCode) {
    code.value = storedCode;
  } else {
    // Get code associated with the new language
    const newCode = getCodeForLanguage(newId, codeSolutionStore.isShowingAISolution(newId));
    console.log("new code:", newCode);
    if (newCode) {
      code.value = newCode;
    } else {
      const config = languageConfigs.value.find(c => c.judge0_language_id === newId);
      if (config?.boilerplate_code) {
        console.log("boilerplate: ", config.boilerplate_code);
        code.value = config.boilerplate_code;
      } else {
        code.value = setDefaultCodeForLanguage(newId);
      }
      setCodeForLanguage(newId, code.value, codeSolutionStore.isShowingAISolution(newId));
    }
  }

  nextTick(() => initEditor());
  lineExplanations.value = [];
});

// Watch for solution toggle
watch(() => codeSolutionStore.isShowingAISolution(selectedLanguage.value), async (show) => {
  console.log("watch 1");
  if (show) {
    if (codeSolutionStore.hasCachedSolution(selectedLanguage.value)) {
      console.log("cached");
      const cachedSolution = codeSolutionStore.solutionCache.get(selectedLanguage.value);
      console.log(cachedSolution);
      if (cachedSolution) {
        code.value = cachedSolution;
        nextTick(() => initEditor());
        return;
      }
    } else {
      await codeSolutionStore.fetchAISolution(param.exerciseId, selectedLanguage.value);
      code.value = codeSolutionStore.solutionCache.get(selectedLanguage.value) || code.value;
      return;
    }
  }

  // Save current code before switching
  setCodeForLanguage(selectedLanguage.value, code.value, !show);

  // Get the appropriate code for the current state
  const newCode = getCodeForLanguage(selectedLanguage.value, show);
  if (newCode) {
    code.value = newCode;
  } else {
    const config = languageConfigs.value.find(c => c.judge0_language_id === selectedLanguage.value);
    if (show) {
      // If showing AI solution but no solution exists, use boilerplate
      code.value = config?.boilerplate_code || setDefaultCodeForLanguage(selectedLanguage.value);
    } else {
      // If showing user solution but no code exists, use boilerplate
      code.value = config?.boilerplate_code || setDefaultCodeForLanguage(selectedLanguage.value);
    }
    setCodeForLanguage(selectedLanguage.value, code.value, show);
  }

  nextTick(() => initEditor());
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

// Watch for code changes to save to localStorage
watch(code, (newCode) => {
  if (!codeSolutionStore.isShowingAISolution(selectedLanguage.value)) {
    saveCodeToStorage(param.exerciseId, selectedLanguage.value, newCode);
  }
}, { deep: true });

// Language extension mapping
const EXTENSIONS: Record<number, string> = {
  50: 'c',
  54: 'cpp',
  59: 'cpp',
  76: 'cpp',
  51: 'cs',
  62: 'java',
  63: 'js',
  70: 'py',
  71: 'py',
  60: 'go',
  72: 'rb',
  73: 'rs',
  83: 'swift',
  78: 'kt',
  74: 'ts',
  68: 'php',
  85: 'pl',
  81: 'scala',
  61: 'hs',
  64: 'lua',
  80: 'r'
};

// Create reverse mapping of extensions to language IDs
const LANGUAGE_IDS: Record<string, number[]> = {};
Object.entries(EXTENSIONS).forEach(([langId, ext]) => {
  if (!LANGUAGE_IDS[ext]) {
    LANGUAGE_IDS[ext] = [];
  }
  LANGUAGE_IDS[ext].push(Number(langId));
});

// Prefer newer versions of languages when multiple options exist

const onImport = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.c,.cpp,.cs,.java,.js,.py,.go,.rb,.rs,.swift,.kt,.ts,.php,.pl,.scala,.hs,.lua,.r';

  input.onchange = async () => {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const text = await file.text();

      // Detect language from file extension
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const possibleLangIds = LANGUAGE_IDS[extension] || [];

      // Find the highest available language ID that matches the extension
      const availableLangIds = languageConfigs.value.map(config => config.judge0_language_id);
      const detectedLangId = possibleLangIds
        .filter(id => availableLangIds.includes(id))
        .sort((a, b) => b - a)[0]; // Sort in descending order to get the highest version

      if (detectedLangId && detectedLangId != selectedLanguage.value) {
        // Save current code to the current language before switching
        setCodeForLanguage(selectedLanguage.value, code.value, codeSolutionStore.isShowingAISolution(selectedLanguage.value));

        // Switch to the new language
        selectedLanguage.value = detectedLangId;
        setCodeForLanguage(detectedLangId, text, codeSolutionStore.isShowingAISolution(detectedLangId));
      } else {
        // If no matching language found, use current language
        code.value = text;
        setCodeForLanguage(selectedLanguage.value, text, codeSolutionStore.isShowingAISolution(selectedLanguage.value));
      }
      nextTick(initEditor);
    }
  };
  input.click();
};

const onExport = () => {
  console.log('Exporting code for language:', selectedLanguage.value);
  console.log('Code to export:', code.value);
  const extension = EXTENSIONS[selectedLanguage.value] || 'txt';
  console.log('Using extension:', extension);
  const blob = new Blob([code.value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `solution.${extension}`;
  console.log('Downloading file:', link.download);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style>
.fill-height {
  height: 100%;
}

.editor-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* critical to avoid overflow issues in flex */
}

.editor-container {
  flex-grow: 1;
  min-height: 0;
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
