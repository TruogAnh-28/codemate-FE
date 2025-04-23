import axios, { AxiosResponse } from 'axios';
import { SubmissionResult, SubmissionResponse } from "@/types/Judge0API";
import { JUDGE0_API } from "@/common/config";

// Create submission to Judge0
export const createSubmission = async (
  sourceCode: string,
  languageId: number,
  stdin: string,
  expectedOutput?: string
): Promise<string> => {
  try {
    // Mã hóa dữ liệu thành base64 để tránh vấn đề với UTF-8
    const base64SourceCode = btoa(unescape(encodeURIComponent(sourceCode)));
    const base64Stdin = stdin ? btoa(unescape(encodeURIComponent(stdin))) : null;
    const base64ExpectedOutput = expectedOutput ? btoa(unescape(encodeURIComponent(expectedOutput))) : null;

    const payload = {
      source_code: base64SourceCode,
      language_id: languageId,
      stdin: base64Stdin,
      expected_output: base64ExpectedOutput
    };

    const response: AxiosResponse<SubmissionResponse> = await axios.post(
      `${JUDGE0_API.baseURL}/submissions?base64_encoded=true`,
      payload,
      {
        headers: JUDGE0_API.headers
      }
    );

    return response.data.token;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
};

// Get submission details
export const getSubmission = async (token: string): Promise<SubmissionResult> => {
  try {
    const response: AxiosResponse<SubmissionResult> = await axios.get(
      `${JUDGE0_API.baseURL}/submissions/${token}?base64_encoded=true`,
      {
        headers: JUDGE0_API.headers
      }
    );

    const data = response.data;

    // Giải mã kết quả từ base64
    if (data.stdout) {
      data.stdout = decodeURIComponent(escape(atob(data.stdout)));
    }
    if (data.stderr) {
      data.stderr = decodeURIComponent(escape(atob(data.stderr)));
    }
    if (data.compile_output) {
      data.compile_output = decodeURIComponent(escape(atob(data.compile_output)));
    }

    return data;
  } catch (error) {
    console.error('Error getting submission:', error);
    throw error;
  }
};

// Poll submission until it's done
export const pollSubmission = async (token: string): Promise<SubmissionResult> => {
  let submission: SubmissionResult;
  const maxTries = 10;
  let tries = 0;

  do {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      submission = await getSubmission(token);
      tries++;

      if (tries >= maxTries) {
        throw new Error('Timeout waiting for submission result');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.error || error.message;
        throw new Error(`API Error (${statusCode}): ${errorMessage}`);
      }
      throw error;
    }
  } while (submission.status.id <= 2); // 1: In Queue, 2: Processing

  return submission;
};

// Prepare input data based on language
export const prepareStdin = (language: string, nums: string, target: string): string => {
  try {
    if (!nums || !target) {
      throw new Error('Invalid input data: nums or target is undefined');
    }

    if (language === 'cpp' || language === 'java') {
      return `${nums}\n${target}`;
    } else if (language === 'python') {
      return `${nums}\n${target}`;
    } else {
      // Mặc định cho các ngôn ngữ khác
      return `${nums}\n${target}`;
    }
  } catch (e) {
    console.error('Error parsing input:', e);
    throw new Error(`Error preparing input: ${e}`);
  }
};

export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const statusCode = error.response.status;
      const errorData = error.response.data;

      let errorMessage = `Error (${statusCode}): `;
      if (typeof errorData === 'object' && errorData !== null) {
        errorMessage += errorData.error || errorData.message || JSON.stringify(errorData);
      } else if (typeof errorData === 'string') {
        errorMessage += errorData;
      } else {
        errorMessage += error.message;
      }

      return errorMessage;
    } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      return 'Error: No response received from server';
    } else {
      // Lỗi khác khi thiết lập yêu cầu
      return `Error setting up request: ${error.message}`;
    }
  }
  // Lỗi không phải từ Axios
  return `Error: ${error.message || 'Unknown error'}`;
};

// Create batch submission to Judge0
export const createBatchSubmission = async (
  submissions: Array<{
    source_code: string;
    language_id: number;
    stdin: string;
    expected_output?: string;
  }>
): Promise<string[]> => {
  try {
    const base64Submissions = submissions.map(sub => ({
      ...sub,
      source_code: btoa(unescape(encodeURIComponent(sub.source_code))),
      stdin: sub.stdin ? btoa(unescape(encodeURIComponent(sub.stdin))) : null,
      expected_output: sub.expected_output ? btoa(unescape(encodeURIComponent(sub.expected_output))) : null
    }));

    const response = await axios.post<Array<{ token: string }>>(
      `${JUDGE0_API.baseURL}/submissions/batch?base64_encoded=true`,
      { submissions: base64Submissions },
      {
        headers: JUDGE0_API.headers
      }
    );

    return response.data.map(sub => sub.token);
  } catch (error) {
    console.error('Error creating batch submission:', error);
    throw error;
  }
};

// Get batch submission results
export const getBatchSubmission = async (tokens: string[]): Promise<SubmissionResult[]> => {
  try {
    const response = await axios.get<{ submissions: SubmissionResult[] }>(
      `${JUDGE0_API.baseURL}/submissions/batch?tokens=${tokens.join(',')}&base64_encoded=true`,
      {
        headers: JUDGE0_API.headers
      }
    );

    // Decode base64 responses
    return response.data.submissions.map(sub => ({
      ...sub,
      stdout: sub.stdout ? decodeURIComponent(escape(atob(sub.stdout))) : null,
      stderr: sub.stderr ? decodeURIComponent(escape(atob(sub.stderr))) : null,
      compile_output: sub.compile_output ? decodeURIComponent(escape(atob(sub.compile_output))) : null
    }));
  } catch (error) {
    console.error('Error getting batch submission:', error);
    throw error;
  }
};

// Poll batch submission until all are done
export const pollBatchSubmission = async (tokens: string[]): Promise<SubmissionResult[]> => {
  let results: SubmissionResult[];
  const maxTries = 10;
  const maxRetries = 3;
  let tries = 0;
  let retryCount = 0;
  let baseDelay = 1000; // Start with 1 second

  do {
    try {
      await new Promise(resolve => setTimeout(resolve, baseDelay));
      results = await getBatchSubmission(tokens);
      tries++;

      if (tries >= maxTries) {
        throw new Error('Timeout waiting for batch submission results');
      }

      // Check if all submissions are done (status.id > 2)
      const allDone = results.every(result => result.status.id > 2);
      if (allDone) break;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        if (retryCount >= maxRetries) {
          throw new Error('Rate limit exceeded after multiple retries');
        }
        // Exponential backoff: 1s, 2s, 4s
        baseDelay *= 2;
        retryCount++;
        continue;
      }
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.error || error.message;
        throw new Error(`API Error (${statusCode}): ${errorMessage}`);
      }
      throw error;
    }
  } while (true);

  return results;
};
