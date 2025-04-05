import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { progressTrackingServices } from '@/services/ProgressTracking';
import { AuthConfig } from '@/services/authenServices';

export const useTimeSpentStore = defineStore('timeSpent', () => {
  // State
  const startTime = ref<number | null>(null);
  const endTime = ref<number | null>(null);
  const timeSpentInSeconds = ref<number>(0);
  const error = ref<string | null>(null);

  // Getters
  const formattedTimeSpent = computed(() => formatTime(timeSpentInSeconds.value));

  // Actions
  function formatTime(seconds: number): string {
    const roundedSeconds = Math.floor(seconds);
    
    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const sec = roundedSeconds % 60;
    
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }
  

  function startTracking(): void {
    startTime.value = Date.now();
  }

  function stopTracking(): void {
    endTime.value = Date.now();
    calculateTimeSpent();
  }

  function calculateTimeSpent(): void {
    if (startTime.value && endTime.value) {
      const diff = endTime.value - startTime.value;
      timeSpentInSeconds.value = diff / 1000; // Convert milliseconds to seconds
    }
  }

  async function updateTimeSpent(
    options: AuthConfig,
    lessonId: string | number
  ): Promise<void> {
    const { showError, showSuccess } = options;
    
    try {
      const response = await progressTrackingServices.updateTimeSpent(
        { showError, showSuccess },
        String(lessonId),
        formattedTimeSpent.value
      );
      
      if (response && "data" in response && response.data) {
        console.log("Time spent updated successfully:", response.data);
        if (showSuccess) {
          showSuccess("Time spent updated successfully.");
        }
      } else {
        showError("Failed to update time spent.");
        throw new Error("No response data received from the server.");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to update time spent.";
      showError(error.value);
    }
  }

  function resetTracking(): void {
    startTime.value = null;
    endTime.value = null;
    timeSpentInSeconds.value = 0;
    error.value = null;
  }

  return {
    // State
    startTime,
    endTime,
    timeSpentInSeconds,
    error,
    
    // Getters
    formattedTimeSpent,
    
    // Actions
    startTracking,
    stopTracking,
    calculateTimeSpent,
    updateTimeSpent,
    resetTracking
  };
});