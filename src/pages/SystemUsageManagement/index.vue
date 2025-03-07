<template>
  <v-container fluid class="pa-6 bg-background text-text-primary min-h-screen">
    <!-- Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="flex justify-between items-center">
          <h1 class="text-4xl font-bold gradient-text animate-fade-in">
            System Usage Statistics
          </h1>
        </div>
      </v-col>
    </v-row>

    <!-- Web Vitals Section -->
    <v-row>
      <v-col cols="12" md="4" v-for="metric in webVitalsMetrics" :key="metric.name">
        <v-card
          class="elevation-2 rounded-xl overflow-hidden transition-all duration-300 hover:elevation-6"
          :style="{ 'background-color': 'var(--surface)' }"
          @mouseover="hoverMetric = metric.name"
          @mouseleave="hoverMetric = null"
        >
          <v-card-text class="p-6 flex flex-col items-center text-center">
            <div
              :class="getMetricColor(metric.value, metric.name as MetricType)"
              class="text-2xl font-semibold mb-2"
            >
              {{ metric.name }}
            </div>
            <div class="text-black text-sm mb-4">
              {{ metric.fullName }}
            </div>
            <div class="mb-4">
              <v-progress-circular
                v-if="metric.value === null"
                indeterminate
                color="primary"
                size="24"
              ></v-progress-circular>
              <div v-else class="text-2xl font-bold text-text-primary">
                {{ formatValue(metric.value) }}
              </div>
            </div>
            <v-chip
              :color="getChipColor(metric.value, metric.name as MetricType)"
              size="small"
              variant="flat"
              class="px-4 mb-4"
            >
              {{ getStatusText(metric.value, metric.name as MetricType) }}
            </v-chip>
            <!-- Luôn hiển thị Explanation và Suggestions -->
            <div class="text-sm text-black">
              <p class="mb-2">
                <strong>Giải thích:</strong>
                {{ getExplanation(metric.name as MetricType) }}
              </p>
              <p>
                <strong>Gợi ý:</strong>
                {{ getSuggestions(metric.name as MetricType, metric.value) }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- User Logins Chart Section -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card
          class="elevation-2 rounded-xl overflow-hidden transition-all duration-300 hover:elevation-6"
          :style="{ 'background-color': 'var(--surface)' }"
        >
          <v-card-title class="text-primary text-2xl font-semibold p-6">
            User Logins by Month
          </v-card-title>
          <v-card-text class="p-6">
            <div class="flex gap-4 mb-6">
              <v-select
                v-model="selectedYear"
                :items="availableYears"
                label="Select Year"
                density="compact"
                variant="outlined"
                color="primary"
                class="w-48 rounded-lg"
                @update:modelValue="fetchUserLogins"
              ></v-select>
              <v-select
                v-model="selectedRole"
                :items="availableRoles"
                label="Select Role"
                density="compact"
                variant="outlined"
                color="primary"
                class="w-48 rounded-lg"
                @update:modelValue="updateChartData"
              ></v-select>
            </div>
            <div class="h-[400px]">
              <LineChart
                :data="chartData"
                :options="chartOptions"
                class="animate-slide-up"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from "chart.js";
import { onFCP, onLCP, onINP } from "web-vitals";
import { usersService } from "@/services/usersServices";
import { UserLoginResponse } from "@/types/User";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

type MetricType = "FCP" | "LCP" | "INP";

const selectedYear = ref(new Date().getFullYear());
const selectedRole = ref<string | null>("All");
const userLogins = ref<UserLoginResponse[]>([]);
const availableYears = ref<number[]>([]);
const availableRoles = ref<string[]>(["All", "student", "admin", "teacher"]);
const fcp = ref<number | null>(null);
const lcp = ref<number | null>(null);
const inp = ref<number | null>(null);
const hoverMetric = ref<string | null>(null);

// Fetch user logins
const fetchUserLogins = async () => {
  try {
    const res = await usersService.getUserLogin();
    if (res.data) {
      userLogins.value = res.data;
    }
    updateAvailableYears();
    updateAvailableRoles();
    updateChartData();
  } catch (error) {
    console.error("Error fetching user logins:", error);
  }
};

const updateAvailableYears = () => {
  const years = new Set<number>();
  userLogins.value.forEach((login) => {
    const year = new Date(login.login_timestamp).getFullYear();
    years.add(year);
  });
  availableYears.value = Array.from(years).sort((a, b) => b - a);
};

const updateAvailableRoles = () => {
  const roles = new Set<string>();
  roles.add("All");
  userLogins.value.forEach((login) => {
    roles.add(login.user_role);
  });
  availableRoles.value = Array.from(roles).sort();
};

const updateChartData = () => {
  const monthlyLogins = Array(12).fill(0);
  const filteredLogins =
    selectedRole.value === "All"
      ? userLogins.value
      : userLogins.value.filter((login) => login.user_role === selectedRole.value);

  filteredLogins.forEach((login) => {
    const date = new Date(login.login_timestamp);
    if (date.getFullYear() === selectedYear.value) {
      const month = date.getMonth();
      monthlyLogins[month]++;
    }
  });

  chartData.value = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: `User Logins (${selectedRole.value || "All"})`,
        data: monthlyLogins,
        borderColor: "rgb(72, 169, 166)",
        backgroundColor: "rgba(72, 169, 166, 0.2)",
        tension: 0.3,
        pointBackgroundColor: "rgb(72, 169, 166)",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };
};

// Web Vitals
onMounted(() => {
  fetchUserLogins();
  onFCP((metric) => (fcp.value = metric.value));
  onLCP((metric) => (lcp.value = metric.value));
  onINP((metric) => (inp.value = metric.value));
});

const formatValue = (value: number | null): string => {
  if (value === null) return "-";
  return `${(value / 1000).toFixed(2)}s`;
};

const getThresholds = (metricType: MetricType) => {
  const thresholds = {
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    INP: { good: 200, needsImprovement: 500 },
  };
  return thresholds[metricType];
};

const getMetricColor = (value: number | null, metricType: MetricType): string => {
  if (value === null) return "text-black";
  const { good, needsImprovement } = getThresholds(metricType);
  if (value <= good) return "text-success";
  if (value <= needsImprovement) return "text-warning";
  return "text-error";
};

const getChipColor = (value: number | null, metricType: MetricType): string => {
  if (value === null) return "grey";
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

const getExplanation = (metricType: MetricType): string => {
  const explanations = {
    FCP:
      "First Contentful Paint đo thời gian cho đến khi nội dung đầu tiên được hiển thị.",
    LCP: "Largest Contentful Paint theo dõi thời điểm nội dung chính trở nên hiển thị.",
    INP:
      "Interaction to Next Paint đánh giá độ phản hồi với các thao tác của người dùng.",
  };
  return explanations[metricType];
};

const getSuggestions = (metricType: MetricType, value: number | null): string => {
  if (value === null) return "Đang chờ dữ liệu...";
  const { good, needsImprovement } = getThresholds(metricType);
  if (value <= good) return "Hiệu suất đã tối ưu!";
  if (value <= needsImprovement)
    return "Xem xét tối ưu hóa tài nguyên và phản hồi của máy chủ.";
  return "Ưu tiên tối ưu hóa tài nguyên và bộ nhớ đệm.";
};

// Chart Data and Options
const chartData = ref<{ labels: string[]; datasets: any }>({
  labels: [],
  datasets: [],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: "rgb(100, 120, 119)" },
      grid: { color: "rgba(100, 120, 119, 0.1)" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "rgb(100, 120, 119)" },
      grid: { color: "rgba(100, 120, 119, 0.1)" },
    },
  },
  plugins: {
    legend: { labels: { color: "rgb(33, 55, 54)" } },
    tooltip: {
      backgroundColor: "rgb(72, 169, 166)",
      titleColor: "#fff",
      bodyColor: "#fff",
    },
  },
  animation: {
    duration: 800,
    easing: "easeOutCubic" as const,
  },
};

// Web Vitals Metrics
const webVitalsMetrics = computed(() => [
  { name: "FCP", fullName: "First Contentful Paint", value: fcp.value, color: "primary" },
  {
    name: "LCP",
    fullName: "Largest Contentful Paint",
    value: lcp.value,
    color: "primary",
  },
  {
    name: "INP",
    fullName: "Interaction to Next Paint",
    value: inp.value,
    color: "primary",
  },
]);
</script>

<style scoped>
/* CSS Variables for Consistency */
:root {
  --background: rgb(240, 242, 241);
  --surface: rgb(245, 247, 246);
  --primary: rgb(72, 169, 166);
  --text-primary: rgb(33, 55, 54);
  --text-secondary: rgb(100, 120, 119);
  --success: rgb(56, 142, 60);
  --warning: rgb(237, 108, 2);
  --error: rgb(211, 47, 47);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.8s ease-in;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-pulse {
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(15px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* Additional Styling */
.v-card {
  border: 1px solid rgba(72, 169, 166, 0.1);
}

.v-select {
  background-color: var(--surface);
}
</style>
