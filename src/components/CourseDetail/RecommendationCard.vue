<!-- RecommendationCard.vue -->
<template>
  <v-card class="rounded-lg">
    <v-card-text class="text-center pa-6">
      <v-avatar size="80" class="mb-4">
        <CheckCircle />
      </v-avatar>

      <h3 class="text-heading-4 font-weight-bold mb-2">
        {{
          hasLearningPath
            ? "Update Your Learning Path"
            : "Join our Recommended Learning"
        }}
      </h3>
      <p class="text-body-2 text-text-tetiary mb-4">
        {{
          hasLearningPath
            ? "You already have a learning path. Create a new one with a different goal?"
            : "Get personalized course recommendations based on your goals and interests."
        }}
      </p>
      <v-tooltip top>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            color="text-primary"
            variant="text"
            @click="handleClick"
            class="text-body-base-4"
            v-bind="activatorProps"
          >
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </template>
        <span>{{
          hasLearningPath ? "Create New Learning Path" : "Get Recommendations"
        }}</span>
      </v-tooltip>
    </v-card-text>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="500" persistent>
      <v-card class="rounded-xl border-card" elevation="3">
        <!-- Header with title and close button -->
        <div class="card-header pa-6 d-flex align-center">
          <v-icon color="primary" size="x-large" class="mr-4"
            >mdi-alert-circle-outline</v-icon
          >
          <div>
            <h2 class="text-h5 font-weight-bold">
              Confirm Learning Path Change
            </h2>
            <p class="text-subtitle-2 text-medium-emphasis mb-0">
              Please confirm your action
            </p>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            density="comfortable"
            @click="showConfirmDialog = false"
          ></v-btn>
        </div>

        <v-divider></v-divider>

        <!-- Content -->
        <v-card-text class="pa-6">
          <p class="text-body-1 text-medium-emphasis">
            Are you sure you want to create a new learning path? This will
            replace your current learning path entirely.
          </p>
        </v-card-text>

        <!-- Action buttons -->
        <v-card-actions class="d-flex justify-end pa-6">
          <v-btn
            variant="outlined"
            class="rounded-lg mr-4"
            @click="showConfirmDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            class="rounded-lg"
            @click="confirmNewPath"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import CheckCircle from "@/assets/icons/check-circle.vue";
import { ref } from "vue";

const props = defineProps<{
  hasLearningPath: boolean;
}>();

const emit = defineEmits<{
  (e: "open-recommendation"): void;
  (e: "open-course-recommendations"): void;
  (e: "create-new-path"): void;
}>();

const showConfirmDialog = ref(false);

const handleClick = () => {
  if (props.hasLearningPath) {
    showConfirmDialog.value = true;
  } else {
    emit("open-recommendation");
  }
};

const confirmNewPath = () => {
  showConfirmDialog.value = false;
  emit("create-new-path");
};
</script>
