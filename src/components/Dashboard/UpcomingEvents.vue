<template>
  <v-card class="flex-1 rounded-lg overflow-hidden" elevation="2">
    <v-card-title class="py-4 px-6 bg-gray-50 border-b">
      <h3 class="text-body-large-1 font-semibold text-gray-800">
        Upcoming Events
      </h3>
    </v-card-title>
    <v-list v-if="items.length > 0" class="max-h-96 overflow-y-auto px-2">
      <EventItem
        v-for="item in items"
        :key="item.exercise_id"
        :data="item"
      />
    </v-list>
    <v-card-text v-else class="p-6 text-center text-gray-500">
      No upcoming events
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { UpcomingEvent } from "@/types/Dashboard";
const props = defineProps<{ events: UpcomingEvent[] }>();
const items = props.events;
</script>