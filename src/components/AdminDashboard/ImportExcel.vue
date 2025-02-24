// ExcelImport.vue
<script setup lang="ts">
import { ref } from "vue";
import * as XLSX from "xlsx";

interface Props {
  sheetName?: string;
  columnName?: string;
  hasHeader?: boolean;
  onImportSuccess: (data: string[]) => void;
}

const props = withDefaults(defineProps<Props>(), {
  sheetName: "", // If empty, will use first sheet
  columnName: "MSSV",
  hasHeader: true,
});

const fileInput = ref<File | null>(null);
const loading = ref(false);

const showError = inject("showError") as (message: string) => void;

const handleFileUpload = async () => {
  if (!fileInput.value) return;

  loading.value = true;
  try {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const bstr = e.target?.result as string;
      const wb = XLSX.read(bstr, { type: "binary" });

      const wsname = props.sheetName || wb.SheetNames[0];
      if (!wb.SheetNames.includes(wsname)) {
        showError(`Sheet "${wsname}" not found`);
        return;
      }

      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, {
        header: props.hasHeader ? undefined : 1,
      });

      const studentIDs = data
        .map((row) => (row as any)[props.columnName])
        .filter((id) => id);

      if (studentIDs.length === 0) {
        showError(`No data found in column "${props.columnName}"`);
        return;
      }

      props.onImportSuccess(studentIDs);
    };

    reader.readAsBinaryString(fileInput.value);
  } catch (error) {
    showError("Error processing Excel file");
    console.error(error);
  } finally {
    loading.value = false;
    fileInput.value = null;
  }
};
</script>

<template>
  <v-file-input
    v-model="fileInput"
    accept=".xlsx"
    label="Import Student IDs"
    :loading="loading"
    prepend-icon="mdi-file-excel"
    variant="outlined"
    density="compact"
    hide-details
    @update:model-value="handleFileUpload"
    class="max-w-xs"
  >
    <template v-slot:append> Import Excel </template>
  </v-file-input>
</template>
