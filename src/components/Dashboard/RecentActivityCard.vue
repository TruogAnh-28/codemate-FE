<template>
  <v-card class="flex-1 rounded-lg overflow-hidden" elevation="2">
    <v-card-title class="py-4 px-6 bg-gray-50 border-b">
      <h3 class="text-body-large-1 font-semibold text-gray-800">
        Recent Activity
      </h3>
    </v-card-title>
    <v-list v-if="activities.length > 0" class="max-h-96 overflow-y-auto px-2">
      <ActivityItem
        v-for="activity in activities"
        :key="activity.activity_id"
        :icon="
          ACTIVITY_MAP[activity.activity_type]?.icon ||
          'mdi-information-outline'
        "
        :description="`${activity.activity_description}`"
        :timestamp="formatDateTime(activity.activity_date)"
        :iconColor="ACTIVITY_MAP[activity.activity_type]?.color || 'gray'"
      />
    </v-list>
    <v-card-text v-else class="p-6 text-center text-gray-500">
      You have no activities now
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reloadManager } from "@/modals/manager/reload";
import { dashboardService } from "@/services/dashboardService";
import { RecentActivitiesResponse } from "@/types/Dashboard";
import { formatDateTime } from "@/utils/functions/time";

const ACTIVITY_MAP: Record<
  string,
  {
    label: string;
    icon: string;
    color: string;
  }
> = {
  access_course: {
    label: "Accessed Course",
    icon: "mdi-account-plus",
    color: "yellow",
  },
  complete_lesson: {
    label: "Completed Lesson",
    icon: "mdi-checkbox-marked-circle",
    color: "success",
  },
  add_feedback: {
    label: "Added Feedback",
    icon: "mdi-comment-plus",
    color: "info",
  },
  access_recommend_lesson: {
    label: "Accessed Recommended Lesson",
    icon: "mdi-star-box-outline",
    color: "purple",
  },
  access_module: {
    label: "Accessed Module",
    icon: "mdi-folder-open",
    color: "primary",
  },
  do_quiz: {
    label: "Took Quiz",
    icon: "mdi-help-circle-outline",
    color: "accent",
  },
};

const activities = ref<RecentActivitiesResponse[]>([]);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const fetchRecentActivities = async () => {
  reloadManager.on("activities", async () => {
    const recentActivities = await dashboardService.fetchRecentActivities({
      showError,
      showSuccess,
    });
    if (
      recentActivities &&
      "data" in recentActivities &&
      recentActivities.data
    ) {
      activities.value = (recentActivities.data as RecentActivitiesResponse[]).slice(0, 4);
    }
  });
  await reloadManager.trigger("activities");
};
onMounted(() => {
  fetchRecentActivities();
});
</script>
