<template>
  <v-container fluid class="pa-6">
    <!-- Loading Indicator -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <p class="mt-2">Loading course data...</p>
      </v-col>
    </v-row>

    <!-- Content Area -->
    <template v-if="!loading && courseData && learningPathData">
      <!-- <v-row>
        <v-col cols="12">
          <v-card class="mb-6 gradient-border">
            <v-card-item>
              <div class="d-flex align-center">
                <v-avatar color="primary" size="large" class="mr-4">
                  <v-icon size="large">mdi-book-education</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-h4 font-weight-bold mb-1">
                    {{ courseData.course_name }}
                  </div>
                  <div class="text-subtitle-1 text-medium-emphasis mb-2">
                    Course ID: {{ courseData.course_courseID }} | Credits:
                    {{ courseData.course_nCredit }}
                  </div>
                  <v-progress-linear
                    :model-value="courseData.percentage_done || 0"
                    color="secondary"
                    height="24"
                    rounded
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}% Complete</strong>
                    </template>
                  </v-progress-linear>
                </div>
                <v-chip
                  :color="getStatusColor(courseData.course_status)"
                  class="ml-4 text-capitalize"
                  size="large"
                >
                  {{ courseData.course_status }}
                </v-chip>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="objective-card">
            <v-card-item>
              <div class="d-flex align-center mb-4">
                <v-icon color="primary" size="large" class="mr-4"
                  >mdi-target</v-icon
                >
                <div class="text-h6">
                  Your Goal for
                  <span class="text-body-large-medium text-primary">{{
                    courseData.course_name
                  }}</span>
                  Course
                </div>
              </div>
              <v-card-text class="text-body-1">
                {{ learningPathData.student_goal }}
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row> -->

      <HorizontalLearningPath v-if="courseData" :course="courseData" />

      <!-- AI Assessment Button -->
      <v-row class="mb-4">
        <v-col cols="12" class="d-flex justify-center">
          <AIAssessmentButton :fetch-assessment="fetchAIAssessment" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="chart-card">
            <v-card-title class="text-h6">Progress Over Time</v-card-title>
            <v-card-text>
              <apexchart
                v-if="lineChartSeries.length"
                type="line"
                height="400"
                width="600"
                :options="lineChartOptions"
                :series="lineChartSeries"
              ></apexchart>
              <p v-else class="text-center text-medium-emphasis">
                No progress data available yet.
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="chart-card">
            <v-card-title class="text-h6">Performance Metrics</v-card-title>
            <v-card-text>
              <!-- Using ApexCharts for Bar Chart with Mock Data -->
              <apexchart
                type="bar"
                height="400"
                width="600"
                :options="barChartOptions"
                :series="barChartSeries"
              ></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <!-- Pass lessons data if the component needs it -->
          <OverallProgress :lessons="learningPathData.lessons || []" />
        </v-col>
      </v-row>
    </template>

    <!-- Error Message -->
    <v-row v-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="start">
          Failed to load course data: {{ error }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { coursesService } from "@/services/courseslistServices";
import {
  _GetRecommendedLessonsResponse,
  CourseDetailResponse,
} from "@/types/Course";
import { progressTrackingServices } from "@/services/ProgressTracking";
import { ProgressTrackingStudent } from "@/types/ProgressTracking";
interface RouteParam {
  courseId: string;
}
// --- State Variables ---
const courseData = ref<CourseDetailResponse | null>(null);
const learningPathData = ref<_GetRecommendedLessonsResponse | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const AIassessment = ref<ProgressTrackingStudent | null>(null);
const route = useRoute();
const { courseId } = route.params as RouteParam;
// --- Mock Data for Performance Metrics Bar Chart (ApexCharts format) ---
const barChartSeries = ref([
  {
    name: "Help Requests",
    data: [5, 8, 3],
  },
]);

const barChartOptions = reactive({
  chart: {
    type: "bar",
    height: 300,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "40%", // Adjust bar width
      endingShape: "rounded", // Optional: rounded bars
    },
  },
  colors: ["#4CAF50"], // Match previous color
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Lesson 1", "Lesson 2", "Lesson 3"],
    title: {
      text: "Lesson",
    },
  },
  yaxis: {
    title: {
      text: "Number of Requests",
    },
    labels: {
      formatter: function (val: number) {
        return val.toFixed(0) + " times"; // Format y-axis labels
      },
    },
    min: 0,
    tickAmount: 5, // Adjust based on expected max value
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + " requests";
      },
    },
  },
  grid: {
    borderColor: "#f1f1f1",
  },
});

// --- Line Chart State (Populated from API) ---
const lineChartSeries = ref<ApexAxisChartSeries>([]); // ApexCharts series format
const lineChartOptions = reactive<ApexCharts.ApexOptions>({
  // Use ApexCharts types
  chart: {
    height: 300,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: true, // Show toolbar for zoom, pan, export etc.
    },
  },
  dataLabels: {
    enabled: true, // Show data points values
    formatter: (val) => `${Math.round(Number(val))}%`,
  },
  stroke: {
    curve: "smooth", // Smoother line
    width: 3,
  },
  title: {
    text: "Lesson Progress",
    align: "left",
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"], // alternating row colors
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: [], // Will be populated from API data
    title: {
      text: "Lessons (in order)",
    },
    labels: {
      trim: true, // Attempts basic trimming (often not enough)
      hideOverlappingLabels: true, // Hides labels that would overlap
      rotate: -45, // Option: Rotate labels if needed
      rotateAlways: false, // Only rotate if they overlap (requires hideOverlappingLabels: false)
      maxHeight: 80, // Allow more vertical space if rotating/wrapping
      style: {
        fontSize: "11px", // Slightly smaller font
      },
    },
    // Tooltip shows full category name by default, but ensure it's enabled
    tooltip: {
      enabled: true,
    },
  },
  yaxis: {
    title: {
      text: "Progress (%)",
    },
    min: 0,
    max: 100,
    labels: {
      formatter: (val) => `${val}%`,
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `${Math.round(Number(val))}%`,
    },
  },
  markers: {
    size: 5, // Make points more visible
  },
});

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
// --- API Fetching Logic ---
const fetchCourseData = async () => {
  try {
    const response = await coursesService.fetchCourseDetail(
      { showError, showSuccess },
      courseId
    );
    courseData.value = response.data; // Assuming response.data is the course data
    return response.data; // Return course data for further processing if needed
  } catch (error) {
    console.error("Error fetching course data:", error);
    showError("Failed to load course data");
  }
};

const fetchLearningPathData = async () => {
  try {
    const response = await coursesService.getRecommendedLessons(
      { showError, showSuccess },
      courseId,
      "modules"
    );
    learningPathData.value = response.data; // Assuming response.data is the learning path data
    return response.data; // Return learning path data for further processing if needed
  } catch (error) {
    console.error("Error fetching learning path data:", error);
    showError("Failed to load learning path data");
  }
};

// --- Lifecycle Hook ---
onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch data in parallel
    const [courseResult, learningPathResult] = await Promise.all([
      fetchCourseData(),
      fetchLearningPathData(),
    ]);

    if (!courseResult || !learningPathResult) {
      throw new Error("Failed to fetch course or learning path data");
    }

    courseData.value = courseResult;
    learningPathData.value = learningPathResult;
    // Process learning path data for the line chart
    if (learningPathData.value && learningPathData.value.lessons.length > 0) {
      // Sort lessons by the 'order' field
      const sortedLessons = [...learningPathData.value.lessons].sort(
        (a, b) => a.order - b.order
      );

      const labels = sortedLessons.map((lesson) => lesson.lesson_title);
      const progressData = sortedLessons.map((lesson) => lesson.progress);

      // Update ApexCharts options and series
      lineChartOptions.xaxis = {
        ...lineChartOptions.xaxis, // Keep existing xaxis settings
        categories: labels, // Update categories
      };
      lineChartSeries.value = [
        {
          name: "Progress",
          data: progressData,
        },
      ];
    } else {
      // Handle case with no lessons or progress data
      lineChartSeries.value = []; // Clear series if no data
      lineChartOptions.xaxis = { ...lineChartOptions.xaxis, categories: [] }; // Clear categories
    }
  } catch (err: any) {
    console.error("Failed to load data:", err);
    error.value = err.message || "An unknown error occurred";
  } finally {
    loading.value = false;
  }
});

// --- Computed Properties & Methods ---
const getStatusColor = (status: string): string => {
  const normalizedStatus = status?.toLowerCase() || "unknown";
  const statusColors: { [key: string]: string } = {
    "in progress": "success", // Match API response "in Progress" -> "in progress"
    completed: "info",
    new: "primary",
  };
  return statusColors[normalizedStatus] || "grey";
};


const fetchAIAssessment = async () => {
  try {
    const response = await progressTrackingServices.getProgressTrackingStudent(
      { showError, showSuccess },
      {
        courseId: courseId,
        student_goal: learningPathData.value?.student_goal || "",
        lessons: learningPathData.value?.lessons || [],
      }
    );
    console.log("AI Assessment request body:", {
      courseId: courseId,
      student_goal: learningPathData.value?.student_goal || "",
      lessons: learningPathData.value?.lessons || [],
    });
    console.log("AI Assessment Data:", response.data);
    AIassessment.value = response.data; // Still update the ref for future reference
    return response.data;
  } catch (error) {
    console.error("Error fetching AI assessment data:", error);
    showError("Failed to load AI assessment data");
    return null;
  }
};
</script>

<style scoped>
.gradient-border {
  position: relative;
  background: linear-gradient(white, white) padding-box,
    linear-gradient(45deg, #6366f1, #8b5cf6) border-box;
  border: 2px solid transparent;
  border-radius: 12px;
}

.info-card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%; /* Ensure cards in a row have same height */
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.objective-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-left: 4px solid #6366f1; /* primary color */
}

.outcome-card {
  background-color: white;
  border-radius: 12px;
}

.chart-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  height: 100%; /* Ensure chart cards align nicely */
}

:deep(.v-timeline-item__body) {
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
}

:deep(.v-timeline-item__opposite) {
  margin-right: 16px;
  color: #64748b;
}

.v-progress-linear {
  border-radius: 8px;
}

/* Ensure ApexCharts renders correctly */
.chart-card .v-card-text {
  min-height: 320px; /* Give chart space to render */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
