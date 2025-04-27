<template>
  <v-snackbar
    v-model="isVisible"
    location="top right"
    :timeout="3000"
    content-class="p-0 bg-transparent shadow-none"
  >
    <div class="flex items-center bg-green-50 p-4 rounded-lg w-full">
      <v-icon
        icon="mdi-check-circle"
        color="success"
        class="mr-3 text-green-500"
      />
      <div class="flex-grow text-green-800 mr-4">
        {{ successMessage }}
      </div>
      <v-btn
        icon
        density="compact"
        variant="text"
        color="success"
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
    const successMessage = ref('');

    const showSuccess = (message: string) => {
      successMessage.value = message;
      isVisible.value = true;
    };

    const hideSnackbar = () => {
      isVisible.value = false;
    };

    return {
      isVisible,
      successMessage,
      showSuccess,
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