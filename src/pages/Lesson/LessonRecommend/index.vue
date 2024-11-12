<template>
  <v-container fluid class="px-12">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="8">
        <v-sheet class="text-h4 font-weight-bold">Chapter 1: Introduction to Data Science</v-sheet>
      </v-col>
      <v-col cols="4" class="text-h5 font-weight-semibold text-right">
        65% <v-icon color="green">mdi-check-circle</v-icon> Completed
      </v-col>
    </v-row>

    <!-- Details Section -->
    <v-col cols="3" class="text-gray-500 mb-4">
      <v-row><v-icon class="mr-2">mdi-clock-outline</v-icon> Recommend Time: "1.5 hours"</v-row>
      <v-row><v-icon class="mr-2">mdi-book-open-outline</v-icon> 4 Modules</v-row>
    </v-col>

    <!-- Recommend Content & Learning Outcomes -->
    <v-row class="mb-4">
      <v-col cols="8">
        <v-card flat class="pa-0">
          <v-card-title class="font-weight-semibold text-h6 pa-0">
            Recommend
          </v-card-title>
          <v-card-text class="pa-0">
            This lesson focuses on semantic analysis, a crucial step in compilation that ensures the meaning and consistency of your source code.
            You'll learn <span class="text-red-500">how to check for type compatibility, verify variable declarations, and ensure proper scope rules are followed</span>.
            We'll also cover the creation and management of symbol tables, which store information about variables and functions, and discuss error handling techniques.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Explain Section -->
    <v-row class="mb-4">
      <v-col cols="8">
        <v-card flat class="pa-0">
          <v-card-title class="font-weight-semibold text-h6 pa-0">
            Explain
          </v-card-title>
          <v-card-text class="pa-0">
            Based on your profile, you have a strong foundation in lexical and syntax analysis. Now, it's time to understand semantic analysis,
            which adds meaning to the parsed program. By learning this, you'll be able to ensure your compiler understands the logic of your code
            and can catch potential errors before they reach the code generation phase.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modules Section -->
    <v-row>
      <v-col cols="12">
        <v-sheet class="text-h6 font-weight-semibold mb-4">Modules:</v-sheet>
      </v-col>
      <v-col cols="4" v-for="module in modules" :key="module">
        <v-card
          class="p-4 text-center bg-green-100 hover:bg-green-200 cursor-pointer"
          @click="showDialog = true"
        >
          <v-card-text class="font-weight-semibold">{{ module }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog Component -->
    <DialogLearningType
      :dialog="showDialog"
      @update:dialog="showDialog = $event"
      @confirm="handleConfirm"
    />
  </v-container>
</template>

<script lang="ts" setup>
// import { ref } from 'vue';

const modules: string[] = [
  "Check for type compatibility",
  "Verify variable declarations",
  "Ensure followed scope rules",
  "Create and manage symbol tables"
];
const showDialog = ref(false);
// State to control dialog visibility and selected module
const dialogVisible = ref(false);
const selectedModule = ref<string | null>(null);

// Function to open dialog and set the selected module
function openDialog(module: string) {
  selectedModule.value = module;
  dialogVisible.value = true;
  console.log('Opening dialog for module:', dialogVisible.value);
}

// Function to close dialog
function closeDialog() {
  dialogVisible.value = false;
  selectedModule.value = null;
  console.log('Closing dialog');
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
