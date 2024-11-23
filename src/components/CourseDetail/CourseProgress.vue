<template>
  <v-col cols="12" md="6" class="text-center">
    <div class="text-heading-3 font-weight-bold mb-1">
      {{ courseInfo?.percentage_complete }}%
    </div>
    <v-chip
      :color="renderStatusLabel(courseInfo?.status ?? 'N/A')"
      outlined
      small
      class="text-body-small-1"
    >
      <v-icon left size="18" class="mr-2">mdi-check-circle</v-icon>
      {{ courseInfo?.status ?? "N/A" }}
    </v-chip>
  </v-col>
</template>

<script lang="ts" setup>
import { renderStatusLabel } from "@/utils/functions/render";

defineProps<{
  courseInfo: {
    percentage_complete: string;
    status: string;
  } | null;
}>();
</script>
