<template>
  <v-dialog
    v-bind="{
      modelValue: showDialog,
    }"
    v-on="{
      'update:modelValue': (val: any) => emit('update:showDialog', val)
    }"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="d-flex align-center bg-primary text-white py-3">
        <v-icon icon="mdi-file-excel" class="mr-2"></v-icon>
        <span class="text-h6">Import Student IDs from Excel</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-alert
          v-if="importedIDs.length > 0"
          color="success"
          variant="tonal"
          icon="mdi-check-circle"
          class="mb-4"
        >
          {{ importedIDs.length }} student IDs ready to import
        </v-alert>

        <!-- Sheet Name -->
        <v-text-field
          v-model="sheetName"
          label="Sheet Name"
          variant="outlined"
          placeholder="Leave empty to use first sheet"
          prepend-icon="mdi-file-document-outline"
          class="mb-2"
        ></v-text-field>

        <!-- Has Header Checkbox -->
        <v-checkbox
          v-model="hasHeader"
          label="File has header row"
          class="mb-2"
        ></v-checkbox>

        <!-- Column Name Input (only visible if Has Header is checked) -->
        <v-text-field
          v-if="hasHeader"
          v-model="columnName"
          label="Column Name"
          variant="outlined"
          prepend-icon="mdi-table-column"
          placeholder="e.g., MSSV"
          class="mb-2"
        ></v-text-field>

        <!-- File Input for Excel -->
        <div class="border border-dashed rounded pa-4 mb-4">
          <v-file-input
            v-model="fileInput"
            accept=".xlsx, .xls"
            :label="'Select Excel file'"
            :loading="loading"
            prepend-icon="mdi-file-excel"
            variant="outlined"
            density="compact"
            @update:model-value="
              (files) => handleFileUpload(Array.isArray(files) ? files[0] : files)
            "
            :hint="fileInput ? `File: ${fileInput.name}` : 'No file selected'"
            persistent-hint
          ></v-file-input>
        </div>

        <!-- Preview of imported IDs -->
        <v-expansion-panels v-if="importedIDs.length > 0">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-badge :content="importedIDs.length.toString()" color="primary">
                Preview Imported IDs
              </v-badge>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex flex-wrap gap-1">
                <v-chip
                  v-for="(id, idx) in importedIDs.slice(0, 20)"
                  :key="idx"
                  size="small"
                  color="primary"
                  variant="outlined"
                >
                  {{ id }}
                </v-chip>
                <v-chip v-if="importedIDs.length > 20" size="small">
                  +{{ importedIDs.length - 20 }} more
                </v-chip>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn color="secondary" variant="outlined" @click="closeDialog" class="mr-2">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="confirmImport"
          :disabled="importedIDs.length === 0"
          :loading="confirmLoading"
        >
          <v-icon left>mdi-check</v-icon>
          Import {{ importedIDs.length }} IDs
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";
import * as XLSX from "xlsx";

// Define props
const props = defineProps({
  showDialog: Boolean,
  onImportSuccess: Function,
});

// Define emits
const emit = defineEmits(["update:showDialog"]);

// Reactive variables
const sheetName = ref("");
const hasHeader = ref(true);
const columnName = ref("MSSV");
const fileInput = ref<File | null>(null);
const loading = ref(false);
const confirmLoading = ref(false);
const importedIDs = ref<string[]>([]);

// Get error handling function from the parent component
const showError = inject("showError") as (message: string) => void;

// Handle file upload
const handleFileUpload = async (file: File | File[] | null) => {
  if (Array.isArray(file)) {
    file = file[0] || null;
  }
  if (!file) {
    importedIDs.value = [];
    return;
  }

  loading.value = true;
  try {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const bstr = e.target?.result as string;
        const wb = XLSX.read(bstr, { type: "binary" });

        const wsname = sheetName.value || wb.SheetNames[0];
        if (!wb.SheetNames.includes(wsname)) {
          showError(`Sheet "${wsname}" not found`);
          importedIDs.value = [];
          return;
        }

        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {
          header: hasHeader.value ? undefined : 1,
        });

        // Extract data from the column (use the columnName if has header, otherwise use index 0)
        const extractedIDs = hasHeader.value
          ? data.map((row) => (row as any)[columnName.value]).filter(Boolean)
          : data.map((row) => Object.values(row as object)[0]).filter(Boolean);

        if (extractedIDs.length === 0) {
          showError(
            hasHeader.value
              ? `No data found in column "${columnName.value}"`
              : "No data found in the first column"
          );
          return;
        }

        // Convert all IDs to strings and store them
        importedIDs.value = extractedIDs.map((id) => String(id));
      } catch (error) {
        showError("Error parsing Excel file");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    reader.readAsBinaryString(file);
  } catch (error) {
    showError("Error processing Excel file");
    console.error(error);
    loading.value = false;
  }
};

// Confirm and pass data back to parent
const confirmImport = () => {
  if (importedIDs.value.length === 0) {
    showError("No data to import");
    return;
  }

  confirmLoading.value = true;
  try {
    if (props.onImportSuccess) {
      props.onImportSuccess(importedIDs.value);
    }
    closeDialog();
  } finally {
    confirmLoading.value = false;
  }
};

// Close dialog and reset state
const closeDialog = () => {
  // Reset the form
  fileInput.value = null;
  importedIDs.value = [];
  emit("update:showDialog", false);
};
</script>
