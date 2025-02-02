<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <WebVitals />
      </v-col>
    </v-row>

    <v-row justify="center" align="stretch">
      <v-col cols="12" md="5" class="d-flex flex-grow-1">
        <SumCard
          title="Total Users"
          :content="totalUsers_"
          :iconComponent="totalUsers"
          growth="8.5"
        />
      </v-col>
      <v-col cols="12" md="5" class="d-flex flex-grow-1">
        <SumCard
          title="Total Courses"
          :content="totalCourses_"
          :iconComponent="totalCourses"
          growth="8.5"
        />
      </v-col>
    </v-row>
    <v-row>
      <SparklineChart />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { usersService } from "@/services/usersServices";
import totalCourses from "../../assets/adminDashboard/totalCourses.vue";
import totalUsers from "../../assets/adminDashboard/totalUsers.vue";
import { coursesService } from "../../services/courseslistServices";
const totalUsers_ = ref<number>(0);
const totalCourses_ = ref<number>(0);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
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

<style scoped></style>
