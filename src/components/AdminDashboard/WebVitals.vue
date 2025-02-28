<template>
  <v-row>
    <v-col v-for="(metric, index) in metrics" :key="metric.name" cols="12" md="4">
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-card
          v-bind="hoverProps"
          :elevation="isHovering ? 4 : 1"
          class="transition-all duration-300"
          :class="{ 'transform hover:-translate-y-1': isHovering }"
        >
          <v-card-text class="pa-6">
            <div class="d-flex flex-column align-center text-center">
              <div
                :class="getMetricColor(metric.value, metric.name as MetricType)"
                class="text-h5 font-weight-bold mb-2"
              >
                {{ metric.name }}
              </div>
              <div class="text-gray-600 text-body-2 mb-4">
                {{ metric.fullName }}
              </div>
              <v-progress-circular
                v-if="!metric.value"
                indeterminate
                :color="metric.color"
                size="24"
              ></v-progress-circular>
              <div v-else class="d-flex flex-column align-center">
                <div class="text-h4 font-weight-bold mb-2">
                  {{ formatValue(metric.value) }}
                </div>
                <v-chip
                  :color="getChipColor(metric.value, metric.name as MetricType)"
                  size="small"
                  variant="tonal"
                  class="px-4"
                >
                  {{ getStatusText(metric.value, metric.name as MetricType) }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onFCP, onLCP, onINP } from "web-vitals";
const fcp = ref<number | null>(null);
const lcp = ref<number | null>(null);
const inp = ref<number | null>(null);

// Initialize web vitals measurements
onMounted(() => {
  onFCP((metric) => (fcp.value = metric.value));
  onLCP((metric) => (lcp.value = metric.value));
  onINP((metric) => (inp.value = metric.value));
});

const formatValue = (value: number | null): string => {
  if (value === null) return "-";
  return `${(value / 1000).toFixed(2)}s`;
};

type MetricType = "FCP" | "LCP" | "INP";

const getThresholds = (metricType: MetricType) => {
  const thresholds = {
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    INP: { good: 200, needsImprovement: 500 },
  };
  return thresholds[metricType];
};

const getMetricColor = (value: number | null, metricType: MetricType): string => {
  if (value === null) return "text-gray-500";
  const { good, needsImprovement } = getThresholds(metricType);
  if (value <= good) return "text-green-600";
  if (value <= needsImprovement) return "text-yellow-600";
  return "text-red-600";
};

const getChipColor = (value: number | null, metricType: MetricType): string => {
  if (value === null) return "gray";
  const { good, needsImprovement } = getThresholds(metricType);
  if (value <= good) return "success";
  if (value <= needsImprovement) return "warning";
  return "error";
};

const getStatusText = (value: number | null, metricType: MetricType): string => {
  if (value === null) return "Measuring...";
  const { good, needsImprovement } = getThresholds(metricType);
  if (value <= good) return "Good";
  if (value <= needsImprovement) return "Needs Improvement";
  return "Poor";
};
const metrics = computed(() => [
  {
    name: "FCP",
    fullName: "First Contentful Paint",
    value: fcp.value,
    color: "primary",
  },
  {
    name: "LCP",
    fullName: "Largest Contentful Paint",
    value: lcp.value,
    color: "secondary",
  },
  {
    name: "INP",
    fullName: "Interaction to Next Paint",
    value: inp.value,
    color: "success",
  },
]);
</script>
