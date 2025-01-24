<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6 gradient-border">
          <v-card-item>
            <div class="d-flex align-center">
              <v-avatar color="primary" size="large" class="mr-4">
                <v-icon size="large">mdi-book-education</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold mb-1">
                  {{ courseInfo.name }}
                </div>
                <div class="text-subtitle-1 text-medium-emphasis mb-2">
                  Course ID: {{ courseInfo.courseID }} | Credits:
                  {{ courseInfo.nCredit }}
                </div>
                <v-progress-linear
                  v-model="learningPath.progress"
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
                :color="getStatusColor"
                class="ml-4 text-capitalize"
                size="large"
              >
                {{ courseInfo.status }}
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
              <div class="text-h6">Your Goal of <span class="text-body-large-medium text-primary">Discrete Structures for Computing</span> Course</div>
            </div>
            <v-card-text class="text-body-1">
              {{ learningPath.objective }}
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="info-card" elevation="2" hover>
          <v-card-item>
            <div class="d-flex align-center">
              <v-icon color="primary" size="large" class="mr-4"
                >mdi-calendar</v-icon
              >
              <div>
                <div class="text-caption text-medium-emphasis">Start Date</div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ formatDate(learningPath.start_date) }}
                </div>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="info-card" elevation="2" hover>
          <v-card-item>
            <div class="d-flex align-center">
              <v-icon color="primary" size="large" class="mr-4"
                >mdi-calendar-end</v-icon
              >
              <div>
                <div class="text-caption text-medium-emphasis">End Date</div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ formatDate(learningPath.end_date) }}
                </div>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="info-card" elevation="2" hover>
          <v-card-item>
            <div class="d-flex align-center">
              <v-icon color="primary" size="large" class="mr-4"
                >mdi-school</v-icon
              >
              <div>
                <div class="text-caption text-medium-emphasis">Semester</div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ courseInfo.nSemester }}
                </div>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="info-card" elevation="2" hover>
          <v-card-item>
            <div class="d-flex align-center">
              <v-icon color="primary" size="large" class="mr-4"
                >mdi-trophy-variant</v-icon
              >
              <div>
                <div class="text-caption text-medium-emphasis">Progress</div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ learningPath.progress }}%
                </div>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h6">Learning Outcomes</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(outcome, index) in courseInfo.learning_outcomes"
                :key="index"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                </template>
                {{ outcome }}
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="chart-card">
          <v-card-title class="text-h6">Progress Over Time</v-card-title>
          <v-card-text>
            <Line
              id="my-line-chart"
              :options="chartOptions"
              :data="chartData"
              class="h-64"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="chart-card">
          <v-card-title class="text-h6">Performance Metrics</v-card-title>
          <v-card-text>
            <Bar
              id="my-bar-chart"
              :options="barChartOptionss"
              :data="barChartDataa"
              class="h-64"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <OverallProgress />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { Line, Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  chartDataa,
  chartOptionss,
  barChartData,
  barChartOptions,
} from "@/utils/constant";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const courseInfo = reactive({
  id: "1",
  name: "Discrete Structures for Computing",
  professor_id: "1",
  learning_outcomes: [
    "Understand set theory",
    "Learn graph theory",
    "Explore combinatorics",
  ],
  start_date: "2024-09-01",
  end_date: "2024-12-15",
  status: "In Progress",
  image_url: "https://www.example.com/course1.png",
  nCredit: 3,
  nSemester: 1,
  courseID: "CS101",
  createdByAdminID: "1",
});

const learningPath = reactive({
  id: "1",
  start_date: "2024-09-01",
  end_date: "2024-12-15",
  objective:
    "Gain a solid understanding of set theory and operations, and apply them to problem-solving",
  progress: 56,
  student_id: "1",
  course_id: "1",
});

const chartData = reactive(chartDataa);
const chartOptions = reactive(chartOptionss);
const barChartDataa = reactive(barChartData);
const barChartOptionss = reactive(barChartOptions);

const getStatusColor = computed(() => {
  const statusColors = {
    "In Progress": "success",
    completed: "info",
    pending: "warning",
    cancelled: "error",
  };
  return statusColors[courseInfo.status as keyof typeof statusColors] || "grey";
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.objective-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-left: 4px solid #6366f1;
}

.outcome-card {
  background-color: white;
  border-radius: 12px;
}

.chart-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
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
</style>
