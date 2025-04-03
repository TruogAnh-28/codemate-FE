<template>
  <div class="bg-gray-50 min-h-screen">
    <main class="px-6 py-8">
      <!-- Header Section -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold gradient-text">System Feedback Management</h1>
          <v-btn
            @click="showFilters = !showFilters"
            variant="tonal"
            color="primary"
            class="rounded-lg transition-all duration-200 hover:scale-105"
            :class="{ 'bg-primary-lighten-1 text-white': activeFiltersCount > 0 }"
          >
            <v-icon start>mdi-filter</v-icon>
            Filters
            <v-badge
              v-if="activeFiltersCount > 0"
              :content="activeFiltersCount"
              color="primary"
              class="ml-4 mb-1"
            ></v-badge>
          </v-btn>
        </div>
      </div>

      <!-- Filters Card -->
      <v-expand-transition>
        <v-card
          v-if="showFilters"
          class="mb-6 max-w-7xl mx-auto rounded-xl border border-gray-100 transition-shadow hover:shadow-lg"
          elevation="3"
        >
          <v-card-text class="py-6">
            <div class="flex flex-wrap gap-6">
              <!-- Date Range Filter -->
              <div class="flex-1 min-w-[300px] space-y-2">
                <div class="text-sm font-semibold text-gray-700 mb-3">Date Range</div>
                <div class="flex flex-col gap-4">
                  <v-text-field
                    v-model="filters.start_date"
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg transition-all hover:border-primary-lighten-1"
                    hide-details
                    prepend-icon="mdi-calendar-start"
                    :rules="[dateRules.required, dateRules.startBeforeEnd]"
                    :max="MaxStartDate"
                  ></v-text-field>

                  <v-text-field
                    v-model="filters.end_date"
                    label="End Date"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg transition-all hover:border-primary-lighten-1"
                    hide-details
                    prepend-icon="mdi-calendar-end"
                    :rules="[dateRules.required, dateRules.endAfterStart]"
                    :min="MinEndDate"
                  ></v-text-field>
                </div>
                <div v-if="dateError" class="text-error text-xs mt-1">
                  {{ dateError }}
                </div>
              </div>

              <!-- Category and Status Filters -->
              <div class="flex-1 min-w-[300px] space-y-2">
                <div class="text-sm font-semibold text-gray-700 mb-3">Classification</div>
                <div class="flex flex-col gap-4">
                  <v-select
                    v-model="filters.category"
                    :items="categories"
                    label="Category"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg transition-all hover:border-primary-lighten-1"
                    hide-details
                    clearable
                    prepend-icon="mdi-shape"
                  >
                    <template v-slot:selection="{ item }">
                      <div class="flex items-center">
                        <v-icon
                          :color="getCategoryColor(item.value)"
                          size="small"
                          class="mr-2"
                        >
                          mdi-circle-medium
                        </v-icon>
                        <span class="font-medium">{{ item.title }}</span>
                      </div>
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" class="hover:bg-gray-100">
                        <template v-slot:prepend>
                          <v-icon :color="getCategoryColor(item.value)" size="small">
                            mdi-circle-medium
                          </v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                  <v-select
                    v-model="filters.status"
                    :items="statusOptions"
                    label="Status"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg transition-all hover:border-primary-lighten-1"
                    hide-details
                    clearable
                    prepend-icon="mdi-flag"
                  >
                    <template v-slot:selection="{ item }">
                      <div class="flex items-center">
                        <v-icon
                          :color="getStatusColor(item.value)"
                          size="small"
                          class="mr-2"
                        >
                          mdi-circle-medium
                        </v-icon>
                        <span class="font-medium">{{ item.title }}</span>
                      </div>
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" class="hover:bg-gray-100">
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
            </div>
          </v-card-text>
          <!-- Action Buttons -->
          <div class="flex justify-end p-4">
            <v-btn
              variant="outlined"
              @click="resetFilters"
              :disabled="loading"
              class="px-6 rounded-lg transition-all duration-200 hover:bg-gray-100"
              prepend-icon="mdi-refresh"
            >
              Reset
            </v-btn>
          </div>
        </v-card>
      </v-expand-transition>

      <!-- Data Table -->
      <v-card
        class="max-w-7xl mx-auto rounded-xl border border-gray-100 transition-shadow hover:shadow-lg"
        elevation="3"
      >
        <v-data-table
          :headers="headers"
          :items="feedbacks"
          :items-per-page="10"
          :loading="loading"
          class="elevation-0 enhanced-table"
        >
          <template v-slot:loading>
            <div class="flex items-center justify-center pa-6">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <span class="ml-4">Loading data...</span>
            </div>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              variant="outlined"
              size="small"
              class="font-medium transition-all hover:opacity-80"
              pill
            >
              {{ item.status.replace("_", " ").toUpperCase() }}
            </v-chip>
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

          <template v-slot:item.created_at="{ item }">
            {{ formatDateTime(item.created_at) }}
          </template>

          <template v-slot:item.resolved_at="{ item }">
            {{ item.resolved_at ? formatDateTime(item.resolved_at) : "-" }}
          </template>

          <template v-slot:item.rate="{ item }">
            <v-rating
              v-model:model-value="item.rate"
              readonly
              density="compact"
              size="small"
              color="warning"
              class="transition-opacity hover:opacity-80"
            ></v-rating>
          </template>
        </v-data-table>
      </v-card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, computed, watch } from "vue";
import { feedbackServices } from "@/services/feedbackServices";
import { GetListFeedbackResponse } from "@/types/Feedback";
import { formatDateTime } from "@/utils/functions/time";
import debounce from "@/composables/useDebounce";
import "../table.css";

const feedbacks = ref<GetListFeedbackResponse[]>([]);
const loading = ref(false);
const showFilters = ref(false);
const dateError = ref<string | null>(null);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const currentDate = new Date().toISOString().split("T")[0];

const MaxStartDate = computed(() => {
  if (filters.value.end_date) {
    return filters.value.end_date;
  }
  return currentDate;
});

const MinEndDate = computed(() => {
  if (filters.value.start_date) {
    return filters.value.start_date;
  }
});

const getListYear = (
  rawData: GetListFeedbackResponse[]
): { title: number; value: number }[] => {
  const years = rawData.map((feedback) => new Date(feedback.created_at).getFullYear());
  const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
  return uniqueYears.map((year) => ({ title: year, value: year }));
};

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
  start_date: null as string | null,
  end_date: null as string | null,
});

const dateRules = {
  required: (value: string) => !!value || "Date is required",
  startBeforeEnd: (value: string) => {
    if (!value || !filters.value.end_date) return true;
    return (
      new Date(value) <= new Date(filters.value.end_date) ||
      "Start date must be before end date"
    );
  },
  endAfterStart: (value: string) => {
    if (!value || !filters.value.start_date) return true;
    return (
      new Date(value) >= new Date(filters.value.start_date) ||
      "End date must be after start date"
    );
  },
};

// Computed properties for disabling month/year selects based on date range
const monthSelectDisabled = computed(() => {
  if (!filters.value.start_date || !filters.value.end_date) return false;

  const startDate = new Date(filters.value.start_date);
  const endDate = new Date(filters.value.end_date);

  if (startDate.getFullYear() === endDate.getFullYear()) {
    return startDate.getMonth() !== endDate.getMonth();
  }

  return true;
});

const yearSelectDisabled = computed(() => {
  if (!filters.value.start_date || !filters.value.end_date) return false;

  const startDate = new Date(filters.value.start_date);
  const endDate = new Date(filters.value.end_date);

  return startDate.getFullYear() !== endDate.getFullYear();
});

// Validate date range and update disabled states
const validateDateRange = () => {
  dateError.value = null;

  if (filters.value.start_date && filters.value.end_date) {
    const startDate = new Date(filters.value.start_date);
    const endDate = new Date(filters.value.end_date);

    if (startDate > endDate) {
      dateError.value = "Start date must be before or equal to end date";
      return false;
    }

    if (monthSelectDisabled.value) {
      filters.value.month = null;
    }

    if (yearSelectDisabled.value) {
      filters.value.year = null;
    }
  }

  return true;
};

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
    start_date: null,
    end_date: null,
  };
  dateError.value = null;
  // No need to call fetchFeedbacks here; watch will handle it
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: "warning",
    in_progress: "info",
    resolved: "success",
  };
  return colors[status as keyof typeof colors] || "gray";
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

const fetchFeedbacks = async () => {
  if (!validateDateRange()) return; // Skip fetch if date range is invalid

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
      console.log("Rating list", response.data.map((item) => item.rate));
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
  } finally {
    loading.value = false;
  }
};

// Debounced fetchFeedbacks function
const debouncedFetchFeedbacks = debounce.useDebounceFn(fetchFeedbacks, 500);

// Watch filters object deeply and apply debounced fetch
watch(
  () => filters.value,
  () => {
    debouncedFetchFeedbacks();
  },
  { deep: true }
);

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
  fetchFeedbacks(); // Initial fetch without debounce
});
</script>
