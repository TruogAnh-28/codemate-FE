<template>
  <v-layout class="bg-gray-50 min-h-screen">
    <v-main class="px-6 py-8">
    <!-- <div class="p-6 space-y-8 bg-gray-50"> -->
      <div class="flex space-x-6">
        <div class="flex flex-col space-y-6 w-1/2">
          <WelcomeCardProfessor />
          <FeedbackCard @open-feedback="openFeedback" type="system" />
        </div>
        <UpcomingEvents
          v-if="dashboardData"
          :events="dashboardData.upcoming_events || []"
        />
      </div>
        <StatisticProfessor
          v-if="dashboardData"
          :dashboardData="dashboardData"
        />
    <!-- </div> -->
  </v-main>
  </v-layout>
</template>
  
<script setup lang="ts">
import { dashboardService } from "@/services/Professor/DashboardServices";
import {GetDashboardProfessorResponse} from "@/types/Dashboard";

const dashboardData = ref<GetDashboardProfessorResponse>()

const showFeedbackDialog = ref(false);
const openFeedback = () => {
    showFeedbackDialog.value = true;
};
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;  

const fetchDashboardData = async () => {
    const response = await dashboardService.fetchDashboardProfessor({ showError, showSuccess });
    if (response && "data" in response && response.data) {
        dashboardData.value = response.data as GetDashboardProfessorResponse;
    }
};
onMounted(() => {
    fetchDashboardData();
});

</script>
  