import { defineStore } from "pinia";
import { CodeExerciseService } from "@/services/CodeExerciseService";

export const useCodeSolutionStore = defineStore("codeSolution", {
  state: () => ({
    aiSolution: null as string | null,
    isLoading: false,
    error: null as string | null,
    showAISolutionMap: new Map<number, boolean>(), // Track show/hide state per language
    solutionCache: new Map<number, string>(), // Cache solutions per language
    lastFetchedLanguage: null as number | null // Track the last language we fetched a solution for
  }),

  actions: {
    async fetchAISolution(exerciseId: string, languageId: number) {
      // Only fetch if we haven't fetched for this language yet
      if (this.lastFetchedLanguage === languageId) {
        return;
      }

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
          // Cache the solution
          this.solutionCache.set(languageId, response.data.solution);
          this.lastFetchedLanguage = languageId;
        }
      } catch (err) {
        this.error = "Failed to fetch AI solution";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    toggleSolution(languageId: number) {
      const currentState = this.showAISolutionMap.get(languageId) || false;
      this.showAISolutionMap.set(languageId, !currentState);
      // Reset lastFetchedLanguage when toggling to allow fetching again
      this.lastFetchedLanguage = null;
    },

    isShowingAISolution(languageId: number): boolean {
      return this.showAISolutionMap.get(languageId) || false;
    },

    reset(languageId?: number) {
      this.aiSolution = null;
      this.isLoading = false;
      this.error = null;
      this.lastFetchedLanguage = null;
      if (languageId !== undefined) {
        // Reset only the specified language
        this.showAISolutionMap.delete(languageId);
        this.solutionCache.delete(languageId);
      } else {
        // Reset all languages
        this.showAISolutionMap.clear();
        this.solutionCache.clear();
      }
    },

    // Helper method to check if a solution exists in cache
    hasCachedSolution(languageId: number): boolean {
      return this.solutionCache.has(languageId);
    }
  }
}); 