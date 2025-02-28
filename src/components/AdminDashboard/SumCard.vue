<template>
  <v-card
    :class="[
      'h-100 w-100 rounded-xl transition-all duration-300',
      `hover:shadow-lg hover:border-${color}`,
    ]"
    elevation="1"
  >
    <v-card-text class="pa-6">
      <v-row align="center" class="fill-height">
        <v-col cols="8" class="d-flex flex-column justify-center">
          <p class="text-gray-500 mb-2 text-body-2">{{ title }}</p>
          <p class="text-h4 font-weight-bold mb-2">{{ content }}</p>

          <div class="d-flex align-center">
            <v-icon :color="growthColor" size="small" class="mr-1">
              {{ growthIcon }}
            </v-icon>
            <span :class="`text-${growthColor} font-weight-medium`">{{ growth }}%</span>
            <span class="text-gray-500 text-body-2 ml-2">vs last month</span>
          </div>
        </v-col>

        <v-col cols="4" class="d-flex justify-end align-center">
          <v-avatar
            :class="[
              'rounded-xl transition-all duration-300',
              iconBg || `bg-${color}-lighten-4`,
            ]"
            size="70"
          >
            <component :is="iconComponent" :class="`w-8 h-8 text-${color}`" />
          </v-avatar>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  title: String,
  content: [String, Number],
  iconComponent: Object || String,
  growth: String,
  color: {
    type: String,
    default: "primary",
  },
  iconBg: String,
});

const growthValue = computed(() => parseFloat(props.growth || "0"));
const growthColor = computed(() => (growthValue.value >= 0 ? "success" : "error"));
const growthIcon = computed(() =>
  growthValue.value >= 0 ? "mdi-trending-up" : "mdi-trending-down"
);
</script>
