import { ref } from 'vue';
import { createBatchSubmission, pollBatchSubmission } from '@/services/Professor/judge0api';
import { prepareStdin } from '@/services/Professor/judge0Service';

export const useCodeExecution = () => {
  const isExecuting = ref(false);
  const executionResults = ref<Array<{
    testcase: { input: string; expected_output: string };
    stdout: string;
    stderr: string;
    status: { id: number, description: string },
    error: string | null;
  }>>([]);
  const executionError = ref<string | null>(null);

  const executeCode = async (
    sourceCode: string,
    languageId: number,
    testcases: Array<{ input: string; expected_output: string }>
  ): Promise<{ executionResults: typeof executionResults.value; executionError: string | null }> => {
    isExecuting.value = true;
    executionResults.value = [];
    executionError.value = null;

    try {
      // Prepare submissions for all test cases
      const submissions = testcases.map(testcase => ({
        source_code: sourceCode,
        language_id: languageId,
        stdin: prepareStdin(testcase.input, languageId),
        expected_output: testcase.expected_output
      }));

      // Create batch submission
      const tokens = await createBatchSubmission(submissions);

      // Poll for results
      const results = await pollBatchSubmission(tokens);

      // Process results
      executionResults.value = results.map((result, index) => {
        if (!result) {
          return {
            testcase: { input: '', expected_output: '' },
            stdout: '',
            stderr: '',
            status: { id: 0, description: '' },
            error: 'No result received from Judge0'
          };
        }

        const testcase = testcases[index] || { input: '', expected_output: '' };
        let error = null;

        if (!result.status) {
          return {
            testcase,
            stdout: '',
            stderr: '',
            status: { id: 0, description: '' },
            error: 'Invalid response from Judge0: missing status'
          };
        }

        return {
          testcase,
          stdout: result.stdout || '',
          stderr: result.stderr || '',
          status: { id: result.status.id, description: result.status.description },
          error
        };
      });
    } catch (error) {
      executionError.value = error instanceof Error ? error.message : 'An unknown error occurred';
    } finally {
      isExecuting.value = false;
    }

    return {
      executionResults: executionResults.value,
      executionError: executionError.value
    };
  };

  return {
    isExecuting,
    executionResults,
    executionError,
    executeCode
  };
};
