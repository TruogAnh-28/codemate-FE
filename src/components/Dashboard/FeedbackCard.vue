<template>
  <v-card
    class="feedback-card border-2 border-primary/10 hover:shadow-md transition-shadow"
    elevation="1"
  >
    <v-card-text class="p-4">
      <div class="flex items-center space-x-4">
        <v-icon :color="iconColor" size="36" class="mt-1">{{
          iconName
        }}</v-icon>
        <div class="flex-grow">
          <div class="flex items-center justify-between">
            <p class="text-body-large-1 font-semibold text-gray-800">
              {{ typeLabel }} Feedback
            </p>
            <v-chip
              :color="chipColor"
              variant="outlined"
              size="small"
              class="text-xs"
            >
              {{ chipText }}
            </v-chip>
          </div>
          <p class="text-gray-600 mt-1">
            {{ description }}
          </p>
        </div>
      </div>
      <v-btn
        block
        class="mt-4 bg-secondary-variant text-white font-medium"
        elevation="2"
        @click="openFeedbackModal"
      >
        Provide {{ typeLabel }} Feedback
        <v-icon end icon="mdi-send" />
      </v-btn>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showFeedbackModal" max-width="500">
    <v-card>
      <v-card-title class="text-h6 bg-primary/10 px-6 py-4">
        <v-icon :color="iconColor" class="mr-3">{{ iconName }}</v-icon>
        {{ typeLabel }} Feedback
      </v-card-title>

      <v-card-text class="pt-6">
        <v-form @submit.prevent="submitFeedback">
          <v-text-field
            v-model="feedbackTitle"
            label="Feedback Title"
            variant="outlined"
            class="mb-4"
            required
          />

          <v-select
            v-model="feedbackCategory"
            :items="feedbackCategories"
            label="Feedback Category"
            variant="outlined"
            class="mb-4"
          />

          <v-textarea
            v-model="feedbackText"
            label="Your Feedback"
            variant="outlined"
            rows="4"
            placeholder="What can we improve?"
            required
          />

          <div class="flex justify-center items-center my-4">
            <div class="flex space-x-2">
              <v-icon
                v-for="star in 5"
                :key="star"
                :color="
                  star <= feedbackRate ? 'yellow-darken-2' : 'grey-lighten-1'
                "
                @click="feedbackRate = star"
                class="cursor-pointer"
              >
                mdi-star
              </v-icon>
            </div>
          </div>

          <div class="flex items-center space-x-2 mt-2">
            <v-checkbox
              v-model="allowContact"
              label="Allow follow-up"
              color="primary"
            />
            <v-tooltip text="We might contact you for more details">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" color="gray" size="small">
                  mdi-help-circle-outline
                </v-icon>
              </template>
            </v-tooltip>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-btn variant="text" @click="showFeedbackModal = false">
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn color="primary" variant="elevated" @click="submitFeedback">
          Submit Feedback
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reloadManager } from "@/modals/manager/reload";
import { dashboardService } from "@/services/dashboardService";
import { feedbackServices } from "@/services/feedbackServices";
import { CreateFeedbackRequest } from "@/types/Feedback";
import { FeedbackCategory } from "@/utils/constant";
import { useAuthStore } from "@/stores/auth";

const role = computed(() => useAuthStore().getUser().role);
interface Props {
  type: "system" | "course";
}

const props = defineProps<Props>();

const showFeedbackModal = ref(false);
const feedbackTitle = ref("");
const feedbackText = ref("");
const feedbackCategory = ref<FeedbackCategory>();
const feedbackRate = ref(3);
const allowContact = ref(false);

const feedbackCategories = [
  "user_interface",
  "performance",
  "feature_request",
  "bug_report",
  "other",
];
const typeConfig = computed(() => {
  return props.type === "system"
    ? {
        iconName: "mdi-cog-outline",
        iconColor: "primary",
        chipColor: "primary",
        chipText: "Help Us Improve",
        description: "Share your thoughts on our platform's functionality",
        typeLabel: "System",
      }
    : {
        iconName: "mdi-book-open-outline",
        iconColor: "secondary",
        chipColor: "secondary",
        chipText: "Course Feedback",
        description: "Help us enhance your learning experience",
        typeLabel: "Course",
      };
});

const openFeedbackModal = () => {
  showFeedbackModal.value = true;
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const submitFeedback = async () => {
  const feedbackData: CreateFeedbackRequest = {
    type: props.type,
    title: feedbackTitle.value,
    category: feedbackCategory.value || "other",
    description: feedbackText.value,
    rate: feedbackRate.value,
    status: "pending",
  };

  const response = await feedbackServices.sendFeedback(
    { showError, showSuccess },
    feedbackData
  );
  if (response && role.value == "student") {
    const add_feedback = await dashboardService.addActivity(
      { showError, showSuccess },
      {
        type: "add_feedback",
        description: feedbackData.title,
      }
    );
    if (add_feedback) {
      await reloadManager.trigger('activities');
    }
  }
  showFeedbackModal.value = false;
};
const { iconName, iconColor, chipColor, chipText, description, typeLabel } =
  typeConfig.value;
defineEmits<{
  (e: "submit-feedback", payload: object): void;
  (e: "open-feedback"): void;
}>();
</script>
