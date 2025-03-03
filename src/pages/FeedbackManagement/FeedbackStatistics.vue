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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { feedbackServices } from "@/services/feedbackServices";
import { GetListFeedbackResponse } from "@/types/Feedback";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);

const feedbacks = ref<GetListFeedbackResponse[]>([]);
const isLoading = ref(true);
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
const selectedRatingFilter = ref<"high" | "medium" | "low" | null>(null);
const dialogVisible = ref(false); // Added for dialog visibility
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
// Add new refs for detailed view
const showDetails = ref(false);
const selectedFeedback = ref<GetListFeedbackResponse | null>(null);

const headers = [
  { text: "Title", value: "title", sortable: true },
  { text: "Type", value: "type", sortable: true },
  { text: "Category", value: "category", sortable: true },
  { text: "Rating", value: "rate", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Created", value: "created_at", sortable: true },
  { text: "Resolved", value: "resolved_at", sortable: true },
  { text: "Student", value: "student_name", sortable: true },
  { text: "Actions", value: "actions", sortable: false },
];

// Status color mapping
function getStatusColor(status: string) {
  switch (status) {
    case "resolved":
      return "success";
    case "in_progress":
      return "warning";
    case "pending":
      return "error";
    default:
      return "grey";
  }
}

// View details handler
function viewFeedbackDetails(feedback: GetListFeedbackResponse) {
  selectedFeedback.value = feedback;
  showDetails.value = true;
}

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

const lineChartData = computed(() => {
  const filteredFeedbacks = feedbacks.value;
  const groupedByDate = groupFeedbacksByDate(filteredFeedbacks);

  const sortedDates = Object.keys(groupedByDate).sort();
  const highRatings = sortedDates.map(
    (date) => groupedByDate[date].filter((f) => f.rate >= 4).length
  );
  const mediumRatings = sortedDates.map(
    (date) => groupedByDate[date].filter((f) => f.rate === 3).length
  );
  const lowRatings = sortedDates.map(
    (date) => groupedByDate[date].filter((f) => f.rate <= 2).length
  );

  return {
    labels: sortedDates,
    datasets: [
      {
        label: "High (4-5)",
        data: highRatings,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.3,
      },
      {
        label: "Medium (3)",
        data: mediumRatings,
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.1)",
        tension: 0.3,
      },
      {
        label: "Low (1-2)",
        data: lowRatings,
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        tension: 0.3,
      },
    ],
  };
});

const filteredFeedbackList = computed(() => {
  if (!selectedRatingFilter.value) return [];
  return feedbacks.value.filter((f) => {
    if (selectedRatingFilter.value === "high") return f.rate >= 4;
    if (selectedRatingFilter.value === "medium") return f.rate === 3;
    return f.rate <= 2;
  });
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
      color: "#fff", // Text color
      font: {
        weight: "bold" as const,
        size: window.innerWidth < 600 ? 12 : 14, // Responsive font size
      },
      padding: 4,
      textAlign: "center" as const,
      anchor: "center" as const, // Position labels at center of pie segments
      align: "center" as const,
    },
    legend: {
      position: "bottom" as const, // Move legend to avoid overlap
    },
  },
  onClick: (_: any, elements: any) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      selectedRatingFilter.value = index === 0 ? "high" : index === 1 ? "medium" : "low";
      dialogVisible.value = true;
    }
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
  },
};

function groupFeedbacksByDate(
  data: GetListFeedbackResponse[]
): Record<string, GetListFeedbackResponse[]> {
  const result: Record<string, GetListFeedbackResponse[]> = {};
  data.forEach((item) => {
    const date = new Date(item.created_at);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    if (!result[formattedDate]) result[formattedDate] = [];
    result[formattedDate].push(item);
  });
  return result;
}
async function fetchFeedbackData() {
  isLoading.value = true;
  try {
    const params = {
      start_date: startDate.value || undefined,
      end_date: endDate.value || undefined,
    };
    const response = await feedbackServices.getListFeedbacks(params, {
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

function validateAndFetch() {
  if (startDate.value && endDate.value && startDate.value > endDate.value) {
    showError("Start date must be less than or equal to end date");
    return;
  }
  fetchFeedbackData();
}

onMounted(() => {
  fetchFeedbackData();
});
</script>

<template>
  <div class="feedback-statistics">
    <v-container class="py-4">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4 gradient-text">Feedback Statistics</h1>
        </v-col>
      </v-row>

      <!-- Summary Statistics -->
      <v-row v-if="!isLoading">
        <v-col cols="12" md="4">
          <v-card class="elevation-2 text-center h-full">
            <v-card-title class="text-primary">Total Feedbacks</v-card-title>
            <v-card-text>
              <div class="text-h3">{{ feedbacks.length }}</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="elevation-2 text-center h-full">
            <v-card-title class="text-primary">Average Rating</v-card-title>
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
            <v-card-title class="text-primary">Latest Feedback</v-card-title>
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

      <!-- Date Range Filter -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="startDate"
            label="Start Date"
            type="date"
            :max="endDate || new Date().toISOString().split('T')[0]"
            @change="validateAndFetch"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="endDate"
            label="End Date"
            type="date"
            :min="startDate"
            :max="new Date().toISOString().split('T')[0]"
            @change="validateAndFetch"
          ></v-text-field>
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
        <v-col cols="12" md="6">
          <v-card class="elevation-2 h-full">
            <v-card-title class="text-secondary-variant">Feedback by Type</v-card-title>
            <v-card-text>
              <div class="chart-container" style="height: 300px">
                <Bar :data="barChartData" :options="barChartOptions" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="elevation-2 h-full">
            <v-card-title class="text-secondary-variant"
              >Feedback Rating Distribution</v-card-title
            >
            <v-card-text>
              <div class="chart-container" style="height: 300px">
                <Pie :data="pieChartData" :options="pieChartOptions" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card class="elevation-2">
            <v-card-title class="text-secondary-variant"
              >Feedback Ratings Over Time</v-card-title
            >
            <v-card-text>
              <div class="chart-container" style="height: 400px">
                <Line :data="lineChartData" :options="lineChartOptions" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Feedback List Dialog -->
        <v-dialog v-model="dialogVisible" max-width="600px">
          <v-card>
            <v-card-title class="d-flex align-center">
              <span>
                {{
                  selectedRatingFilter === "high"
                    ? "High"
                    : selectedRatingFilter === "medium"
                    ? "Medium"
                    : "Low"
                }}
                Rated Feedback
              </span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="
                  dialogVisible = false;
                  selectedRatingFilter = null;
                "
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="filteredFeedbackList"
                :items-per-page="5"
                class="elevation-1"
              >
                <!-- Custom slots for specific columns -->
                <template v-slot:item.created_at="{ item }">
                  {{ new Date(item.created_at).toLocaleDateString() }}
                </template>

                <template v-slot:item.resolved_at="{ item }">
                  {{
                    item.resolved_at
                      ? new Date(item.resolved_at).toLocaleDateString()
                      : "N/A"
                  }}
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip :color="getStatusColor(item.status)" small>
                    {{ item.status }}
                  </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon
                    small
                    @click="viewFeedbackDetails(item)"
                    title="View Details"
                  >
                    <v-icon small>mdi-eye</v-icon>
                  </v-btn>
                </template>

                <!-- No items message -->
                <template v-slot:no-data>
                  <v-alert :value="true" color="info" icon="mdi-information" outlined>
                    No feedback available
                  </v-alert>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>

          <!-- Optional: Detailed view dialog -->
          <v-dialog v-model="showDetails" max-width="600px">
            <v-card v-if="selectedFeedback">
              <v-card-title>Feedback Details</v-card-title>
              <v-card-text>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>ID:</v-list-item-title>
                      <v-list-item-subtitle>{{
                        selectedFeedback.id
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Title:</v-list-item-title>
                      <v-list-item-subtitle>{{
                        selectedFeedback.title
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Description:</v-list-item-title>
                      <v-list-item-subtitle>{{
                        selectedFeedback.description
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Student:</v-list-item-title>
                      <v-list-item-subtitle
                        >{{ selectedFeedback.student_id }} ({{
                          selectedFeedback.student_id
                        }})</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="showDetails = false"
                  >Close</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-dialog>
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

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Add custom styles if needed */
.v-data-table {
  margin-top: 16px;
}

/* Ensure chips have readable text */
.v-chip {
  color: white;
}
</style>
