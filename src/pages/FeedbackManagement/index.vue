<template>
  <v-layout class="bg-gray-50 min-h-screen">
    <v-main class="px-6 py-8">
      <!-- Header Section -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">System Feedback Management</h1>
          <div class="flex items-center gap-4">
            <v-btn
              @click="showFilters = !showFilters"
              variant="tonal"
              class="rounded-lg"
              :class="{ 'bg-primary': activeFiltersCount > 0 }"
            >
              <v-icon start>mdi-filter</v-icon>
              Filters
              <v-badge
                v-if="activeFiltersCount > 0"
                :content="activeFiltersCount"
                color="primary"
                class="ml-2"
              ></v-badge>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <v-expand-transition>
        <v-card
          v-if="showFilters"
          class="mb-6 max-w-7xl mx-auto rounded-xl border border-gray-100"
          elevation="3"
        >
          <v-card-text class="py-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Time Period Filters -->
              <div class="space-y-2">
                <div class="text-sm font-semibold text-gray-700 mb-3">Time Period</div>
                <div class="grid grid-cols-2 gap-4">
                  <v-select
                    v-model="filters.month"
                    :items="months"
                    label="Month"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg"
                    hide-details
                    clearable
                  ></v-select>
                  <v-select
                    v-model="filters.year"
                    :items="availableYears"
                    label="Year"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg"
                    hide-details
                    clearable
                  ></v-select>
                </div>
              </div>

              <!-- Status Filter -->
              <div class="space-y-2">
                <div class="text-sm font-semibold text-gray-700 mb-3">Status</div>
                <div class="grid grid-cols-1 gap-4">
                  <v-select
                    v-model="filters.status"
                    :items="statusOptions"
                    label="Status"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg"
                    hide-details
                    clearable
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-icon :color="getStatusColor(item.value)" size="small">
                            mdi-circle-medium
                          </v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </div>
              </div>

              <!-- Category and Actions -->
              <div class="space-y-2">
                <div class="text-sm font-semibold text-gray-700 mb-3">Category</div>
                <div class="flex items-end gap-4">
                  <v-select
                    v-model="filters.category"
                    :items="categories"
                    label="Category"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg flex-grow"
                    hide-details
                    clearable
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-icon :color="getCategoryColor(item.value)" size="small">
                            mdi-circle-medium
                          </v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                  <div class="flex gap-2">
                    <v-btn
                      color="primary"
                      @click="applyFilters"
                      :loading="loading"
                      class="px-6"
                    >
                      Apply
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      @click="resetFilters"
                      :disabled="loading"
                      class="px-6"
                    >
                      Reset
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-expand-transition>

      <!-- Data Table -->
      <v-card class="max-w-7xl mx-auto rounded-xl border border-gray-100" elevation="3">
        <v-data-table
          :headers="headers"
          :items="feedbacks"
          :items-per-page="10"
          :loading="loading"
          class="elevation-0"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              :text-color="getStatusColor(item.status)"
              variant="outlined"
              size="small"
              class="font-medium"
            >
              {{ item.status.replace("_", " ").toUpperCase() }}
            </v-chip>
          </template>

          <template v-slot:item.category="{ item }">
            <v-chip
              :color="getCategoryColor(item.category)"
              :text-color="getCategoryColor(item.category)"
              variant="outlined"
              size="small"
              class="font-medium"
            >
              {{ item.category.replace("_", " ").toUpperCase() }}
            </v-chip>
          </template>

          <template v-slot:item.created_at="{ item }">
            {{ formatDateTime(item.created_at) }}
          </template>

          <template v-slot:item.resolved_at="{ item }">
            {{ item.resolved_at ? formatDateTime(item.resolved_at) : "-" }}
          </template>

          <template v-slot:item.rate="{ item }">
            <v-rating
              v-model="item.rate"
              readonly
              density="compact"
              size="small"
              color="warning"
            ></v-rating>
          </template>
        </v-data-table>
      </v-card>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, computed } from "vue";
import { feedbackServices } from "@/services/feedbackServices";
import { GetListFeedbackResponse } from "@/types/Feedback";
import { formatDateTime } from "@/utils/functions/time";

const feedbacks = ref<GetListFeedbackResponse[]>([]);
const loading = ref(false);
const showFilters = ref(false);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const months = Array.from({ length: 12 }, (_, i) => ({
  title: new Date(0, i).toLocaleString("default", { month: "long" }),
  value: i + 1,
}));

const getListYear = (rawData: GetListFeedbackResponse[]): number[] => {
  const years = rawData.map((feedback) => new Date(feedback.created_at).getFullYear());
  return Array.from(new Set(years)).sort((a, b) => b - a);
};

const availableYears = computed(() => getListYear(feedbacks.value));

const statusOptions = [
  { title: "Pending", value: "pending" },
  { title: "In Progress", value: "in_progress" },
  { title: "Resolved", value: "resolved" },
];

const categories = [
  { title: "Performance", value: "performance" },
  { title: "Bug Report", value: "bug_report" },
  { title: "Feature Request", value: "feature_request" },
  { title: "User Interface", value: "user_interface" },
  { title: "Others", value: "others" },
];

const filters = ref({
  month: null as number | null,
  year: null as number | null,
  feedback_type: "system" as string,
  status: null as string | null,
  category: null as string | null,
});

const activeFiltersCount = computed(() => {
  return Object.entries(filters.value).filter(
    ([key, value]) => key !== "feedback_type" && value !== null
  ).length;
});

const resetFilters = () => {
  filters.value = {
    month: null,
    year: null,
    feedback_type: "system",
    status: null,
    category: null,
  };
  fetchFeedbacks();
};

const applyFilters = () => {
  fetchFeedbacks();
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: "warning",
    in_progress: "info",
    resolved: "success",
  };
  return colors[status as keyof typeof colors];
};

const getCategoryColor = (category: string) => {
  const colors = {
    performance: "primary",
    bug_report: "error",
    feature_request: "warning",
    user_interface: "info",
    others: "secondary",
  };
  return colors[category as keyof typeof colors];
};

const fetchFeedbacks = async () => {
  loading.value = true;
  try {
    const filterParams = {
      ...Object.fromEntries(
        Object.entries(filters.value).filter(
          ([key, value]) => key === "feedback_type" || value !== null
        )
      ),
    };

    const response = await feedbackServices.getListFeedbacks(filterParams, {
      showError,
      showSuccess,
    });

    if ("data" in response && response.data) {
      feedbacks.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
  } finally {
    loading.value = false;
  }
};

const headers = [
  { title: "User", key: "student_name", align: "start" as const },
  { title: "Feedback Title", key: "title" },
  { title: "Feedback Description", key: "description" },
  { title: "Category", key: "category", align: "center" as const },
  { title: "Rating", key: "rate", align: "center" as const, sortable: true },
  { title: "Created At", key: "created_at", align: "center" as const, sortable: true },
  { title: "Resolved At", key: "resolved_at", align: "center" as const, sortable: true },
  { title: "Status", key: "status", align: "center" as const },
];

onMounted(() => {
  fetchFeedbacks();
});
</script>

<style scoped>
:deep(.v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

:deep(.v-data-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.v-data-table__thead) {
  background-color: rgb(249, 250, 251);
}

:deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  text-transform: none !important;
  white-space: nowrap;
}

:deep(.v-data-table-footer) {
  background-color: rgb(249, 250, 251);
}
</style>
