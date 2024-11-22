<template>
  <v-snackbar v-model="isVisible" :timeout="5000" color="error" top>
    <v-alert type="error" dismissible>
      {{ errorMessage }}
    </v-alert>
  </v-snackbar>
</template>

<script lang="ts" setup>

const isVisible = ref(false);
const errorMessage = ref('');

// Function to show the error alert
const showError = (message: string) => {
  errorMessage.value = message;
  isVisible.value = true;
};

// Function to hide the alert (can be triggered manually)
const hideAlert = () => {
  isVisible.value = false;
};
</script>

<style scoped>
/* Optional: Customize the alert styles */
</style>
