<template>
  <v-container>
    <v-card>
      <v-card-title>Feedback Status Trends by Month (2023)</v-card-title>
      <v-card-text>
        <Line :data="chartData" :options="chartOptions" class="h-64" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
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

const chartData = ref<ChartData<"line">>({
  labels: [],
  datasets: [
    {
      label: "Resolved",
      data: [],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.1)",
      fill: true,
    },
    {
      label: "Pending",
      data: [],
      borderColor: "rgb(255, 159, 64)",
      backgroundColor: "rgba(255, 159, 64, 0.1)",
      fill: true,
    },
    {
      label: "In Progress",
      data: [],
      borderColor: "rgb(54, 162, 235)",
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

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const fetchFeedbackData = async () => {
  try {
    const response = await feedbackServices.getListFeedbacks(undefined, {
      showError,
      showSuccess,
    });
    if ("data" in response && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    return [];
  }
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

onMounted(async () => {
  const rawData = await fetchFeedbackData();
  const monthlyStats = processMonthlyData(rawData);

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
      },
      {
        label: "Pending",
        data: monthlyStats.pending,
        borderColor: "red",
        backgroundColor: "rgba(255, 159, 64, 0.1)",
        fill: true,
      },
      {
        label: "In Progress",
        data: monthlyStats.inProgress,
        borderColor: "blue",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        fill: true,
      },
    ],
  };
});
</script>
