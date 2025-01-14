<template>
  <v-row>
    <v-col cols="8">
      <v-file-input
        accept=".xlsx"
        label="File input (xlsx)"
        outlined
        v-model="selectXlsx"
        show-size
      ></v-file-input>
    </v-col>

    <v-col cols="4">
      <v-btn
        color="primary"
        @click="uploadXlsx"
        class="mt-3"
      >
        Upload
      </v-btn>
    </v-col>
  </v-row>

  <!-- Display the parsed data in a table -->
  <v-row v-if="data.length > 0">
    <v-col cols="12">
      <v-simple-table>
        <thead>
          <tr>
            <th v-for="(header, index) in data[0]" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data.slice(1)" :key="index">
            <td v-for="(cell, i) in row" :key="i">{{ cell }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
// Correct way to import the XLSX library
import * as XLSX from 'xlsx';


// Define the type for the file input
const selectXlsx = ref<File | null>(null);

// Define a reactive variable to hold the data
const data = ref<any[]>([]);

const uploadXlsx = () => {
  if (!selectXlsx.value) {
    console.log("Please upload a xlsx file");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    // Parse the data
    const bstr = e.target?.result as string;
    const wb = XLSX.read(bstr, { type: "binary" });

    // Get the first worksheet
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];

    // Convert the worksheet into an array of arrays
    const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // Set the parsed data into the reactive variable
    data.value = parsedData;
    console.log(parsedData);
  };

  if (selectXlsx.value) {
    reader.readAsBinaryString(selectXlsx.value);
  }
  selectXlsx.value = null;
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
