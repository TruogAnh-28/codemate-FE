<template>
  <v-layout>
    <v-container fluid class="px-6">
      <!-- Title Section with Animation -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold mb-2 animate-fade-in gradient-text">Dashboard Overview</h1>
        <p class="text-gray-500 dark:text-gray-400">Welcome to your admin dashboard</p>
      </div>

      <!-- Web Vitals Section -->
      <v-row>
        <v-col cols="12">
          <WebVitals />
        </v-col>
      </v-row>

      <!-- Stats Cards -->
      <v-row justify="center" align="stretch" class="mb-8">
        <v-col cols="12" md="6" lg="4" class="d-flex">
          <SumCard
            title="Total Users"
            :content="totalUsers_"
            :iconComponent="totalUsers"
            growth="8.5"
            color="primary"
            icon-bg="bg-primary"
          />
        </v-col>
        <v-col cols="12" md="6" lg="4" class="d-flex">
          <SumCard
            title="Total Courses"
            :content="totalCourses_"
            :iconComponent="totalCourses"
            growth="8.5"
            color="secondary"
            icon-bg="bg-secondary"
          />
        </v-col>
        <!-- <v-col cols="12" md="6" lg="4" class="d-flex">
          <SumCard
            title="Active Sessions"
            :content="2456"
            :iconComponent="{ name: 'mdi-account-clock' }"
            growth="12.3"
            color="success"
            icon-bg="bg-success"
          />
        </v-col> -->
      </v-row>

      <!-- Charts Section -->
      <v-row class="mb-8">
        <v-col cols="12" lg="8">
          <SparklineChart />
        </v-col>
        <!-- <v-col cols="12" lg="4">
          <v-card class="h-100">
            <v-card-title class="d-flex align-center justify-space-between pa-4">
              <span class="text-h6">Quick Stats</span>
              <v-btn icon variant="text">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(stat, index) in quickStats" :key="index">
                  <v-list-item-title class="d-flex justify-space-between align-center">
                    <span>{{ stat.label }}</span>
                    <span class="font-weight-bold" :class="stat.color">{{
                      stat.value
                    }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col> -->
      </v-row>
    </v-container>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usersService } from "@/services/usersServices";
import { coursesService } from "../../services/courseslistServices";
import totalCourses from "@/assets/adminDashboard/totalCourses.vue";
import totalUsers from "@/assets/adminDashboard/totalUsers.vue";

const totalUsers_ = ref<number>(0);
const totalCourses_ = ref<number>(0);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const quickStats = ref([
  { label: "New Users Today", value: "125", color: "text-primary" },
  { label: "Course Completion Rate", value: "67%", color: "text-success" },
  { label: "Average Session Duration", value: "24m", color: "text-info" },
  { label: "Support Tickets", value: "12", color: "text-warning" },
]);

const fetch_totalCourses = async () => {
  const response = await coursesService.countCourses({ showError, showSuccess });
  if ("data" in response && response.data) {
    totalCourses_.value = response.data;
  }
};

const fetch_totalUsers = async () => {
  const response = await usersService.countUsers({ showError, showSuccess });
  if ("data" in response && response.data) {
    totalUsers_.value = response.data;
  }
};

onMounted(() => {
  fetch_totalCourses();
  fetch_totalUsers();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom transitions */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}
</style>
