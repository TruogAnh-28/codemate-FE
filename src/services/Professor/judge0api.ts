import axios, { AxiosResponse } from 'axios';
import {  SubmissionResult, SubmissionResponse } from "@/types/Judge0API";
import { JUDGE0_API } from "@/common/config";

// Define interfaces for API responses and requests

// Create submission to Judge0
export const createSubmission = async (
  sourceCode: string, 
  languageId: number, 
  stdin: string, 
  expectedOutput?: string
): Promise<string> => {
  try {
    const response: AxiosResponse<SubmissionResponse> = await axios.post(
      `${JUDGE0_API.baseURL}/submissions`, 
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin,
        expected_output: expectedOutput
      }, 
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
      `${JUDGE0_API.baseURL}/submissions/${token}`, 
      {
        headers: JUDGE0_API.headers,
        params: { base64_encoded: false }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error getting submission:', error);
    throw error;
  }
};

// Poll submission until it's done
export const pollSubmission = async (token: string): Promise<SubmissionResult> => {
  let submission: SubmissionResult;
  
  do {
    await new Promise(resolve => setTimeout(resolve, 1000));
    submission = await getSubmission(token);
  } while (submission.status.id <= 2); // 1: In Queue, 2: Processing
  
  return submission;
};

// Prepare input data based on language
export const prepareStdin = (language: string, nums: string, target: string): string => {
  try {
    if (language === 'cpp' || language === 'java') {
      return `${nums}\n${target}`;
    } else if (language === 'python') {
      return `${nums}\n${target}`;
    }
    return '';
  } catch (e) {
    console.error('Error parsing input:', e);
    return '';
  }
};