<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
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
import { Bar, Pie, Line } from "vue-chartjs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Services import
import { feedbackServices } from "@/services/feedbackServices";
import { GetListFeedbackResponse } from "@/types/Feedback";

// State
const feedbacks = ref<GetListFeedbackResponse[]>([]);
const isLoading = ref(true);
const selectedTimePeriod = ref("7days");
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Computed chart data
const barChartData = computed(() => {
  const courseCount = feedbacks.value.filter((f) => f.type === "course").length;
  const systemCount = feedbacks.value.filter((f) => f.type === "system").length;

  return {
    labels: ["Course", "System"],
    datasets: [
      {
        label: "Feedback Count",
        data: [courseCount, systemCount],
        backgroundColor: ["#4CAF50", "#2196F3"],
        borderWidth: 1,
      },
    ],
  };
});

const pieChartData = computed(() => {
  const highRatings = feedbacks.value.filter((f) => f.rate >= 4).length;
  const mediumRatings = feedbacks.value.filter((f) => f.rate === 3).length;
  const lowRatings = feedbacks.value.filter((f) => f.rate <= 2).length;
  const total = feedbacks.value.length || 1; // Prevent division by zero

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

const lineChartData = computed(() => {
  // Filter data based on selected time period
  const filteredFeedbacks = filterByTimePeriod(feedbacks.value, selectedTimePeriod.value);

  // Group data by date
  const groupedByDate = groupFeedbacksByDate(filteredFeedbacks, selectedTimePeriod.value);

  // Get sorted dates for x-axis
  const sortedDates = Object.keys(groupedByDate).sort();

  // Prepare datasets for each rating category
  const highRatings = sortedDates.map((date) => {
    return groupedByDate[date].filter((f) => f.rate >= 4).length;
  });

  const mediumRatings = sortedDates.map((date) => {
    return groupedByDate[date].filter((f) => f.rate === 3).length;
  });

  const lowRatings = sortedDates.map((date) => {
    return groupedByDate[date].filter((f) => f.rate <= 2).length;
  });

  return {
    labels: sortedDates,
    datasets: [
      {
        label: "High (4-5)",
        data: highRatings,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderDash: [5, 5],
        tension: 0.3,
      },
      {
        label: "Medium (3)",
        data: mediumRatings,
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.1)",
        borderDash: [5, 5],
        tension: 0.3,
      },
      {
        label: "Low (1-2)",
        data: lowRatings,
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        borderDash: [5, 5],
        tension: 0.3,
      },
    ],
  };
});

// Options for charts
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: { raw: any }) => `Count: ${context.raw}`,
      },
    },
  },
  animation: {
    duration: 1000,
  },
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
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
  },
};

const lineChartOptions = {
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
        text: "Time Period",
      },
    },
  },
  plugins: {
    tooltip: {
      intersect: false,
      mode: "index" as const,
    },
  },
  animation: {
    duration: 1000,
  },
};

// Helper functions
function filterByTimePeriod(
  data: GetListFeedbackResponse[],
  period: string
): GetListFeedbackResponse[] {
  const now = new Date("2023-09-01");
  let cutoffDate;

  switch (period) {
    case "7days":
      cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case "30days":
      cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - 30);
      break;
    case "12months":
      cutoffDate = new Date(now);
      cutoffDate.setMonth(now.getMonth() - 12);
      break;
    default:
      cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - 7);
  }

  return data.filter((item) => new Date(item.created_at) >= cutoffDate);
}

function groupFeedbacksByDate(
  data: GetListFeedbackResponse[],
  period: string
): Record<string, GetListFeedbackResponse[]> {
  const result: Record<string, GetListFeedbackResponse[]> = {};

  // Format based on time period
  data.forEach((item) => {
    const date = new Date(item.created_at);
    let formattedDate;

    switch (period) {
      case "7days":
        formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
        break;
      case "30days":
        formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
        break;
      case "12months":
        formattedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
        break;
      default:
        formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
    }

    if (!result[formattedDate]) {
      result[formattedDate] = [];
    }

    result[formattedDate].push(item);
  });

  return result;
}

// Methods
async function fetchFeedbackData() {
  isLoading.value = true;

  try {
    const filterParams = {
      // You can add additional filter parameters here
    };

    const response = await feedbackServices.getListFeedbacks(filterParams, {
      showError,
      showSuccess,
    });

    feedbacks.value = response.data || [];
    showSuccess("Feedback data loaded successfully");
  } catch (error) {
    showError("Failed to load feedback data");
    console.error("Error fetching feedback data:", error);
  } finally {
    isLoading.value = false;
  }
}

function changeTimePeriod(period: string) {
  selectedTimePeriod.value = period;
}

// Lifecycle hooks
onMounted(() => {
  fetchFeedbackData();
});
</script>

<template>
  <div class="feedback-statistics">
    <v-container class="py-4">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">Feedback Statistics</h1>
        </v-col>
      </v-row>

      <!-- Loading state -->
      <v-row
        v-if="isLoading"
        class="justify-center align-center"
        style="min-height: 200px"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-row>

      <!-- Charts -->
      <v-row v-else>
        <!-- Bar Chart -->
        <v-col cols="12" md="6">
          <v-card class="elevation-2 h-full">
            <v-card-title>Feedback by Type</v-card-title>
            <v-card-text>
              <div class="chart-container" style="height: 300px">
                <Bar :data="barChartData" :options="barChartOptions" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Pie Chart -->
        <v-col cols="12" md="6">
          <v-card class="elevation-2 h-full">
            <v-card-title>Feedback Rating Distribution</v-card-title>
            <v-card-text>
              <div class="chart-container" style="height: 300px">
                <Pie :data="pieChartData" :options="pieChartOptions" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Line Chart -->
        <v-col cols="12">
          <v-card class="elevation-2">
            <v-card-title>Feedback Ratings Over Time</v-card-title>
            <v-card-text>
              <!-- Time period filter tabs -->
              <div class="d-flex mb-4">
                <v-btn-toggle v-model="selectedTimePeriod" mandatory>
                  <v-btn value="7days" @click="changeTimePeriod('7days')">7 Days</v-btn>
                  <v-btn value="30days" @click="changeTimePeriod('30days')"
                    >30 Days</v-btn
                  >
                  <v-btn value="12months" @click="changeTimePeriod('12months')"
                    >12 Months</v-btn
                  >
                </v-btn-toggle>
              </div>

              <div class="chart-container" style="height: 400px">
                <Line :data="lineChartData" :options="lineChartOptions" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Summary statistics -->
      <v-row v-if="!isLoading" class="mt-4">
        <v-col cols="12" md="4">
          <v-card class="elevation-2 text-center h-full">
            <v-card-title>Total Feedbacks</v-card-title>
            <v-card-text>
              <div class="text-h3">{{ feedbacks.length }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="elevation-2 text-center h-full">
            <v-card-title>Average Rating</v-card-title>
            <v-card-text>
              <div class="text-h3">
                {{
                  feedbacks.length > 0
                    ? (
                        feedbacks.reduce((sum, f) => sum + f.rate, 0) / feedbacks.length
                      ).toFixed(1)
                    : "N/A"
                }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="elevation-2 text-center h-full">
            <v-card-title>Latest Feedback</v-card-title>
            <v-card-text>
              <div v-if="feedbacks.length">
                <div class="text-subtitle-1">
                  {{ new Date(feedbacks[0].created_at).toLocaleDateString() }}
                </div>
                <div class="text-body-1 mt-2">
                  {{ feedbacks[0].title.substring(0, 50)
                  }}{{ feedbacks[0].title.length > 50 ? "..." : "" }}
                </div>
              </div>
              <div v-else class="text-body-1">No feedbacks available</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}

.h-full {
  height: 100%;
}

/* Transition effects */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 16px rgba(0, 0, 0, 0.1) !important;
}
</style>
