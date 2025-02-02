<template>
  <v-container class="py-8">
    <v-row>
      <!-- FCP Card -->
      <v-tooltip location="top" content-class="text-body-2">
        <template #activator="{ props }">
          <v-col v-bind="props" cols="12" md="4">
            <v-card class="h-full transition-shadow hover:shadow-lg">
              <v-card-item>
                <div class="flex flex-col items-center text-center space-y-4">
                  <div :class="getMetricColor(fcp, 'FCP')" class="text-2xl font-bold">
                    FCP
                  </div>
                  <div class="text-gray-600 text-sm">
                    First Contentful Paint
                  </div>
                  <v-progress-circular v-if="!fcp" indeterminate color="primary" size="24"></v-progress-circular>
                  <div v-else class="flex flex-col items-center">
                    <div class="text-3xl font-bold">
                      {{ formatValue(fcp) }}
                    </div>
                    <v-chip :color="getChipColor(fcp, 'FCP')" class="mt-2" size="small" variant="tonal">
                      {{ getStatusText(fcp, 'FCP') }}
                    </v-chip>
                  </div>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </template>
        <template #default>
          <div class="pa-2">
            <strong>{{ WEB_VITALS_TOOLTIPS.FCP.title }}</strong><br>
            {{ WEB_VITALS_TOOLTIPS.FCP.description }}<br><br>
            <div v-for="(threshold, index) in WEB_VITALS_TOOLTIPS.FCP.thresholds" :key="index" class="mb-1">
              {{ threshold }}
            </div>
          </div>
        </template>
      </v-tooltip>
      <!-- LCP Card -->
      <v-tooltip location="top" content-class="text-body-2">
        <template #activator="{ props }">
          <v-col v-bind="props" cols="12" md="4">
            <v-card class="h-full transition-shadow hover:shadow-lg">
              <v-card-item>
                <div class="flex flex-col items-center text-center space-y-4">
                  <div :class="getMetricColor(lcp, 'LCP')" class="text-2xl font-bold">
                    LCP
                  </div>
                  <div class="text-gray-600 text-sm">
                    Largest Contentful Paint
                  </div>
                  <v-progress-circular v-if="!lcp" indeterminate color="primary" size="24"></v-progress-circular>
                  <div v-else class="flex flex-col items-center">
                    <div class="text-3xl font-bold">
                      {{ formatValue(lcp) }}
                    </div>
                    <v-chip :color="getChipColor(lcp, 'LCP')" class="mt-2" size="small" variant="tonal">
                      {{ getStatusText(lcp, 'LCP') }}
                    </v-chip>
                  </div>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </template>
        <template #default>
          <div class="pa-2">
            <strong>{{ WEB_VITALS_TOOLTIPS.LCP.title }}</strong><br>
            {{ WEB_VITALS_TOOLTIPS.LCP.description }}<br><br>
            <div v-for="(threshold, index) in WEB_VITALS_TOOLTIPS.LCP.thresholds" :key="index" class="mb-1">
              {{ threshold }}
            </div>
          </div>
        </template>
      </v-tooltip>
      <!-- INP Card -->
      <v-tooltip location="top" content-class="text-body-2">
        <template #activator="{ props }">
          <v-col v-bind="props" cols="12" md="4">
            <v-card class="h-full transition-shadow hover:shadow-lg">
              <v-card-item>
                <div class="flex flex-col items-center text-center space-y-4">
                  <div :class="getMetricColor(inp, 'INP')" class="text-2xl font-bold">
                    INP
                  </div>
                  <div class="text-gray-600 text-sm">
                    Interaction to Next Paint
                  </div>
                  <v-progress-circular v-if="!inp" indeterminate color="primary" size="24"></v-progress-circular>
                  <div v-else class="flex flex-col items-center">
                    <div class="text-3xl font-bold">
                      {{ formatValue(inp) }}
                    </div>
                    <v-chip :color="getChipColor(inp, 'INP')" class="mt-2" size="small" variant="tonal">
                      {{ getStatusText(inp, 'INP') }}
                    </v-chip>
                  </div>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </template>
        <template #default>
          <div class="pa-2">
            <strong>{{ WEB_VITALS_TOOLTIPS.INP.title }}</strong><br>
            {{ WEB_VITALS_TOOLTIPS.INP.description }}<br><br>
            <div v-for="(threshold, index) in WEB_VITALS_TOOLTIPS.INP.thresholds" :key="index" class="mb-1">
              {{ threshold }}
            </div>
          </div>
        </template>
      </v-tooltip>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onFCP, onLCP, onINP } from 'web-vitals'
import { WEB_VITALS_TOOLTIPS } from '../../utils/constant'
const fcp = ref<number | null>(null)
const lcp = ref<number | null>(null)
const inp = ref<number | null>(null)

// Initialize web vitals measurements
onMounted(() => {
  onFCP((metric) => (fcp.value = metric.value))
  onLCP((metric) => (lcp.value = metric.value))
  onINP((metric) => (inp.value = metric.value))
})

const formatValue = (value: number | null): string => {
  if (value === null) return '-'
  return `${(value / 1000).toFixed(2)}s`
}

type MetricType = 'FCP' | 'LCP' | 'INP'

const getThresholds = (metricType: MetricType) => {
  const thresholds = {
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    INP: { good: 200, needsImprovement: 500 }
  }
  return thresholds[metricType]
}

const getMetricColor = (value: number | null, metricType: MetricType): string => {
  if (value === null) return 'text-gray-500'
  const { good, needsImprovement } = getThresholds(metricType)
  if (value <= good) return 'text-green-600'
  if (value <= needsImprovement) return 'text-yellow-600'
  return 'text-red-600'
}

const getChipColor = (value: number | null, metricType: MetricType): string => {
  if (value === null) return 'gray'
  const { good, needsImprovement } = getThresholds(metricType)
  if (value <= good) return 'success'
  if (value <= needsImprovement) return 'warning'
  return 'error'
}

const getStatusText = (value: number | null, metricType: MetricType): string => {
  if (value === null) return 'Measuring...'
  const { good, needsImprovement } = getThresholds(metricType)
  if (value <= good) return 'Good'
  if (value <= needsImprovement) return 'Needs Improvement'
  return 'Poor'
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
}
</style>