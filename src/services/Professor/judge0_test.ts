import axios from 'axios';
import { SubmissionResult, SubmissionResponse } from "@/types/Judge0API";
import { JUDGE0_API } from "@/common/config";
import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";

// Judge0API service with AuthConfig integration
export const judge0ApiService = {
  // Create submission to Judge0
  async createSubmission(
    { showError, showSuccess }: AuthConfig,
    sourceCode: string, 
    languageId: number, 
    stdin: string, 
    expectedOutput?: string
  ): Promise<string> {
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
      
      const response = await ApiService.post<SubmissionResponse>(
        `${JUDGE0_API.baseURL}/submissions?base64_encoded=true`,
        payload,
        { showError, showSuccess, headers: JUDGE0_API.headers }
      );
      
      return response.token;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  },

  // Get submission details
  async getSubmission(
    { showError, showSuccess }: AuthConfig,
    token: string
  ): Promise<SubmissionResult> {
    try {
      const response = await ApiService.get<SubmissionResult>(
        `${JUDGE0_API.baseURL}/submissions/${token}?base64_encoded=true`,
        "",
        { showError, showSuccess, headers: JUDGE0_API.headers }
      );
      
      const data = response;
      
      // Giải mã kết quả từ base64 với kiểm tra an toàn
      if (data.stdout) {
        try {
          data.stdout = decodeURIComponent(escape(atob(data.stdout)));
        } catch (e) {
          console.warn("Cannot decode stdout from base64, using raw value:", e);
          // Giữ giá trị gốc nếu không thể giải mã
        }
      }
      if (data.stderr) {
        try {
          data.stderr = decodeURIComponent(escape(atob(data.stderr)));
        } catch (e) {
          console.warn("Cannot decode stderr from base64, using raw value:", e);
          // Giữ giá trị gốc nếu không thể giải mã
        }
      }
      if (data.compile_output) {
        try {
          data.compile_output = decodeURIComponent(escape(atob(data.compile_output)));
        } catch (e) {
          console.warn("Cannot decode compile_output from base64, using raw value:", e);
          // Giữ giá trị gốc nếu không thể giải mã
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error getting submission:', error);
      throw error;
    }
  },

  // Poll submission until it's done
  async pollSubmission(
    { showError, showSuccess }: AuthConfig,
    token: string
  ): Promise<SubmissionResult> {
    let submission: SubmissionResult;
    const maxTries = 10;
    let tries = 0;
    
    do {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        submission = await this.getSubmission({ showError, showSuccess }, token);
        tries++;
        
        if (tries >= maxTries) {
          throw new Error('Timeout waiting for submission result');
        }
      } catch (error:any) {
        if (axios.isAxiosError(error) && error.response) {
          // Nếu là lỗi API
          const statusCode = error.response.status;
          const errorMessage = error.response.data?.error || error.message;
          throw new Error(`API Error (${statusCode}): ${errorMessage}`);
        } else if (error.compile_output || error.stderr) {
          // Trả về chính đối tượng lỗi nếu có thông tin lỗi biên dịch hoặc lỗi runtime
          throw error;
        } else {
          throw error;
        }
      }
    } while (submission.status.id <= 2); // 1: In Queue, 2: Processing
    
    // Nếu có lỗi biên dịch hoặc lỗi runtime, trả về thông tin lỗi
    if (submission.status.id !== 3) { // Not Accepted
      if (submission.compile_output || submission.stderr) {
        // Tạo một error object chứa thông tin lỗi compile hoặc runtime
        const errorObj: any = new Error('Code execution failed');
        errorObj.compile_output = submission.compile_output;
        errorObj.stderr = submission.stderr;
        throw errorObj;
      }
    }
    
    return submission;
  },

  // Prepare input data based on language
  prepareStdin(language: string, nums: string, target: string): string {
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
  },

  // Handle API errors
  handleApiError(error: any): string {
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
  },

  // Safely decode base64 string
  safeBase64Decode(str: string): string {
    if (!str) return '';
    
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      console.warn("Failed to decode base64 string:", e);
      return str; // Return original string if decoding fails
    }
  }
};