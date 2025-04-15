import ApiService from "@/common/api.service";
import { AuthConfig } from "./authenServices";
import { GeneratedCodeExerciseBrief, LanguageConfigDto, SubmissionDto, TestCaseDto } from "@/types/CodingExercise";
import { IResponseData } from "@/modals/apis/response";
import { ProgrammingLanguageConfig } from "@/types/CodingExercise";
import { ExerciseCodeResponse } from "@/types/Exercise";
import { CodeSolution } from "@/types/CodeSolution";

export const CodeExerciseService = {
  async getCodingExerciseDetail(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<ExerciseCodeResponse>>(`/exercises/${exerciseId}/code`, "", { showError, showSuccess })
  },

  async getListGeneratedCodeExercisesBrief(moduleId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<GeneratedCodeExerciseBrief[]>>(`/modules/${moduleId}/coding-exercises`, "", { showError, showSuccess })
  },

  async getCodingSubmissionsOfAnExercise(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<SubmissionDto[]>>(`/exercises/${exerciseId}/coding-submissions`, "", { showError, showSuccess })
  },

  async getLanguageConfigsOfAnExercise(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<LanguageConfigDto[]>>(`/exercises/${exerciseId}/language-configs`, "", { showError, showSuccess })
  },

  async getPublicTestcasesOfAnExercise(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<TestCaseDto[]>>(`/exercises/${exerciseId}/testcases`, "", { showError, showSuccess })
  },

  // New
  async getProgrammingLanguageConfigs(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<ProgrammingLanguageConfig[]>>(`/exercises/${exerciseId}/language-configs`, "", { showError, showSuccess })
  },

  async generateCodeExercise(moduleID: string, { showError, showSuccess }: AuthConfig) {
    // Generate a new coding exercise, in the case it doesn't exist, return the brief of the generated exercise, which includes
    // the id and name
    // the ID is used to redirect to the exercise detail page
    return ApiService.post<IResponseData<GeneratedCodeExerciseBrief>>(
      `/ai/generate-code-exercise`, { "module_id": moduleID }, { showError, showSuccess }
    )
  },

  async getAIGeneratedSolution(exerciseId: string, languageId: number, { showError, showSuccess }: AuthConfig) {
    return ApiService.post<IResponseData<CodeSolution>>(
      `/exercises/${exerciseId}/code-solution/${languageId}`, 
      {}, 
      { showError, showSuccess }
    )
  }
}
