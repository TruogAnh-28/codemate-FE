// src/stores/activityStore.ts
import { defineStore } from "pinia";
import { dashboardService } from "@/services/dashboardService";
import {
  RecentActivitiesResponse,
  AddActivityRequest,
} from "@/types/Dashboard";
import { reloadManager } from "@/modals/manager/reload";

// Define a key for reload events
const ACTIVITIES_RELOAD_KEY = "activities";
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
export const useActivityStore = defineStore("activity", {
  state: () => ({
    activities: [] as RecentActivitiesResponse[],
    isLoading: false,
    error: null as Error | null,
  }),

  actions: {
    // Load activities from API
    async fetchActivities(showNotifications = true) {
      this.isLoading = true;
      this.error = null;

      try {
        const activities = await dashboardService.fetchRecentActivities({
          showError,
          showSuccess,
        });

        this.activities = activities;
        return activities;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Add a new activity
    async addActivity(activity: AddActivityRequest, showNotifications = true) {
      this.isLoading = true;
      this.error = null;

      try {
        const success = await dashboardService.addActivity(
          { showError, showSuccess },
          activity
        );

        if (success) {
          // Trigger reload for any components listening for activity changes
          await reloadManager.trigger(ACTIVITIES_RELOAD_KEY);

          // Optionally refresh the activities list
          await this.fetchActivities(false);
        }

        return success;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Setup reload listener - call this in component setup or onMounted
    setupReloadListener(callback: () => Promise<void>) {
      reloadManager.on(ACTIVITIES_RELOAD_KEY, callback);

      // Return function to remove listener (for onUnmounted)
      return () => {
        reloadManager.off(ACTIVITIES_RELOAD_KEY, callback);
      };
    },
  },
});
