import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import { SubmissionRequest, SubmissionResult, SubmissionResponse } from "@/types/Judge0API";
import { IResponseData } from "@/modals/apis/response";
import { JUDGE0_API } from "@/common/config";

export const createSubmission = async (
  // { showError, showSuccess }: AuthConfig,
  sourceCode: string, 
  languageId: number, 
  stdin?: string, 
  expectedOutput?: string
): Promise<IResponseData<SubmissionResponse>> => {
  return await ApiService.post<IResponseData<SubmissionResponse>>(
    `${JUDGE0_API.baseURL}/submissions`,
    {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin,
      expected_output: expectedOutput
    } as SubmissionRequest,
    // {showError, showSuccess}
  );
};

export const getSubmission = async (
  token: string,
  { showError, showSuccess }: AuthConfig 
): Promise<IResponseData<SubmissionResult>> => {
  return await ApiService.get<IResponseData<SubmissionResult>>(
    `${JUDGE0_API.baseURL}/submissions/${token}`,
    "",
    {
      headers: JUDGE0_API.headers,
      params: { base64_encoded: false },
      showError,
      showSuccess
    }  
  );
};

// Poll submission until it's done
export const pollSubmission = async (
  token: string,
  { showError, showSuccess }: AuthConfig
): Promise<SubmissionResult> => {
  let submissionResponse: IResponseData<SubmissionResult>;
  let submission: SubmissionResult | null = null;
  
  do {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    submissionResponse = await getSubmission(token, { showError, showSuccess });
    submission = submissionResponse.data;
    
    if (!submission) {
      throw new Error("Failed to get submission result");
    }
    
  } while (submission.status.id <= 2); // 1: In Queue, 2: Processing
  
  return submission;
};

type ProgrammingLanguage = 'cpp' | 'java' | 'python';

export const prepareStdin = (
  language: ProgrammingLanguage, 
  nums: string, 
  target: string | number
): string => {
  try {
    if (language === 'cpp' || language === 'java' || language === 'python') {
      return `${nums}\n${target}`;
    }
    return '';
  } catch (e) {
    console.error('Error parsing input:', e);
    return '';
  }
};