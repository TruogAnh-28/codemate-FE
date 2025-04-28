<template>
  <v-snackbar
    v-model="isVisible"
    location="top right"
    :timeout="3000"
    content-class="p-0 bg-transparent shadow-none"
  >
    <div class="flex items-center bg-red-50 p-4 rounded-lg w-full">
      <v-icon
        icon="mdi-alert-circle"
        color="error"
        class="mr-3 text-red-500"
      />
      <div class="flex-grow text-red-800 mr-4">
        {{ errorMessage }}
      </div>
      <v-btn
        icon
        density="compact"
        variant="text"
        color="error"
        @click="hideSnackbar"
        class="ml-2"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </v-snackbar>
</template>

<script lang="ts">
export default {
  setup() {
    const isVisible = ref(false);
    const errorMessage = ref('');
    
    const showError = (message: string) => {
      errorMessage.value = message;
      isVisible.value = true;
    };
    
    const hideSnackbar = () => {
      isVisible.value = false;
    };
    
    return {
      isVisible,
      errorMessage,
      showError,
      hideSnackbar,
    };
  },
};
</script>

<style scoped>
.v-snackbar :deep(.v-snackbar__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
}
</style>