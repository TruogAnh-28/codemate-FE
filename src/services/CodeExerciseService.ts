import ApiService from "@/common/api.service";
import { AuthConfig } from "./authenServices";
import { LanguageConfigDto, SubmissionDto } from "@/types/CodingExercise";
import { IResponseData } from "@/modals/apis/response";
import { ProgrammingLanguageConfig } from "@/types/ProgrammingLanguageConfig";

export const CodeExerciseService = {
  async getCodingSubmissionsOfAnExercise(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<SubmissionDto[]>>(`/exercises/${exerciseId}/coding-submissions`, "", { showError, showSuccess })
  },

  async getLanguageConfigsOfAnExercise(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<LanguageConfigDto[]>>(`/exercises/${exerciseId}/language-configs`, "", { showError, showSuccess })
  },

  async getPublicTestcasesOfAnExercise(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<LanguageConfigDto[]>>(`/exercises/${exerciseId}/testcases`, "", { showError, showSuccess })
  },

  // New
  async getProgrammingLanguageConfigs(exerciseId: string, { showError, showSuccess }: AuthConfig) {
    return ApiService.get<IResponseData<ProgrammingLanguageConfig[]>>(`/exercises/${exerciseId}/language-configs`, "", { showError, showSuccess })
  }
}
