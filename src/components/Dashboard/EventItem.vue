<template>
  <v-list-item class="w-full px-4 py-3">
    <div class="flex w-full items-start">
      <v-icon icon="mdi-calendar-clock" size="32" class="flex-shrink-0 mr-4 mt-0.5" color="primary" />
      <div class="flex flex-col flex-grow min-w-0">
        <div class="text-body-1 font-medium">{{ title }}</div>
        <div class="text-caption text-gray-500">Due: {{ deadline }}</div>
      </div>
    </div>
  </v-list-item>
</template>

<script setup lang="ts">
import { DateTimeString } from "@/utils/commonType"
defineProps<{ title: string; deadline: DateTimeString}>();
</script>
