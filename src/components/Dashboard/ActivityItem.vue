<template>
  <v-list-item class="w-full px-4 py-3">
    <div class="flex w-full items-start">
      <v-icon
        :color="iconColor"
        :icon="icon"
        size="32"
        class="flex-shrink-0 mr-4 mt-0.5"
      />

      <div class="flex flex-col flex-grow min-w-0">
        <div class="text-body-1">{{ description }}</div>
        <div class="text-caption text-gray-500">{{ timestamp }}</div>
      </div>
    </div>
  </v-list-item>
</template>

<script lang="ts" setup>
defineProps<{
  icon: string;
  iconColor: string;
  description: string;
  timestamp: string;
}>();
</script>

<style scoped>
/* Additional styling if needed */
</style>
