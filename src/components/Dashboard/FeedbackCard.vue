<template>
  <v-card
    class="system-feedback-card border-2 border-primary/10 hover:shadow-md transition-shadow"
    elevation="1"
  >
    <v-card-text class="p-4">
      <div class="flex items-center space-x-4">
        <v-icon color="primary" size="36" class="mt-1">mdi-cog-outline</v-icon>
        <div class="flex-grow">
          <div class="flex items-center justify-between">
            <p class="text-body-large-1 font-semibold text-gray-800">
              System Feedback
            </p>
            <v-chip
              color="primary"
              variant="outlined"
              size="small"
              class="text-xs"
            >
              Help Us Improve
            </v-chip>
          </div>
          <p class="text-gray-600 mt-1">
            Share your thoughts on our platform's functionality
          </p>
        </div>
      </div>
      <v-btn
        block
        class="mt-4 bg-secondary-variant text-white font-medium"
        elevation="2"
        @click="openSystemFeedbackModal"
      >
        Provide System Feedback
        <v-icon end icon="mdi-send" />
      </v-btn>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showSystemFeedbackModal" max-width="500">
    <v-card>
      <v-card-title class="text-h6 bg-primary/10 px-6 py-4">
        <v-icon color="primary" class="mr-3">mdi-cog-outline</v-icon>
        System Feedback
      </v-card-title>

      <v-card-text class="pt-6">
        <v-form @submit.prevent="submitSystemFeedback">
          <v-select
            v-model="feedbackCategory"
            :items="feedbackCategories"
            label="Feedback Category"
            variant="outlined"
            class="mb-4"
          />

          <v-textarea
            v-model="systemFeedbackText"
            label="Your Feedback"
            variant="outlined"
            rows="4"
            placeholder="What can we improve?"
            required
          />

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
        <v-btn variant="text" @click="showSystemFeedbackModal = false">
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn color="primary" variant="elevated" @click="submitSystemFeedback">
          Submit Feedback
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const showSystemFeedbackModal = ref(false);
const systemFeedbackText = ref("");
const feedbackCategory = ref("");
const allowContact = ref(false);

const feedbackCategories = [
  "User Interface",
  "Performance",
  "Feature Request",
  "Bug Report",
  "Other",
];

const openSystemFeedbackModal = () => {
  showSystemFeedbackModal.value = true;
};

const submitSystemFeedback = () => {
  // Implement feedback submission logic
  console.log({
    category: feedbackCategory.value,
    feedback: systemFeedbackText.value,
    allowContact: allowContact.value,
  });

  showSystemFeedbackModal.value = false;
  // Add success notification
};
defineEmits<{
  (e: "open-feedback"): void;
}>();
</script>
