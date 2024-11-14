<template>
  <v-card class="p-4">
    <v-card-title class="text-heading-4 font-semibold">Learning Outcomes:</v-card-title>
    <v-card-text>
      <ul class="list-disc list-inside">
        <li v-for="(outcome, index) in learningOutcomes" :key="index">
          {{ outcome }}
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  learningOutcomes: string[];
}>();
</script>

<style scoped>
/* Scoped styling can be added here if necessary */
</style>
