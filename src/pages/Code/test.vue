<template>
  <v-container fluid class="pa-0 fill-height overflow-hidden">
    <v-row no-gutters class="fill-height">
      <!-- Problem Description Panel -->
      <v-col cols="3" class="border-right">
        <v-sheet class="fill-height d-flex flex-column">
          <v-tabs v-model="descriptionTab" bg-color="grey-darken-4">
            <v-tab value="description">Description</v-tab>
            <v-tab value="submission">Submission</v-tab>
          </v-tabs>
          
          <v-card-text class="problem-description pa-4 flex-grow-1 overflow-y-auto">
            <h2>Two sum</h2>
            <div class="problem-tags mb-4">
              <v-chip size="small" color="grey" class="mr-2">Easy</v-chip>
              <v-chip size="small" color="grey" class="mr-2">Array</v-chip>
              <v-chip size="small" color="grey">Hash table</v-chip>
            </div>

            <p>{{ problemDescription }}</p>
            
            <div class="examples mt-4">
              <h3>Example 1:</h3>
              <v-sheet color="grey-darken-3" class="pa-2 rounded">
                <p><strong>Input:</strong> nums = [2,7,11,15], target = 9</p>
                <p><strong>Output:</strong> [0,1]</p>
                <p><strong>Explanation:</strong> Because nums[0] + nums[1] = 9, we return [0,1].</p>
              </v-sheet>
            </div>

            <div class="examples mt-4">
              <h3>Example 2:</h3>
              <v-sheet color="grey-darken-3" class="pa-2 rounded">
                <p><strong>Input:</strong> nums = [3,2,4], target = 6</p>
                <p><strong>Output:</strong> [1,2]</p>
              </v-sheet>
            </div>

            <div class="constraints mt-4">
              <h3>Constraints:</h3>
              <ul>
                <li>2 <= nums.length <= 10^4</li>
                <li>-10^9 <= nums[i] <= 10^9</li>
                <li>-10^9 <= target <= 10^9</li>
              </ul>
            </div>
          </v-card-text>
        </v-sheet>
      </v-col>

      <!-- Code Editor Panel -->
      <v-col cols="9">
        <v-sheet class="h-100 d-flex flex-column overflow-hidden">
          <!-- Language selector and actions -->
          <v-toolbar dense color="grey-darken-4">
            <v-select
              v-model="selectedLanguage"
              :items="languages"
              density="compact"
              hide-details
              class="language-select"
              bg-color="grey-darken-3"
              width="150"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="success" class="mr-2" @click="runCode">Run</v-btn>
            <v-btn variant="tonal" color="primary" @click="submitCode">Submit</v-btn>
          </v-toolbar>

          <!-- Monaco Editor -->
          <div class="flex-grow-1 overflow-hidden">
            <MonacoEditor
              v-model:value="code"
              :options="editorOptions"
              theme="vs-dark"
              :language="selectedLanguage"
              class="h-100"
              @mount="handleEditorDidMount"
            />
          </div>

          <!-- Test Cases Panel -->
          <v-sheet class="test-cases" height="200" color="grey-darken-4">
            <v-tabs v-model="testTab" color="primary">
              <v-tab value="testcase">Testcase</v-tab>
              <v-tab value="result">Result</v-tab>
            </v-tabs>
            
            <v-window v-model="testTab">
              <v-window-item value="testcase">
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="testInput.nums"
                        label="nums ="
                        density="compact"
                        bg-color="grey-darken-3"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="testInput.target"
                        label="target ="
                        density="compact"
                        bg-color="grey-darken-3"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-window-item>

              <v-window-item value="result">
                <v-card-text>
                  <div v-if="testResult">
                    <pre>{{ testResult }}</pre>
                  </div>
                  <div v-else class="text-center">
                    Run code to see results
                  </div>
                </v-card-text>
              </v-window-item>
            </v-window>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import MonacoEditor from 'monaco-editor-vue3'

// State variables
const descriptionTab = ref('description')
const testTab = ref('testcase')
const selectedLanguage = ref('cpp')
const editor = ref(null)
const testResult = ref(null)

// Constants
const languages = ['cpp', 'java', 'python']

const defaultCode = {
  cpp: `// Implements
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `
}

const code = ref(defaultCode.cpp)

const editorOptions = {
  automaticLayout: true,
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  lineNumbers: 'on',
  glyphMargin: true,
  folding: true,
  renderLineHighlight: 'all',
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible'
  }
}

const problemDescription = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`

const testInput = ref({
  nums: '[2,7,11,15]',
  target: '9'
})

// Methods
const handleEditorDidMount = (editor) => {
  editor.value = editor
}

const runCode = async () => {
  try {
    // Here you would typically make an API call to execute the code
    testTab.value = 'result'
    testResult.value = `Running test case:
Input: nums = ${testInput.value.nums}, target = ${testInput.value.target}
Output: [0,1]
Time: 0ms
Memory: 10.2MB`
  } catch (error) {
    console.error('Error running code:', error)
  }
}

const submitCode = async () => {
  try {
    // Here you would typically make an API call to submit the code
    console.log('Submitting code:', code.value)
  } catch (error) {
    console.error('Error submitting code:', error)
  }
}

// Watch for language changes to update default code
watch(selectedLanguage, (newLang) => {
  code.value = defaultCode[newLang]
})

// Prevent body scrolling
onMounted(() => {
  document.body.style.overflow = 'hidden'
})
</script>

<style>
html, body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.border-right {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.problem-description {
  overflow-y: auto;
}

.language-select {
  width: 150px;
}

.test-cases {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

:deep(.v-field__input) {
  font-family: monospace;
}
</style>