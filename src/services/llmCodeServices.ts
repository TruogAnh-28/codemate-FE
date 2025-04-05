import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { IResponseData } from "@/modals/apis/response";
import {CodeAnalysisRequest, CodeExplanation} from "@/types/LLM_code";
import { ChatMessage } from "@/types/chat";

export const llmCodeServices = {
    async getCodeExplanation(
        { showError, showSuccess }: AuthConfig,
        codeAnalysisRequest: CodeAnalysisRequest
    ) {
        return await ApiService.post<IResponseData<CodeExplanation[]>>(
            `llm/explain_code`,
            codeAnalysisRequest,
            { showError, showSuccess }
        );
    },

  /** Retrieve message history of the conversation associated with a coding exercise session of the student.
  * @param codeExerciseId: ID of the coding exercise.
  * @returns a list of messages which represents the chat history.
  * */
  async getMessageHistory(
      { showError, showSuccess }: AuthConfig,
      codeExerciseID: string
  ) {
        return await ApiService.get<IResponseData<ChatMessage[]>>(
            `/exercises/code/${codeExerciseID}/conversation/messages`,
            "",
            { showError, showSuccess }
        );
  }

};
