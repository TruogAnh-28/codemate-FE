<template>
  <v-card
    class="h-100 w-100 pa-6 rounded-xl shadow-md hover:shadow-lg d-flex flex-column"
  >
    <v-row align="center" class="fill-height">
      <v-col cols="8" class="d-flex flex-column justify-center">
        <p class="text-gray-500 text-body-base-small">{{ title }}</p>
        <p class="text-heading-2">{{ content }}</p>

        <!-- <div class="d-flex align-center mt-2">
          <v-icon color="green" class="mr-1">mdi-trending-up</v-icon>
          <p class="text-green-500 text-body-base-small font-semibold">{{ growth }}%</p>
          <p class="text-gray-500 text-body-base-small">&nbsp;Up from yesterday</p>
        </div> -->
      </v-col>

      <v-col cols="4" class="d-flex justify-end align-center">
        <v-avatar size="100" class="bg-blue-100 d-flex justify-center align-center">
          <component :is="iconComponent" class="w-40 h-40" />
        </v-avatar>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  content: [String, Number],
  iconComponent: Object,
  growth: String,
});
</script>

<style scoped>
.v-card {
  min-height: 200px;
  max-width: 600px;
}
</style>
