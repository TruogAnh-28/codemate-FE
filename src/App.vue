<template>
  <v-app>
    <v-main>
      <ErrorAlert ref="errorAlert" />
      <SuccessAlert ref="successAlert" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import ErrorAlert from './components/ErrorAlert.vue';
import SuccessAlert from './components/SuccessAlert.vue';

const errorAlert = ref<InstanceType<typeof ErrorAlert> | null>(null);
const successAlert = ref<InstanceType<typeof SuccessAlert> | null>(null);

provide("showError", (message: string) => {
  if (errorAlert.value) {
    errorAlert.value.showError(message);
  }
});

provide("showSuccess", (message: string) => {
  if (successAlert.value) {
    successAlert.value.showSuccess(message);
  }
});
</script>

<style scoped>
</style>
