<template>
  <v-layout>
    <v-container
      fluid
      class="px-6 py-8"
      :style="{ background: 'hsl(var(--background))' }"
    >
      <!-- Title Section -->
      <div class="mb-2">
        <h1
          class="text-3xl font-bold mb-2 animate-fade-in gradient-text"
          :style="{ color: 'hsl(var(--text-primary))' }"
        >
          Admin Dashboard
        </h1>
        <p :style="{ color: 'hsl(var(--text-secondary))' }">
          Comprehensive overview of system performance and user activity
        </p>
      </div>

      <!-- Stats Cards -->
      <v-row justify="center" align="stretch" class="mb-10">
        <v-col cols="12" sm="6" md="3" class="d-flex">
          <SumCard
            title="Total Users"
            :content="totalUsers_"
            :iconComponent="totalUsers"
            growth="8.5"
            :color="`hsl(var(--primary))`"
            icon-bg="bg-gradient-primary"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="d-flex">
          <SumCard
            title="Total Courses"
            :content="totalCourses_"
            :iconComponent="totalCourses"
            growth="8.5"
            :color="`hsl(var(--secondary))`"
            icon-bg="bg-gradient-secondary"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="d-flex">
          <SumCard
            title="Total Feedbacks"
            :content="feedbacks.length"
            :iconComponent="totalFeedbacksIcon"
            growth="4.2"
            :color="`hsl(var(--success))`"
            icon-bg="bg-gradient-success"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="d-flex">
          <SumCard
            title="Avg. Rating"
            :content="averageRating"
            :iconComponent="ratingIcon"
            growth="2.1"
            :color="`hsl(var(--warning))`"
            icon-bg="bg-gradient-warning"
          />
        </v-col>
      </v-row>

     <!-- Web Vitals Section -->
     <v-row class="mb-10">
        <v-col v-for="metric in webVitalsMetrics" :key="metric.name" cols="12" md="4">
          <v-card
            class="elevation-2 rounded-xl transition-all duration-300 hover:elevation-6"
            :style="{ 'background-color': 'var(--surface)' }"
          >
            <v-card-text class="pa-6 text-center">
              <div
                :class="getMetricColor(metric.value, metric.name as MetricType)"
                class="text-xl font-semibold mb-2"
              >
                {{ metric.name }}
              </div>
              <div class="text-text-black text-sm mb-4">
                {{ metric.fullName }}
              </div>
              <v-progress-circular
                v-if="metric.value === null"
                indeterminate
                color="primary"
                size="24"
              ></v-progress-circular>
              <div v-else class="text-xl font-bold text-text-primary mb-2">
                {{ formatValue(metric.value) }}
              </div>
              <v-chip
                :color="getChipColor(metric.value, metric.name as MetricType)"
                size="small"
                variant="flat"
                class="mb-4"
              >
                {{ getStatusText(metric.value, metric.name as MetricType) }}
              </v-chip>
              <div class="text-sm text-black">
                <p><strong>Explanation:</strong> {{ getExplanation(metric.name as MetricType) }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section -->
      <v-row>
        <!-- Feedback Charts Column -->
        <v-col cols="12" lg="6">
          <v-card
            class="elevation-2 rounded-xl mb-6 transition-all duration-300 hover:elevation-6"
            :style="{ 'background-color': 'var(--surface)' }"
          >
            <v-card-title class="text-secondary-variant">Feedback by Type</v-card-title>
            <v-card-text>
              <div class="chart-container" style="height: 250px">
                <Bar :data="barChartData" :options="barChartOptions" />
              </div>
            </v-card-text>
          </v-card>

          <v-card
            class="elevation-2 rounded-xl transition-all duration-300 hover:elevation-6"
            :style="{ 'background-color': 'var(--surface)' }"
          >
            <v-card-title class="text-secondary-variant">Rating Distribution</v-card-title>
            <v-card-text>
              <div class="chart-container" style="height: 250px">
                <Pie :data="pieChartData" :options="pieChartOptions" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- User Logins Chart Column -->
        <v-col cols="12" lg="6">
          <v-card
            class="elevation-2 rounded-xl transition-all duration-300 hover:elevation-6"
            :style="{ 'background-color': 'var(--surface)' }"
          >
            <v-card-title class="text-primary text-xl font-semibold">
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
                  @update:modelValue="updateChartData"
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
              <div class="chart-container" style="height: 400px">
                <LineChart :data="chartData" :options="chartOptions" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { usersService } from "@/services/usersServices";
import { coursesService } from "@/services/courseslistServices";
import { feedbackServices } from "@/services/feedbackServices";
import totalCourses from "@/assets/adminDashboard/totalCourses.vue";
import totalUsers from "@/assets/adminDashboard/totalUsers.vue";
import totalFeedbacksIcon from "@/assets/adminDashboard/totalCourses.vue"; // Placeholder, create this
import ratingIcon from "@/assets/adminDashboard/totalUsers.vue"; // Placeholder, create this
import { onFCP, onLCP, onINP } from "web-vitals";
import { Bar, Pie } from "vue-chartjs";
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { GetListFeedbackResponse } from "@/types/Feedback";
import { UserLoginResponse } from "@/types/User";
import { mockFeedbacks, mockUserLogins } from "@/utils/constant";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

type MetricType = "FCP" | "LCP" | "INP";

// Reactive Variables
const totalUsers_ = ref<number>(0);
const totalCourses_ = ref<number>(0);
const feedbacks = ref<GetListFeedbackResponse[]>(mockFeedbacks);
const fcp = ref<number | null>(null);
const lcp = ref<number | null>(null);
const inp = ref<number | null>(null);
const selectedYear = ref(new Date().getFullYear());
const selectedRole = ref<string | null>("All");
const userLogins = ref<UserLoginResponse[]>(mockUserLogins);
const availableYears = ref<number[]>([]);
const availableRoles = ref<string[]>(["All", "student", "admin", "teacher"]);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Fetch Data
const fetch_totalUsers = async () => {
  const response = await usersService.countUsers({ showError, showSuccess });
  if ("data" in response && response.data) totalUsers_.value = response.data;
};

const fetch_totalCourses = async () => {
  const response = await coursesService.countCourses({ showError, showSuccess });
  if ("data" in response && response.data) totalCourses_.value = response.data;
};

const fetchFeedbackData = async () => {
  const response = await feedbackServices.getListFeedbacks({}, { showError, showSuccess });
  feedbacks.value = response.data || [];
};

const fetchUserLogins = async () => {
  const res = await usersService.getUserLogin();
  if (res.data) {
    userLogins.value = res.data;
    updateAvailableYears();
    updateChartData();
  }
};

const getExplanation = (metricType: MetricType): string => {
  const explanations = {
    FCP: "First Contentful Paint measures the time until the first content is rendered.",
    LCP: "Largest Contentful Paint tracks when the main content becomes visible.",
    INP: "Interaction to Next Paint assesses responsiveness to user interactions.",
  };
  return explanations[metricType];
};

const updateAvailableYears = () => {
  const years = new Set<number>();
  userLogins.value.forEach((login) => years.add(new Date(login.login_timestamp).getFullYear()));
  availableYears.value = Array.from(years).sort((a, b) => b - a);
};

// Computed Properties
const averageRating = computed(() =>
  feedbacks.value.length > 0
    ? (feedbacks.value.reduce((sum, f) => sum + f.rate, 0) / feedbacks.value.length).toFixed(1)
    : "N/A"
);

const webVitalsMetrics = computed(() => [
  { name: "FCP", fullName: "First Contentful Paint", value: fcp.value, color: "primary" },
  { name: "LCP", fullName: "Largest Contentful Paint", value: lcp.value, color: "secondary" },
  { name: "INP", fullName: "Interaction to Next Paint", value: inp.value, color: "success" },
]);

const barChartData = computed(() => ({
  labels: ["Course", "System"],
  datasets: [
    {
      label: "Feedback Count",
      data: [
        feedbacks.value.filter((f) => f.type === "course").length,
        feedbacks.value.filter((f) => f.type === "system").length,
      ],
      backgroundColor: ["#4CAF50", "#2196F3"],
      borderWidth: 1,
    },
  ],
}));

const pieChartData = computed(() => {
  const highRatings = feedbacks.value.filter((f) => f.rate >= 4).length;
  const mediumRatings = feedbacks.value.filter((f) => f.rate === 3).length;
  const lowRatings = feedbacks.value.filter((f) => f.rate <= 2).length;
  const total = feedbacks.value.length || 1;
  return {
    labels: ["High (4-5)", "Medium (3)", "Low (1-2)"],
    datasets: [
      {
        data: [
          (highRatings / total) * 100,
          (mediumRatings / total) * 100,
          (lowRatings / total) * 100,
        ],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
        borderWidth: 1,
      },
    ],
  };
});

const chartData = ref<{ labels: string[]; datasets: any }>({
  labels: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  datasets: [],
});

const updateChartData = () => {
  const monthlyLogins = Array(12).fill(0);
  const filteredLogins =
    selectedRole.value === "All"
      ? userLogins.value
      : userLogins.value.filter((login) => login.user_role === selectedRole.value);

  filteredLogins.forEach((login) => {
    const date = new Date(login.login_timestamp);
    if (date.getFullYear() === selectedYear.value) monthlyLogins[date.getMonth()]++;
  });

  chartData.value = {
    labels: chartData.value.labels,
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

// Web Vitals Helpers
const formatValue = (value: number | null): string =>
  value === null ? "-" : `${(value / 1000).toFixed(2)}s`;

const getThresholds = (metricType: MetricType) => ({
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  INP: { good: 200, needsImprovement: 500 },
}[metricType]);

const getMetricColor = (value: number | null, metricType: MetricType): string => {
  if (value === null) return "text-gray-500";
  const { good, needsImprovement } = getThresholds(metricType);
  return value <= good ? "text-green-600" : value <= needsImprovement ? "text-yellow-600" : "text-red-600";
};

const getChipColor = (value: number | null, metricType: MetricType): string => {
  if (value === null) return "grey";
  const { good, needsImprovement } = getThresholds(metricType);
  return value <= good ? "success" : value <= needsImprovement ? "warning" : "error";
};

const getStatusText = (value: number | null, metricType: MetricType): string => {
  if (value === null) return "Measuring...";
  const { good, needsImprovement } = getThresholds(metricType);
  return value <= good ? "Good" : value <= needsImprovement ? "Needs Improvement" : "Poor";
};

// Chart Options
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: { raw: any }) => `Count: ${context.raw}`,
      },
    },
  },
  animation: { duration: 1000 },
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem: { label: string; raw: unknown }) =>
          `${tooltipItem.label}: ${(tooltipItem.raw as number).toFixed(1)}%`,
      },
    },
    datalabels: {
      formatter: (value: number, context: any) => {
        const label = context.chart.data.labels[context.dataIndex];
        return value > 5 ? `${label}\n${value.toFixed(1)}%` : "";
      },
      color: "#fff",
      font: {
        weight: "bold" as const,
        size: window.innerWidth < 600 ? 12 : 14,
      },
      padding: 4,
      textAlign: "center" as const,
      anchor: "center" as const,
      align: "center" as const,
    },
    legend: {
      position: "bottom" as const,
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
  },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: "Number of Logins" },
    },
    x: {
      title: { display: true, text: "Month" },
    },
  },
  plugins: {
    tooltip: {
      intersect: false,
      mode: "index" as const,
    },
    legend: { labels: { color: "rgb(33, 55, 54)" } },
  },
  animation: { duration: 800, easing: "easeOutCubic" as const },
};

// Lifecycle
onMounted(async () => {
  fetch_totalUsers();
  userLogins.value = mockUserLogins; // Explicitly set (optional, already default)
  updateChartData(); // Add this line
  onFCP((metric) => (fcp.value = metric.value));
  onLCP((metric) => (lcp.value = metric.value));
  onINP((metric) => (inp.value = metric.value));
});
</script>

<style scoped>
:root {
  --background: rgb(240, 242, 241);
  --surface: rgb(245, 247, 246);
  --primary: rgb(72, 169, 166);
  --secondary: rgb(100, 120, 119);
  --success: rgb(56, 142, 60);
  --warning: rgb(237, 108, 2);
  --text-primary: rgb(33, 55, 54);
  --text-secondary: rgb(100, 120, 119);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.gradient-text {
  background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 80%));
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary) / 80%));
}

.bg-gradient-success {
  background: linear-gradient(135deg, hsl(var(--success)), hsl(var(--success) / 80%));
}

.bg-gradient-warning {
  background: linear-gradient(135deg, hsl(var(--warning)), hsl(var(--warning) / 80%));
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.chart-container {
  position: relative;
  width: 100%;
}
</style>