<template>
  <v-layout>
    <v-container
      fluid
      class="px-6 py-8"
      :style="{ background: 'hsl(var(--background))' }"
    >
      <!-- Title Section with Animation -->
      <div class="mb-8">
        <h1
          class="text-3xl font-bold mb-2 animate-fade-in gradient-text"
          :style="{ color: 'hsl(var(--text-primary))' }"
        >
          Dashboard Overview
        </h1>
        <p :style="{ color: 'hsl(var(--text-tetiary))' }">
          Welcome to your admin dashboard
        </p>
      </div>

      <!-- Web Vitals Section -->
      <v-row>
        <v-col cols="12">
          <WebVitals />
        </v-col>
      </v-row>

      <!-- Stats Cards -->
      <v-row justify="center" align="stretch" class="mb-10">
        <v-col cols="12" md="6" lg="4" class="d-flex">
          <SumCard
            title="Total Users"
            :content="totalUsers_"
            :iconComponent="totalUsers"
            growth="8.5"
            :color="`hsl(var(--primary))`"
            icon-bg="bg-gradient-primary"
          />
        </v-col>
        <v-col cols="12" md="6" lg="4" class="d-flex">
          <SumCard
            title="Total Courses"
            :content="totalCourses_"
            :iconComponent="totalCourses"
            growth="8.5"
            :color="`hsl(var(--secondary))`"
            icon-bg="bg-gradient-secondary"
          />
        </v-col>
      </v-row>

      <!-- Charts Section -->
      <v-row class="mb-10">
        <v-col cols="12" lg="12">
          <SparklineChart />
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<style scoped>
/* Animation for fade-in */
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

/* Gradient text styling */
.gradient-text {
  background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* Custom gradient backgrounds for icons */
.bg-gradient-primary {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-variant)));
}

.bg-gradient-secondary {
  background: linear-gradient(
    135deg,
    hsl(var(--secondary)),
    hsl(var(--secondary-variant))
  );
}
</style>

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
