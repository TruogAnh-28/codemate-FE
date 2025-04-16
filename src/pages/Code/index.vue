<template>
  <v-container fluid class="pa-0 fill-height" style="overflow: auto;">
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
            :testInput="{ nums: JSON.stringify([2, 7, 11, 15]), target: '9' }"
            :problemDescription="problemDescription"
            :testcases="testcases"
            @run-result="handleRunResult"
            @submit-result="handleSubmitResult"
            @update:solution="userSolution = $event"
            @update:loading="isLoading = $event"
            :style="codeEditorStyle"
          />
          <Testcase
            :testcases="testcases"
            :initial-tab="testTab"
            :result="testResult"
            @update:tab="testTab = $event"
            @update:input="handleTestInputUpdate"
            @toggle="handleTestcaseToggle"
            @add-custom="handleAddCustomTestcase"
            @remove-testcase="handleRemoveTestcase"
            :style="testcaseStyle"
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
import { useTestcaseManager } from '@/composables/useTestcaseManager';
import { ExerciseCodeResponse } from '@/types/Exercise';

interface RouteParams {
  exerciseId: string;
}

const userSolution = ref('');

const route = useRoute();
const { exerciseId } = route.params as RouteParams;

// UI States
const descriptionTab = ref('description');
const testTab = ref('testcase');
const isLoading = ref(false);
const exerciseDetail = ref<ExerciseCodeResponse | null>(null);
const problemDescription = computed(() => exerciseDetail.value?.description ?? '');

const {
  testResult,
  isExpanded: testcaseExpanded,
  testcases,
  addTestcase,
  removeTestcase,
  onInputChange,
} = useTestcaseManager(exerciseId);

const handleAddCustomTestcase = () => {
  addTestcase();
};

const handleRemoveTestcase = (index: number) => {
  removeTestcase(index);
};

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

const handleTestInputUpdate = (index: number, field: 'input' | 'expected_output', value: string) => {
  onInputChange(index, field, value);
};

// Computed dynamic height for CodeEditor
const codeEditorStyle = computed(() => ({
  height: testcaseExpanded.value ? '60%' : 'calc(100% - 36px)',
  minHeight: testcaseExpanded.value ? '300px' : '500px',
  maxHeight: testcaseExpanded.value ? 'calc(100vh - 300px)' : 'calc(100vh - 100px)',
  overflow: 'auto',
  transition: 'height 0.2s ease-in-out',
}));

// Add this computed property
const testcaseStyle = computed(() => ({
  height: testcaseExpanded.value ? '40%' : '36px',
  minHeight: testcaseExpanded.value ? '200px' : '36px',
  maxHeight: testcaseExpanded.value ? 'calc(100vh - 300px)' : '36px',
  overflow: 'hidden',
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
  height: 100%;
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

/* Add these new styles */
.v-container {
  height: 100vh;
}

.v-row {
  height: 100%;
}

.v-col {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.d-flex.flex-column {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
