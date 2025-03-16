import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { IResponseData } from "@/modals/apis/response";
import {CodeAnalysisRequest, CodeExplanation} from "@/types/LLM_code";

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
};