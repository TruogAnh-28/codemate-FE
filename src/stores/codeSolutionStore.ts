import { defineStore } from "pinia";
import { CodeExerciseService } from "@/services/CodeExerciseService";
import { CodeExerciseMockService } from "@/services/mock/CodeExerciseMockService";

// Set this to true to use mock data
const USE_MOCK = true;

export const useCodeSolutionStore = defineStore("codeSolution", {
  state: () => ({
    aiSolution: null as string | null,
    isLoading: false,
    error: null as string | null,
    showAISolution: false
  }),

  actions: {
    async fetchAISolution(exerciseId: string, languageId: number) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await CodeExerciseService.getAIGeneratedSolution(
              exerciseId,
              languageId,
              { showError: () => {}, showSuccess: () => {} }
            );
        
        if (response.data) {
          this.aiSolution = response.data.solution;
        }
      } catch (err) {
        this.error = "Failed to fetch AI solution";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    toggleSolution() {
      this.showAISolution = !this.showAISolution;
    },

    reset() {
      this.aiSolution = null;
      this.isLoading = false;
      this.error = null;
      this.showAISolution = false;
    }
  }
}); 