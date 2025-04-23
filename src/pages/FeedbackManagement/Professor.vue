<template>
  <div class="bg-gray-50 min-h-screen">
    <main class="px-6 py-8">
      <!-- Header Section -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <h1 class="text-3xl font-bold gradient-text">Course Feedback Management</h1>
            <!-- Course Selector -->
            <v-select
              v-model="selectedCourseId"
              :items="formattedCourses"
              item-title="formatted_title"
              item-value="course_id"
              label="Select Course"
              variant="outlined"
              density="comfortable"
              class="w-64 rounded-lg transition-all hover:border-primary-lighten-1"
              hide-details
              prepend-icon="mdi-book-open-variant"
            ></v-select>
          </div>
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

              <!-- Category Filter -->
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
                  
                  <!-- Rating Filter -->
                  <v-select
                    v-model="filters.rating"
                    :items="ratingOptions"
                    label="Rating"
                    variant="outlined"
                    density="comfortable"
                    class="rounded-lg transition-all hover:border-primary-lighten-1"
                    hide-details
                    clearable
                    prepend-icon="mdi-star"
                  ></v-select>
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

          <template v-slot:item.rate="{ item }">
            <v-rating
              :value="Number(item.rate)"
              readonly
              density="compact"
              size="small"
              color="warning"
              class="transition-opacity hover:opacity-80"
            ></v-rating>
          </template>

          <template v-slot:item.student_info="{ item }">
            <div class="flex flex-col">
              <span class="font-medium">{{ item.student_name }}</span>
              <span class="text-sm text-gray-500">{{ item.student_email }}</span>
            </div>
          </template>
          
          <template v-slot:item.student_mssv="{ item }">
            <div class="flex items-center">
              <v-icon size="small" class="mr-2 text-gray-500">mdi-account-card</v-icon>
              <span class="font-medium">{{ item.student_mssv }}</span>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, computed, watch } from "vue";
import { feedbackServices } from "@/services/Professor/FeedbackServices";
import { coursesService } from "@/services/Professor/CourseServices";
import { GetListFeedbackProfessorResponse } from "@/types/Feedback";
import { GetCoursesTitle } from "@/types/Course";
import { formatDateTime } from "@/utils/functions/time";
import debounce from "@/composables/useDebounce";
import "../table.css";

const feedbacks = ref<GetListFeedbackProfessorResponse[]>([]);
const courses = ref<GetCoursesTitle[]>([]);
const selectedCourseId = ref<string>("");
const loading = ref(false);
const showFilters = ref(false);
const dateError = ref<string | null>(null);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const currentDate = new Date().toISOString().split("T")[0];

const filters = ref({
  category: null as string | null,
  rating: null as number | null,
  start_date: null as string | null,
  end_date: null as string | null,
});

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

const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(value => value !== null).length;
});

const ratingOptions = [
  { title: "5 Stars", value: 5 },
  { title: "4 Stars", value: 4 },
  { title: "3 Stars", value: 3 },
  { title: "2 Stars", value: 2 },
  { title: "1 Star", value: 1 },
];

const categories = [
  { title: "Performance", value: "performance" },
  { title: "Bug Report", value: "bug_report" },
  { title: "Feature Request", value: "feature_request" },
  { title: "User Interface", value: "user_interface" },
  { title: "Others", value: "others" },
];

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

const validateDateRange = () => {
  dateError.value = null;

  if (filters.value.start_date && filters.value.end_date) {
    const startDate = new Date(filters.value.start_date);
    const endDate = new Date(filters.value.end_date);

    if (startDate > endDate) {
      dateError.value = "Start date must be before or equal to end date";
      return false;
    }
  }

  return true;
};

const resetFilters = () => {
  filters.value = {
    category: null,
    rating: null,
    start_date: null,
    end_date: null,
  };
  dateError.value = null;
  // watch sẽ xử lý việc gọi API
};

const formattedCourses = computed(() => {
  if (!courses.value || courses.value.length === 0) return [];
  
  return courses.value.map(course => ({
    ...course,
    formatted_title: `[${course.course_nSemester}] ${course.course_name} (${course.course_courseID})`
  }));
});

const fetchCourses = async () => {
  try {
    const response = await coursesService.fetchCoursesTitleList({
      showError,
      showSuccess,
    });

    if ("data" in response && response.data) {
      courses.value = response.data as GetCoursesTitle[];
      // Set default course to first course in list
      if (courses.value.length > 0 && !selectedCourseId.value) {
        selectedCourseId.value = courses.value[0].course_id;
      }
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

const fetchFeedbacks = async () => {
  if (!selectedCourseId.value) return;
  if (!validateDateRange()) return;
  
  loading.value = true;
  try {
    // Tạo parameters cho API
    const filterParams = {
      course_id: selectedCourseId.value,
      ...Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => value !== null)
      ),
    };
    
    const response = await feedbackServices.fetchFeedbackProfessor(
      { showError, showSuccess },
      filterParams.course_id
    );

    if ("data" in response && response.data) {
      feedbacks.value = response.data as GetListFeedbackProfessorResponse[];
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

// Watch for changes in selectedCourseId
watch(selectedCourseId, () => {
  fetchFeedbacks();
});

const headers = [
  { title: "Student ID", key: "student_mssv", align: "start" as const },
  { title: "Student", key: "student_info", align: "start" as const },
  { title: "Feedback Title", key: "title" },
  { title: "Feedback Description", key: "description" },
  { title: "Category", key: "category", align: "center" as const },
  { title: "Rating", key: "rate", align: "center" as const, sortable: true },
  { title: "Created At", key: "created_at", align: "center" as const, sortable: true },
];

// Watch for changes in selectedCourseId
watch(selectedCourseId, () => {
  fetchFeedbacks();
});

onMounted(() => {
  fetchCourses();
});
</script>

