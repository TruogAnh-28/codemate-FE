import { ref, watch, onMounted } from 'vue';
import { CodeExerciseService } from '@/services/CodeExerciseService';

export interface Testcase {
  input: string;
  expected_output: string;
  isPublic: boolean;
}

export function useTestcaseManager(exerciseId: string, initialResult = '') {
  const testResult = ref(initialResult);
  const testTab = ref('testcase');
  const isExpanded = ref(true);
  const testcases = ref<Testcase[]>([]); // unified list

  const fetchTestcases = async () => {
    try {
      const res = await CodeExerciseService.getPublicTestcasesOfAnExercise(exerciseId, {
        showError: (message: string) => console.error(message),
        showSuccess: (message: string) => console.log(message),
      });

      if (res.data) {
        testcases.value = res.data.map((tc: any) => ({
          input: tc.input || '',
          expected_output: tc.expected_output || '',
          isPublic: true,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch testcases:', err);
    }
  };

  const addTestcase = () => {
    console.log('Adding new testcase');
    testcases.value = [
      ...testcases.value,
      { input: '', expected_output: '', isPublic: true }
    ];
  };

  const removeTestcase = (index: number) => {
    if (index >= 0 && index < testcases.value.length) {
      testcases.value.splice(index, 1);
    }
  };

  const onInputChange = (index: number, field: 'input' | 'expected_output', value: string) => {
    testcases.value[index][field] = value;
  };


  watch(testResult, (newVal) => {
    if (newVal) {
      testTab.value = 'result';
      isExpanded.value = true;
    }
  });

  // Fetch on mount
  onMounted(fetchTestcases);

  return {
    testResult,
    testTab,
    isExpanded,
    testcases,
    addTestcase,
    removeTestcase,
    onInputChange,
    fetchTestcases,
  };
}

