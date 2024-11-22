<template>
  <v-app>
    <v-main>
      <ErrorAlert ref="errorAlert" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import ErrorAlert from '@ErrorAlert.vue';
const errorAlert = ref<InstanceType<typeof ErrorAlert> | null>(null);

provide("showError", (message: string) => {
  if (errorAlert.value) {
    errorAlert.value.showError(message);
  }
});
</script>
