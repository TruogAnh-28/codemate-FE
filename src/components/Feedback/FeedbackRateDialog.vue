<template>
  <v-dialog v-model="dialogVisible" max-width="700px" content-class="feedback-dialog">
    <v-card elevation="5">
      <v-app-bar flat color="primary" dark>
        <v-toolbar-title
          v-if="selectedRatingFilter !== null"
          class="text-h6 font-weight-medium"
        >
          {{ ratingTitleMap[selectedRatingFilter] }} Rated Feedback
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-card-text class="pa-0">
        <v-container v-if="filteredFeedbackList.length === 0" class="text-center py-12">
          <v-icon size="64" color="grey lighten-1">mdi-message-text-outline</v-icon>
          <div class="text-subtitle-1 grey--text text--darken-1 mt-4">
            No feedback available for this rating category
          </div>
        </v-container>

        <v-list v-else two-line>
          <div v-for="(feedback, index) in filteredFeedbackList" :key="feedback.id">
            <v-list-item @click="showFeedbackDetails(feedback)">
              <v-list-item-avatar>
                <v-avatar :color="getRatingColor(feedback.rate)" class="white--text">
                  {{ feedback.rate }}
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">{{
                  feedback.title
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  Submitted on {{ formatDate(feedback.created_at) }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider v-if="index < filteredFeedbackList.length - 1"></v-divider>
          </div>
        </v-list>
      </v-card-text>

      <v-card-actions v-if="filteredFeedbackList.length > 0" class="px-4 pb-4">
        <v-btn variant="text" color="primary" @click="exportFeedback">
          <v-icon left>mdi-export</v-icon>
          Export
        </v-btn>
        <v-spacer></v-spacer>
        <v-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :length="totalPages"
          color="primary"
          @input="changePage"
        ></v-pagination>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { GetListFeedbackResponse } from "@/types/Feedback";

// Props
const props = defineProps<{
  feedbackList: GetListFeedbackResponse[];
  dialog?: boolean;
  initialFilter?: "high" | "medium" | "low" | null;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:dialog", value: boolean): void;
  (e: "export", feedbackList: GetListFeedbackResponse[]): void;
}>();

// Reactive state
const dialogVisible = ref(false);
const selectedRatingFilter = ref<"high" | "medium" | "low" | null>(null);
const currentPage = ref(1);
const itemsPerPage = 5;

// Initialize with props
dialogVisible.value = props.dialog || false;
selectedRatingFilter.value = props.initialFilter || null;

// Watch for changes from parent
watch(
  () => props.dialog,
  (newVal) => {
    if (newVal !== undefined) {
      dialogVisible.value = newVal;
    }
  }
);

watch(
  () => props.initialFilter,
  (newVal) => {
    if (newVal !== undefined) {
      selectedRatingFilter.value = newVal;
      currentPage.value = 1; // Reset page when filter changes
    }
  }
);

// Also watch for local changes to emit updates
watch(dialogVisible, (newVal) => {
  emit("update:dialog", newVal);
});
// Constants
const ratingTitleMap = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

// Computed properties
const filteredFeedbackList = computed(() => {
  const filtered = props.feedbackList.filter((item) => {
    if (selectedRatingFilter.value === "high") return item.rate >= 4;
    if (selectedRatingFilter.value === "medium") return item.rate >= 2 && item.rate < 4;
    if (selectedRatingFilter.value === "low") return item.rate < 2;
    return true;
  });

  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  const filtered = props.feedbackList.filter((item) => {
    if (selectedRatingFilter.value === "high") return item.rate >= 4;
    if (selectedRatingFilter.value === "medium") return item.rate >= 2 && item.rate < 4;
    if (selectedRatingFilter.value === "low") return item.rate < 2;
    return true;
  });

  return Math.ceil(filtered.length / itemsPerPage);
});

// Methods
function closeDialog() {
  dialogVisible.value = false;
  selectedRatingFilter.value = null;
  currentPage.value = 1;
  emit("update:dialog", false);
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getRatingColor(rating: number): string {
  if (rating >= 4) return "success";
  if (rating >= 2) return "warning";
  return "error";
}

function showFeedbackDetails(feedback: GetListFeedbackResponse): void {
  // Implement to show detailed feedback view
  console.log("Show details for feedback:", feedback);
}

function changePage(page: number): void {
  currentPage.value = page;
}

function exportFeedback(): void {
  emit("export", filteredFeedbackList.value);
}
</script>

<style scoped>
.feedback-dialog {
  border-radius: 8px;
}
</style>
