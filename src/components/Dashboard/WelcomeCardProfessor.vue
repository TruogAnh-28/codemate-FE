<template>
  <v-card
    class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 overflow-hidden"
    elevation="3"
  >
    <div
      class="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full transform -translate-y-16 translate-x-16"
    />
    <div
      class="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100/30 rounded-full transform translate-y-12 -translate-x-8"
    />

    <v-card-text class="relative z-10 p-6">
      <div class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-heading-1 font-semibold text-gray-800">Welcome back,</h2>
          <p class="text-heading-4 text-blue-600 font-medium">
            {{ professor_name }}
          </p>
        </div>

        <p class="text-gray-600 leading-relaxed">
          Glad to see you again! Keep up the momentum in your course.
        </p>
<!-- 
        <v-btn
          variant="text"
          color="primary"
          class="px-4 py-2 mt-2 font-medium hover:bg-blue-50 transition-colors"
          :to="'/professor-code'"
        >
          Tap to learn
          <v-icon end icon="mdi-arrow-right" class="ml-1" />
        </v-btn> -->
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore;
const { user } = authStore.getState();
const professor_name = user?.name;
</script>
