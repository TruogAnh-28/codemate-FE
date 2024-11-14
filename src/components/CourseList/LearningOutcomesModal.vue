<template>
  <v-dialog
    :value="show"
    @update:value="updateShow"
    max-width="600px"
    persistent
    scrollable
  >
    <v-card class="rounded-lg shadow-xl bg-white">
      <!-- Header -->
      <v-card-title class="text-heading-4 font-semibold">
        Learning Outcomes
      </v-card-title>

      <!-- Body -->
      <v-card-text class="p-6 max-h-[60vh] overflow-y-auto">
        <ul class="list-disc pl-6 space-y-2">
          <li
            v-for="(outcome, index) in outcomes"
            :key="index"
            class="text-sm text-text-tetiary"
          >
            {{ outcome }}
          </li>
        </ul>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions class="justify-end">
        <v-btn
          @click="closeModal"
          color="primary"
          class="text-on-primary"
          variant="outlined"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  show: Boolean,
  outcomes: Array,
});

const emit = defineEmits();

// Close the modal
const closeModal = () => {
  emit("update:show", false); // Emit the updated state back to the parent
};

// Update the show state when the dialog changes
const updateShow = (value: boolean) => {
  emit("update:show", value); // Sync state with the parent component
};
</script>
