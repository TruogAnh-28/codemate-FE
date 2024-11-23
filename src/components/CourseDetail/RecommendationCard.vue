<template>
  <v-card class="rounded-lg">
    <v-card-text class="text-center pa-6">
      <v-avatar size="80" class="mb-4">
        <CheckCircle />
      </v-avatar>

      <h3 class="text-heading-4 font-weight-bold mb-2">
        Join our Recommended Learning
      </h3>

      <p class="text-body-2 text-text-tetiary mb-4">
        Get personalized course recommendations based on your goals and interests.
      </p>

      <v-btn
        color="text-primary"
        block
        elevation="2"
        @click="$emit('open-recommendation')"
        class="text-body-base-4"
      >
        Get Recommendations
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import CheckCircle from "@/assets/icons/check-circle.vue";

defineEmits<{
  (e: 'open-recommendation'): void;
}>();
</script>
