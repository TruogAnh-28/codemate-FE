<template>
  <v-container fluid class="pa-0" style="height: 100vh; overflow: auto;">
    <v-row no-gutters class="fill-height">

      <!-- Problem Description Panel -->
      <div
        :style="{ width: sidebarWidth + 'px', minWidth: '400px', maxWidth: '50vw' }"
        class="resizable-sidebar fill-height"
      >
        <ProblemDescription
          :initial-tab="descriptionTab"
          :user-solution="userSolution"
          :problem-description="problemDescription"
          @update:tab="descriptionTab = $event"
        />
        <div class="resize-handle" @mousedown="startResize" />
      </div>

      <!-- Code Editor Panel -->
      <v-col class="fill-height d-flex flex-column" style="min-width: 420px;">
        <div class="d-flex flex-column fill-height">
          <CodeEditor
            v-if="exerciseDetail"
            modelValue="// Your code here\n"
            onUpdate:modelValue="fn"
            language="javascript"
            @run-result="handleRunResult"
            @submit-result="handleSubmitResult"
            @update:solution="userSolution = $event"
            @update:loading="isLoading = $event"
            :testInput="{ nums: JSON.stringify([2, 7, 11, 15]), target: '9' }"
            :problemDescription="problemDescription"
            :style="codeEditorStyle"
          />
          <Testcase
            :initial-tab="testTab"
            :result="testResult"
            :public-testcases="mappedPublicTestcases"
            @update:tab="testTab = $event"
            @update:input="handleTestInputUpdate"
            @toggle="handleTestcaseToggle"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { CodeExerciseService } from '@/services/CodeExerciseService';
import ProblemDescription from '@/components/Code/ProblemDescription.vue';
import CodeEditor from '@/components/Code/CodeEditor.vue';
import Testcase from '@/components/Code/Testcase.vue';
import { TestCaseDto } from '@/types/CodingExercise';

// Define the interfaces needed for the component
interface CustomTestcase {
  input: string;
  expected_output: string;
  isPublic?: false;
}

interface PublicTestcase {
  input: string;
  expected_output: string;
  isPublic: true;
}

interface RouteParams {
  exerciseId: string;
}

const userSolution = ref('');

const route = useRoute();
const { exerciseId } = route.params as RouteParams;

// UI States
const descriptionTab = ref('description');
const testTab = ref('testcase');
const testResult = ref('');
const isLoading = ref(false);
const testcaseExpanded = ref(true);
const publicTestcases = ref<TestCaseDto[]>([]);
const exerciseDetail = ref<ExerciseCodeResponseForStudent | null>(null);
const problemDescription = computed(() => exerciseDetail.value?.description ?? '');

onMounted(async () => {
  try {
    const response = await CodeExerciseService.getCodingExerciseDetail(exerciseId, {
      showError: (message: string) => console.error(message),
      showSuccess: (message: string) => console.log(message),
    });

    const exerciseObject = response.data;
    exerciseDetail.value = exerciseObject;
  } catch (err) {
    console.error('Failed to load exercise', err);
  }
})

// Fetch public testcases
const fetchPublicTestcases = async () => {
  try {
    const res = await CodeExerciseService.getPublicTestcasesOfAnExercise(exerciseId, {
      showError: (message: string) => console.error(message),
      showSuccess: (message: string) => console.log(message),
    });

    if (res.data) {
      publicTestcases.value = res.data as TestCaseDto[];
    }
  } catch (err) {
    console.error('Failed to fetch public testcases:', err);
  }
};

// Map public testcases to the format expected by Testcase component
const mappedPublicTestcases = computed<PublicTestcase[]>(() => {
  return publicTestcases.value.map(tc => ({
    input: typeof tc.input === 'string' ? tc.input : '',
    expected_output: typeof tc.expected_output === 'string' ? tc.expected_output : '',
    isPublic: true as const
  }));
});

onMounted(fetchPublicTestcases);

// Computed dynamic height for CodeEditor
const codeEditorStyle = computed(() => ({
  height: testcaseExpanded.value ? '60%' : 'calc(100% - 36px)',
  minHeight: testcaseExpanded.value ? '300px' : '500px',
  maxHeight: testcaseExpanded.value ? 'calc(100vh - 300px)' : 'calc(100vh - 100px)',
  overflow: 'auto',
  transition: 'height 0.2s ease-in-out',
}));

// Handlers
const handleRunResult = (result: string) => {
  testResult.value = result;
  testTab.value = 'result';
  testcaseExpanded.value = true;
};

const handleSubmitResult = (result: string) => {
  testResult.value = result;
  testTab.value = 'result';
  descriptionTab.value = 'submission';
  testcaseExpanded.value = true;
};

const handleTestcaseToggle = (expanded: boolean) => {
  testcaseExpanded.value = expanded;
};

// Handle test input updates from the Testcase component
const handleTestInputUpdate = (customTestcases: CustomTestcase[]) => {
  // We could convert these custom testcases to TestInput format if needed
  console.log('Custom testcases updated:', customTestcases);
  // This is just a placeholder implementation since we're not actually using
  // the custom testcases in this component
};

// Sidebar resize
const sidebarWidth = ref(500);
const startResize = (e: MouseEvent) => {
  const startX = e.clientX;
  const startW = sidebarWidth.value;
  const onMouseMove = (e: MouseEvent) => {
    sidebarWidth.value = Math.max(240, startW + (e.clientX - startX));
  };
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};
</script>

<style>
html, body {
  overflow: auto;
  height: 100%;
  margin: 0;
  padding: 0;
}

.border-right {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.resizable-sidebar {
  position: relative;
  background-color: #1e1e1e;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
}
</style>
