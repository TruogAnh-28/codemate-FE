import { defineStore } from "pinia";

interface CodeState {
  code: string;
  selectedLanguage: number;
  exerciseId: string;
  codePerLanguage: Map<number, string>;
  languageConfigs: Array<{
    judge0_language_id: number;
    boilerplate_code: string;
  }>;
}

export const useCodeEditorStore = defineStore("codeEditor", {
  state: (): CodeState => ({
    code: '',
    selectedLanguage: 54, // Default to C++
    exerciseId: '',
    codePerLanguage: new Map(),
    languageConfigs: []
  }),

  actions: {
    setCode(code: string) {
      this.code = code;
      this.codePerLanguage.set(this.selectedLanguage, code);
      this.saveToLocalStorage();
    },

    setLanguage(languageId: number) {
      this.selectedLanguage = languageId;
      // Load code for this language if it exists
      const savedCode = this.codePerLanguage.get(languageId) || this.loadFromLocalStorage(languageId);
      if (savedCode) {
        this.code = savedCode;
      } else {
        // If no saved code, use boilerplate
        const config = this.languageConfigs.find(c => c.judge0_language_id === languageId);
        this.code = config?.boilerplate_code || this.getDefaultCodeForLanguage(languageId);
      }
    },

    setExerciseId(id: string) {
      this.exerciseId = id;
    },

    setLanguageConfigs(configs: Array<{ judge0_language_id: number; boilerplate_code: string }>) {
      this.languageConfigs = configs;
    },

    // Helper method to get default code for a language
    getDefaultCodeForLanguage(languageId: number): string {
      const defaultCodeMap: Record<number, string> = {
        54: "// C++ code\n#include <iostream>\n\nint main() {\n  // Your code here\n  return 0;\n}",
        62: "// Java code\npublic class Solution {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}",
        63: "// JavaScript code\n\nfunction main() {\n  // Your code here\n}\n\nmain();",
        71: "# Python code\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == '__main__':\n    main()"
      };
      return defaultCodeMap[languageId] || "// Your code here";
    },

    // Helper method to save code to localStorage
    saveToLocalStorage() {
      try {
        localStorage.setItem(
          this.getStorageKey(this.selectedLanguage),
          this.code
        );
      } catch (error) {
        console.error('Failed to save code to localStorage:', error);
      }
    },

    // Helper method to load code from localStorage
    loadFromLocalStorage(languageId: number): string | null {
      try {
        const code = localStorage.getItem(this.getStorageKey(languageId));
        if (code) {
          this.codePerLanguage.set(languageId, code);
          return code;
        }
      } catch (error) {
        console.error('Failed to load code from localStorage:', error);
      }
      return null;
    },

    // Helper method to get storage key
    getStorageKey(languageId: number): string {
      return `code_solution_${this.exerciseId}_${languageId}`;
    }
  }
}); 