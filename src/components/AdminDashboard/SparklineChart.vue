<template>
  <v-container>
    <v-card>
      <v-card-title class="flex flex-row justify-between">
        <p class="text-heading-3">Feedback Status Trend</p>
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Year"
          outlined
          dense
          class="w-32"
        />
      </v-card-title>
      <v-card-text>
        <Line :data="chartData" :options="chartOptions" class="h-64" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { feedbackServices } from "@/services/feedbackServices";
import { GetListFeedbackResponse } from "@/types/Feedback";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyStats {
  labels: string[];
  resolved: number[];
  pending: number[];
  inProgress: number[];
}

interface MonthlyDataAccumulator {
  [key: string]: {
    resolved: number;
    pending: number;
    in_progress: number;
  };
}

const years = ref<number[]>([]);
const selectedYear = ref<number | null>(null);
const listFeedback = ref<GetListFeedbackResponse[]>([]);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const chartData = ref<ChartData<"line">>({
  labels: [],
  datasets: [
    {
      label: "Resolved",
      data: [],
      borderColor: "green",
      backgroundColor: "rgba(75, 192, 192, 0.1)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "Pending",
      data: [],
      borderColor: "red",
      backgroundColor: "rgba(255, 159, 64, 0.1)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "In Progress",
      data: [],
      borderColor: "blue",
      backgroundColor: "rgba(54, 162, 235, 0.1)",
      fill: true,
      tension: 0.3,
    },
  ],
});

const chartOptions = ref<ChartOptions<"line">>({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Number of Feedbacks",
      },
    },
    x: {
      title: {
        display: true,
        text: "Month",
      },
    },
  },
  plugins: {
    tooltip: {
      mode: "index",
      intersect: false,
    },
    legend: {
      position: "top" as const,
    },
  },
});

const processMonthlyData = (rawData: GetListFeedbackResponse[]): MonthlyStats => {
  const monthlyData: MonthlyDataAccumulator = {};

  rawData.forEach((feedback) => {
    const date = new Date(feedback.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        resolved: 0,
        pending: 0,
        in_progress: 0,
      };
    }

    monthlyData[monthKey][
      feedback.status as keyof MonthlyDataAccumulator[keyof MonthlyDataAccumulator]
    ]++;
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce(
      (acc: MonthlyStats, [month, data]) => {
        acc.labels.push(month);
        acc.resolved.push(data.resolved);
        acc.pending.push(data.pending);
        acc.inProgress.push(data.in_progress);
        return acc;
      },
      {
        labels: [],
        resolved: [],
        pending: [],
        inProgress: [],
      }
    );
};

const getListYear = (rawData: GetListFeedbackResponse[]): number[] => {
  const years = rawData.map((feedback) => new Date(feedback.created_at).getFullYear());
  return Array.from(new Set(years)).sort((a, b) => b - a);
};

const months = [
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
];

const fetchFeedbackData = async (year?: number | null) => {
  const response = await feedbackServices.getListFeedbacks(
    { year: year ?? undefined },
    {
      showError,
      showSuccess,
    }
  );

  if ("data" in response && response.data) {
    years.value = getListYear(response.data);
    listFeedback.value = response.data;

    if (!selectedYear.value && years.value.length > 0) {
      selectedYear.value = years.value[0];
    }
    return response.data;
  }
  return [];
};

const updateChartData = (rawData: GetListFeedbackResponse[]) => {
  const monthlyStats = processMonthlyData(
    rawData.filter(
      (feedback) =>
        !selectedYear.value ||
        new Date(feedback.created_at).getFullYear() === selectedYear.value
    )
  );

  chartData.value = {
    labels: monthlyStats.labels.map((month) => {
      const [, monthNum] = month.split("-");
      return months[parseInt(monthNum) - 1];
    }),
    datasets: [
      {
        label: "Resolved",
        data: monthlyStats.resolved,
        borderColor: "green",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Pending",
        data: monthlyStats.pending,
        borderColor: "red",
        backgroundColor: "rgba(255, 159, 64, 0.1)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "In Progress",
        data: monthlyStats.inProgress,
        borderColor: "blue",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };
};

onMounted(async () => {
  const rawData = await fetchFeedbackData();
  if (rawData.length > 0) {
    updateChartData(rawData);
  }
});

watch(
  selectedYear,
  async (newYear) => {
    updateChartData(listFeedback.value);
  },
  { immediate: true }
);
</script>
