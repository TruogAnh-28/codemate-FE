<template>
  <v-card variant="outlined" class="pa-4 mb-3 rounded-lg">
    <div class="template-section mb-4">
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
        <h3 class="text-subtitle-1 font-weight-bold mb-0">Template Format</h3>
      </div>
      
      <div class="input-config mb-3">
        <div class="d-flex align-center mb-2">
          <v-icon color="primary" class="mr-2">mdi-tune</v-icon>
          <h4 class="text-subtitle-2 font-weight-medium mb-0">Input Configuration</h4>
        </div>
        
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="inputColumnCount"
              label="Number of input columns"
              type="number"
              min="1"
              max="10"
              hint="Limit from 1-10 input columns"
              variant="outlined"
              density="compact"
              class="rounded-lg"
              @update:model-value="generateColumns"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" sm="6">
            <v-btn
              color="secondary"
              variant="tonal"
              prepend-icon="mdi-refresh"
              class="rounded-lg"
              @click="generateColumns"
            >
              Update Structure
            </v-btn>
          </v-col>
        </v-row>
        
        <v-expand-transition>
          <div v-if="inputColumns.length > 0" class="mt-3">
            <v-table density="compact" class="rounded-lg border">
              <thead>
                <tr class="bg-grey-lighten-3">
                  <th>No.</th>
                  <th>Column Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(col, index) in inputColumns" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <v-text-field
                      v-model="col.name"
                      density="compact"
                      variant="plain"
                      hide-details
                      placeholder="Column name"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="col.description"
                      density="compact"
                      variant="plain"
                      hide-details
                      placeholder="Description"
                    ></v-text-field>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-expand-transition>
      </div>
      
      <v-sheet rounded="lg" elevation="1" class="pa-2 mb-3 bg-grey-lighten-4">
        <v-table density="compact" class="rounded-lg">
          <thead>
            <tr class="bg-grey-lighten-3">
              <th class="text-primary">Description</th>
              <template v-for="(col, index) in inputColumns" :key="index">
                <th class="text-primary">{{ col.name || 'Input' + (index + 1) }}</th>
              </template>
              <th class="text-primary">ExpectedOutput</th>
              <th class="text-primary">IsHidden</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic test</td>
              <template v-for="(_, index) in inputColumns" :key="index">
                <td>{{ getSampleInput(index) }}</td>
              </template>
              <td>6</td>
              <td>FALSE</td>
            </tr>
            <tr>
              <td>Edge case</td>
              <template v-for="(_, index) in inputColumns" :key="index">
                <td>{{ index === 0 ? '[]' : 'null' }}</td>
              </template>
              <td>0</td>
              <td>TRUE</td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-file-download-outline"
        class="rounded-lg px-4"
        @click="downloadTestCaseTemplate"
      >
        Download Template
      </v-btn>
    </div>

    <div class="import-section">
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="mr-2">mdi-cloud-upload-outline</v-icon>
        <h3 class="text-subtitle-1 font-weight-bold mb-0">Upload Test Cases</h3>
      </div>
      <div
        class="drop-zone pa-6 text-center"
        :class="{ 
          dragging: isDragging, 
          'has-file': testCaseFile !== undefined 
        }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop="handleTestCaseFileDrop"
      >
        <v-icon
          size="40"
          class="mb-2"
          :color="testCaseFile ? 'success' : 'primary'"
        >
          {{ testCaseFile ? "mdi-check-circle" : "mdi-cloud-upload-outline" }}
        </v-icon>
        <p class="mb-2">
          {{
            testCaseFile
              ? "File uploaded successfully!"
              : "Drag and drop Excel file here or"
          }}
        </p>
        <v-btn
          :color="testCaseFile ? 'success' : 'primary'"
          variant="elevated"
          class="rounded-lg px-4"
          prepend-icon="mdi-file-excel"
          @click="triggerTestCaseFileInput"
        >
          {{ testCaseFile ? "Change File" : "Upload Excel" }}
        </v-btn>
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx, .xls"
          style="display: none"
          @change="handleTestCaseFileChange"
        />
      </div>

      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="primary"
        class="mt-3 rounded-xl"
      ></v-progress-linear>

      <v-alert
        v-if="errors.length"
        type="error"
        variant="tonal"
        class="mt-3 rounded-lg"
        border="start"
        :text="errors.join(', ')"
      ></v-alert>

      <v-expand-transition>
        <div v-if="previewData.length" class="mt-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-table</v-icon>
              <h3 class="text-subtitle-1 font-weight-bold mb-0">Preview Test Cases</h3>
            </div>
            <v-chip color="success" size="small">{{ previewData.length }} Cases</v-chip>
          </div>
          <v-sheet rounded="lg" elevation="1" class="pa-2 mb-3 bg-grey-lighten-4">
            <v-table density="compact" class="rounded-lg">
              <thead>
                <tr class="bg-grey-lighten-3">
                  <th class="text-primary">Description</th>
                  <template v-for="(col, index) in inputColumns" :key="index">
                    <th class="text-primary">{{ col.name || 'Input' + (index + 1) }}</th>
                  </template>
                  <th class="text-primary">Output</th>
                  <th class="text-primary">Hidden</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tc, i) in previewData.slice(0, 3)" :key="i">
                  <td>{{ tc.description || 'No description' }}</td>
                  <template v-for="(_, index) in inputColumns" :key="index">
                    <td>{{ truncateText(tc.inputs && tc.inputs[index] ? tc.inputs[index] : 'N/A', 20) }}</td>
                  </template>
                  <td>{{ truncateText(tc.output, 20) }}</td>
                  <td>
                    <v-icon :color="tc.is_hidden ? 'success' : 'error'">
                      {{ tc.is_hidden ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                  </td>
                </tr>
                <tr v-if="previewData.length > 3">
                  <td colspan="4" class="text-center text-body-2 text-medium-emphasis">
                    + {{ previewData.length - 3 }} more test cases
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-sheet>

          <div class="d-flex justify-end mt-2">
            <v-btn
              color="error"
              variant="text"
              class="mr-2"
              @click="cancel"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              @click="confirmImport"
            >
              Import Test Cases
            </v-btn>
          </div>
        </div>
      </v-expand-transition>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import * as XLSX from 'xlsx';

defineProps<{
  questionIndex: number
}>();

const emit = defineEmits<{
  'test-cases-imported': [testCases: any[]],
  'cancel': []
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const testCaseFile = ref<File | undefined>(undefined);
const isLoading = ref(false);
const errors = ref<string[]>([]);
const previewData = ref<any[]>([]);

// Cấu hình cột input động
const inputColumnCount = ref(1);
const inputColumns = ref<Array<{name: string, description: string}>>([]);

// Khởi tạo cột mặc định
onMounted(() => {
  generateColumns();
});

// Tạo danh sách cột dựa vào số lượng
const generateColumns = () => {
  const count = Math.max(1, Math.min(10, inputColumnCount.value));
  inputColumnCount.value = count;
  
  // Giữ lại các cột hiện có nếu có
  const existingColumns = [...inputColumns.value];
  const newColumns = [];
  
  for (let i = 0; i < count; i++) {
    if (i < existingColumns.length) {
      newColumns.push(existingColumns[i]);
    } else {
      newColumns.push({
        name: `Input${i + 1}`,
        description: `Param ${i + 1}`
      });
    }
  }
  
  inputColumns.value = newColumns;
};

const getSampleInput = (index: number) => {
  const samples = [
    "[1, 2, 3]",
    "\"example string\"",
    "42",
    "{\"key\": \"value\"}",
    "true",
    "[[1, 2], [3, 4]]"
  ];
  
  return index < samples.length ? samples[index] : `sample${index + 1}`;
};

const downloadTestCaseTemplate = () => {
  const wb = XLSX.utils.book_new();
  
  const headers = ["Description"];
  
  inputColumns.value.forEach(col => {
    headers.push(col.name);
  });
  
  headers.push("ExpectedOutput", "IsHidden");
  
  const sampleData = [
    ["Basic test"],
    ["Edge case"],
    ["Negative numbers"]
  ];
  
  sampleData.forEach((row, rowIndex) => {
    inputColumns.value.forEach((_, colIndex) => {
      if (rowIndex === 0) { // Basic test
        row.push(getSampleInput(colIndex));
      } else if (rowIndex === 1) { // Edge case
        row.push(colIndex === 0 ? "[]" : "null");
      } else if (rowIndex === 2) { // Negative numbers
        row.push(colIndex === 0 ? "[-1, -2, -3]" : getSampleInput(colIndex));
      }
    });
    
    if (rowIndex === 0) {
      row.push("6", "FALSE");
    } else if (rowIndex === 1) {
      row.push("0", "TRUE");
    } else if (rowIndex === 2) {
      row.push("-6", "FALSE");
    }
  });
  
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
  XLSX.utils.book_append_sheet(wb, ws, "TestCases");
  XLSX.writeFile(wb, "test_cases_template.xlsx");
};

const triggerTestCaseFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleTestCaseFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    testCaseFile.value = input.files[0];
    processTestCaseFile();
  }
};

const handleTestCaseFileDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    testCaseFile.value = event.dataTransfer.files[0];
    processTestCaseFile();
  }
};

const processTestCaseFile = () => {
  isLoading.value = true;
  errors.value = [];
  previewData.value = [];

  if (!testCaseFile.value) {
    errors.value = ['No file selected'];
    isLoading.value = false;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      // Validate format
      if (jsonData.length < 2) {
        errors.value = ['File must contain header row and at least one test case'];
        isLoading.value = false;
        return;
      }

      const headers = jsonData[0].map((h: string) => h.toLowerCase());
      const requiredHeaders = ['expectedoutput'];
      
      // Check input column
      let hasInputColumn = false;
      for (let i = 0; i < inputColumns.value.length; i++) {
        const inputName = inputColumns.value[i].name.toLowerCase();
        if (headers.includes(inputName)) {
          hasInputColumn = true;
          break;
        }
      }
      
      if (!hasInputColumn) {
        errors.value = ['File must contain at least one input column'];
        isLoading.value = false;
        return;
      }
      
      // Check ExpectedOutput column
      for (const header of requiredHeaders) {
        if (!headers.includes(header)) {
          errors.value = [`File must contain '${header}' header`];
          isLoading.value = false;
          return;
        }
      }

      // Parse test cases
      const descIndex = headers.indexOf('description');
      const outputIndex = headers.indexOf('expectedoutput');
      const hiddenIndex = headers.indexOf('ishidden');
      
      // Tìm các cột input
      const inputIndices: number[] = [];
      inputColumns.value.forEach(col => {
        const index = headers.indexOf(col.name.toLowerCase());
        if (index !== -1) {
          inputIndices.push(index);
        }
      });
      
      const testCases = [];
      const importErrors = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        let hasValidInput = false;
        for (const inputIdx of inputIndices) {
          if (row[inputIdx] !== undefined) {
            hasValidInput = true;
            break;
          }
        }
        
        if (!hasValidInput || !row[outputIndex]) {
          importErrors.push(`Row ${i}: Missing input or expected output`);
          continue;
        }

        // Tạo mảng inputs
        const inputs = inputIndices.map(idx => row[idx]);
        
        const testCase = {
          description: descIndex >= 0 ? row[descIndex] || `Test case ${i}` : `Test case ${i}`,
          inputs: inputs,
          output: row[outputIndex],
          is_hidden: hiddenIndex >= 0 ? 
            (typeof row[hiddenIndex] === 'string' ? 
              row[hiddenIndex].toUpperCase() === 'TRUE' : 
              Boolean(row[hiddenIndex])) : 
            false
        };

        testCases.push(testCase);
      }

      errors.value = importErrors;
      previewData.value = testCases;
    } catch (error) {
      errors.value = ['Failed to parse file: ' + (error as Error).message];
    } finally {
      isLoading.value = false;
    }
  };

  reader.onerror = () => {
    errors.value = ['Error reading file'];
    isLoading.value = false;
  };

  reader.readAsArrayBuffer(testCaseFile.value);
};

const confirmImport = () => {
  if (previewData.value.length) {
    emit('test-cases-imported', previewData.value);
  }
};

const cancel = () => {
  emit('cancel');
};

// Helper function to truncate long text
const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  border-radius: 12px;
  background-color: rgba(var(--v-theme-primary), 0.03);
  transition: all 0.3s ease;
}

.drop-zone.dragging {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: scale(1.01);
}

.drop-zone.has-file {
  border-color: rgb(var(--v-theme-success));
  background-color: rgba(var(--v-theme-success), 0.05);
}
</style>