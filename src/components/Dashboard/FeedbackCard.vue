<template>
  <v-card
    class="border border-primary/20 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
    elevation="1"
  >
    <v-card-text class="p-4">
      <div class="flex items-start space-x-4">
        <v-icon color="error" size="28" class="mt-1">mdi-help-circle</v-icon>
        <div class="flex-grow">
          <p class="text-body-large-1 font-medium text-gray-800">
            Need help?
          </p>
          <p class="text-gray-600">Please send us your feedback</p>
        </div>
      </div>
      <v-btn
        block
        class="mt-4 bg-primary text-text-secondary font-medium"
        elevation="1"
        @click="$emit('open-feedback')"
      >
        Send Feedback
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'open-feedback'): void;
}>();
</script>
