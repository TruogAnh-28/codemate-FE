import { defineStore } from "pinia";
import { GeneratedCodeExerciseBrief } from "@/types/CodingExercise";
import { CodeExerciseService } from "@/services/CodeExerciseService";

export const useGeneratedCodeExerciseStore = defineStore("generatedCodeExercise", {
  state: () => ({
    exercises: [] as GeneratedCodeExerciseBrief[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async loadExercises(moduleId: string) {
      this.loading = true;
      try {
        const response = await CodeExerciseService.getListGeneratedCodeExercisesBrief(moduleId, {showError: () => {}, showSuccess: () => {}});
        this.exercises = response.data || [];
      } catch (err) {
        this.error = "Failed to fetch exercises";
      } finally {
        this.loading = false;
      }
    },
    async generateExercise(moduleId: string) {
      this.loading = true;
      try {
        const response = await CodeExerciseService.generateCodeExercise(moduleId, {showError: () => {}, showSuccess: () => {}});
        if (response.data) {
          this.exercises.push(response.data);
        }
      } catch (err) {
        this.error = "Failed to generate exercise";
      } finally {
        this.loading = false;
      }
    },
    async deleteCodingExercise(
      exerciseID: string,
      apiCallConfigs: { showError: (msg: string) => void , showSuccess: (msg: string) => void}
    ) {
      console.log("//");
      try {
        const response = await CodeExerciseService.deleteAIGenCodeExercise(
          exerciseID, {showSuccess: apiCallConfigs.showSuccess, showError: apiCallConfigs.showError}
        );

      const deletedCodeExercise = response.data;

      if (deletedCodeExercise) {
        const index = this.exercises.findIndex(exercise => exercise.id == deletedCodeExercise.id);
        this.exercises.splice(index);
        console.log(this.exercises);
      }

      } catch (err) {
        this.error = "Failed to delete coding exercise.";
      } finally {

      }
    },
  }
});

