<template>
  <v-layout class="bg-gray-50 min-h-screen">
    <v-main class="px-6 py-8">
      <div class="flex space-x-6">
        <div class="flex flex-col space-y-6 w-full">
          <WelcomeCardProfessor />
          <FeedbackCard @open-feedback="openFeedback" type="system" />
        </div>

      </div>

      <!-- Statistics Cards -->
      <StatisticProfessor
        v-if="dashboardData"
        :dashboardData="dashboardData"
      />

      <!-- Quick Actions -->
      <div class="mt-8">
        <h2 class="text-h5 mb-4 font-weight-bold gradient-text">Quick Actions</h2>
        <v-row>
          <v-col cols="12" md="4" v-for="action in quickActions" :key="action.title">
            <v-card
              :to="action.to"
              class="rounded-xl border-card transition-all duration-200 hover:shadow-lg h-100"
              elevation="2"
            >
              <v-card-text class="py-6">
                <div class="d-flex flex-column align-center text-center">
                  <v-avatar :color="action.color" size="64" class="mb-4">
                    <v-icon color="white" size="32">{{ action.icon }}</v-icon>
                  </v-avatar>
                  <h3 class="text-h6 font-weight-bold mb-2">{{ action.title }}</h3>
                  <p class="text-body-2 text-medium-emphasis">{{ action.description }}</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Recent Feedback Section -->
      <div class="mt-8">
        <h2 class="text-h5 mb-4 font-weight-bold gradient-text">Recent Student Feedback</h2>
        <v-card class="rounded-xl" elevation="2">
          <v-data-table
            :headers="feedbackHeaders"
            :items="recentFeedback"
            :items-per-page="5"
            class="elevation-0 enhanced-table"
            :loading="feedbackLoading"
          >
            <template v-slot:loading>
              <div class="flex items-center justify-center pa-6">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <span class="ml-4">Loading feedback data...</span>
              </div>
            </template>
            
            <template v-slot:item.category="{ item }">
              <v-chip
                :color="getCategoryColor(item.category)"
                variant="outlined"
                size="small"
                class="font-medium transition-all hover:opacity-80"
                pill
              >
                {{ item.category.replace("_", " ").toUpperCase() }}
              </v-chip>
            </template>
            
            <template v-slot:item.rate="{ item }">
              <v-rating
                :model-value="Number(item.rate)"
                readonly
                density="compact"
                size="small"
                color="warning"
                class="transition-opacity hover:opacity-80"
              ></v-rating>
            </template>
            
            <template v-slot:item.created_at="{ item }">
              {{ formatDateTime(item.created_at) }}
            </template>
            
            <template v-slot:bottom>
              <div class="d-flex justify-end pa-4">
                <v-btn color="primary" variant="text" to="/professor-feedback" class="px-4">
                  View All Feedback
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { dashboardService } from "@/services/Professor/DashboardServices";
import { formatDateTime } from "@/utils/functions/time";
import { 
  GetDashboardProfessorResponse, 
  FeedbackSummaryResponse,
} from "@/types/Dashboard";


// State variables
const dashboardData = ref<GetDashboardProfessorResponse>();
const recentFeedback = ref<FeedbackSummaryResponse[]>([]);
const showFeedbackDialog = ref(false);
const feedbackLoading = ref(false);

// Injected methods
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Computed properties for performance metrics

// Quick action buttons
const quickActions = [
  {
    title: "Create New Lesson",
    description: "Add a new lesson to one of your courses",
    icon: "mdi-book-plus",
    to: "/professor-courselist",
    color: "primary"
  },
  {
    title: "Add Exercise",
    description: "Create a new quiz or coding assignment",
    icon: "mdi-pencil-plus",
    to: "/professor-courselist",
    color: "secondary"
  },
  {
    title: "Review Progress",
    description: "Check student performance and progress",
    icon: "mdi-chart-line",
    to: "/professor-progress",
    color: "success"
  }
];

// Headers for feedback table
const feedbackHeaders = [
  { title: "Student", key: "student_name", align: "start" as const },
  { title: "Feedback Title", key: "title" },
  { title: "Category", key: "category", align: "center" as const },
  { title: "Rating", key: "rate", align: "center" as const, sortable: true },
  { title: "Created At", key: "created_at", align: "center" as const, sortable: true },
];

// Utility functions
const openFeedback = () => {
  showFeedbackDialog.value = true;
};

const getCategoryColor = (category: string) => {
  const colors = {
    performance: "primary",
    bug_report: "error",
    feature_request: "warning",
    user_interface: "info",
    others: "secondary",
  };
  return colors[category as keyof typeof colors] || "gray";
};


// Data fetching functions
const fetchDashboardData = async () => {
  try {
    const response = await dashboardService.fetchDashboardProfessor({ showError, showSuccess });
    if (response && "data" in response && response.data) {
      dashboardData.value = response.data as GetDashboardProfessorResponse;
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    showError("Failed to load dashboard data");
  }
};


const fetchRecentFeedback = async () => {
  try {
    feedbackLoading.value = true;
    const response = await dashboardService.fetchRecentFeedback({ showError, showSuccess });
    if (response && "data" in response && response.data) {
      recentFeedback.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching recent feedback:", error);
    // Fallback to empty array rather than showing error
    recentFeedback.value = [];
  } finally {
    feedbackLoading.value = false;
  }
};


// Initialize everything on mount
onMounted(async () => {
  try {
    await Promise.all([
      fetchDashboardData(),
      fetchRecentFeedback(),
    ]);
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    showError("Failed to initialize dashboard. Please try refreshing the page.");
  }


});
</script>

<style scoped>
.border-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.border-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08) !important;
}

.chart-container {
  position: relative;
  margin: auto;
}

.gradient-text {
  background: linear-gradient(45deg, var(--v-theme-primary), var(--v-theme-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* Enhanced table styles */
:deep(.enhanced-table .v-data-table__thead th) {
  font-weight: 600 !important;
  text-transform: none !important;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

:deep(.enhanced-table .v-data-table__tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.03);
}
</style>