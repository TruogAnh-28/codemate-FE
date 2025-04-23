import { ref } from 'vue';
import { programmingSubmissionService } from '@/services/programmingSubmissionService';
import { ProgrammingSubmission, ProgrammingSubmissionStat } from '@/types/ProgrammingSubmission';

// Composable for managing programming submissions
export function useProgrammingSubmissions(useMockData = false) {
  const submissions = ref<ProgrammingSubmissionStat[]>([]);
  const isLoading = ref(false);

  // Mock data for development and testing
  const mockSubmissions: ProgrammingSubmissionStat[] = [
    {
      id: 'mock-1',
      user_id: 'user-1',
      exercise_id: 'ex-123',
      judge0_language_id: 71,
      status: 'completed',
      passed_testcases: 1,
      total_testcases: 2,
      created_at: new Date()
    }
  ];

  // Function to fetch submission statistics for an exercise
  const fetchSubmissionStats = async (exerciseId: string) => {
    if (useMockData) {
      submissions.value = mockSubmissions;
      return mockSubmissions;
    }

    isLoading.value = true;
    try {
      const response = await programmingSubmissionService.getSubmissionsOfACodeExercise(exerciseId);
      if (response.data) {
        submissions.value = response.data;
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching submission stats:', error);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Mock detailed submission with test results
  const mockDetailedSubmission: ProgrammingSubmission = {
    id: 'mock-1',
    user_id: 'user-1',
    exercise_id: 'ex-123',
    judge0_language_id: 71,
    status: 'completed',
    code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}',
    score: 50,
    test_results: [
      {
        id: 'tr-1',
        submission_id: 'mock-1',
        testcase_id: 'tc-1',
        judge0_token: 'token-1',
        status: 'Accepted',
        stdout: '[0,1]',
        stderr: null,
        time: 0.032,
        memory: 12345,
        testcase: {
          id: 'tc-1',
          input: '2 7 11 15\n9',
          expected_output: '[0,1]',
          is_public: true
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'tr-2',
        submission_id: 'mock-1',
        testcase_id: 'tc-2',
        judge0_token: 'token-2',
        status: 'Wrong Answer',
        stdout: 'null',
        stderr: null,
        time: 0.035,
        memory: 12400,
        testcase: {
          id: 'tc-2',
          input: '3 2 4\n6',
          expected_output: '[1,2]',
          is_public: true
        },
        created_at: new Date(),
        updated_at: new Date()
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  };

  // Fetch detailed submission data
  const fetchSubmissionDetail = async (submissionId: string): Promise<ProgrammingSubmission | null> => {
    if (useMockData) {
      return mockDetailedSubmission;
    }

    isLoading.value = true;
    try {
      const response = await programmingSubmissionService.getSubmissionDetails(submissionId);
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching submission details:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Submit code for a programming exercise
  const submitCodeWithPolling = async (
    exerciseId: string,
    languageId: number,
    code: string,
    callbacks: {
      onComplete: (submission: ProgrammingSubmission) => void;
      onError: (error: Error) => void;
    }
  ) => {
    try {
      // Create submission
      const res = await programmingSubmissionService.createProgrammingSubmission(
        exerciseId,
        languageId,
        code
      );

      if (!res.data) {
        throw new Error('Failed to create submission: No data returned');
      }

      const { id } = res.data;

      if (!id) {
        throw new Error('Failed to create submission: No ID returned');
      }

      // Add to the list of submissions
      // const newStat = await fetchSubmissionStats(exerciseId);
      
      // Get the detailed submission
      const newSubmission = await fetchSubmissionDetail(id);
      
      if (newSubmission) {
        callbacks.onComplete(newSubmission);
      } else {
        throw new Error('Failed to retrieve submission details');
      }
    } catch (error) {
      console.error('Error in submission process:', error);
      callbacks.onError(error instanceof Error ? error : new Error('Unknown error during submission'));
    }
  };

  // Poll for submission status - Utility function for more complex workflows
  // const pollSubmissionStatus = async (id: string, interval = 3000): Promise<string | null> => {
  //   try {
  //     const response = await programmingSubmissionService.getSubmissionStatus(id);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error polling submission status for ${id}:`, error);
  //     return null;
  //   }
  // };

  return {
    submissions,
    isLoading,
    fetchSubmissionStats,
    fetchSubmissionDetail,
    submitCodeWithPolling,
  };
}