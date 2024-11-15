<template>
  <v-dialog
    v-model="localShow"
    max-width="600px"
    persistent
    scrollable
  >
    <v-card class="rounded-lg shadow-xl bg-white">
      <v-card-title class="text-heading-4 font-semibold">
        Learning Outcomes
      </v-card-title>

      <v-card-text class="p-6 max-h-[60vh] overflow-y-auto">
        <ul class="list-disc pl-6 space-y-2">
          <li
            v-for="(outcome, index) in outcomes"
            :key="index"
            class="text-body-base-1 text-text-tetiary"
          >
            {{ outcome }}
          </li>
        </ul>
      </v-card-text>

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
  show: {
    type: Boolean,
    required: true
  },
  outcomes: {
    type: Array,
    required: true
  }
});

// Local state to track modal visibility
const localShow = ref(props.show);

// Watch the "show" prop to update localShow when it's changed
watch(
  () => props.show,
  (newVal: boolean) => {
    console.log('Modal visibility changed:', newVal); // Log changes for debugging
    localShow.value = newVal;
  }
);

// Emit the update:show event when the modal is closed
const emit = defineEmits();

const closeModal = () => {
  localShow.value = false;
  emit('update:show', false); // Notify the parent component to close the modal
};

// const updateShow = (value: boolean) => {
//   localShow.value = value;
//   emit('update:show', value); // Emit the updated visibility value
// };
</script>

<style scoped>
/* Scoped styles for the modal (if needed) */
</style>
