<template>
  <div class="learning-outcomes">
    <p class="text-body-large-4 text-text-primary font-sans font-bold mb-2">
      Learning Outcomes:
    </p>

    <!-- List the displayed outcomes -->
    <ul class="mx-auto" :class="{ 'dense': outcomes.length <= maxDisplay }">
      <li v-for="(outcome, index) in displayedOutcomes" :key="index" class="mb-1 line-clamp-1">
        {{ outcome }}
      </li>
    </ul>

    <!-- Button to view more if outcomes exceed maxDisplay -->
    <div class="flex justify-end mt-2" v-if="outcomes.length > maxDisplay">
      <button
        @click="openModal"
        class="text-body-small-1 text-text-teriary hover:underline"
      >
        View more
      </button>
    </div>

    <!-- Modal Component (conditionally rendered) -->
    <LearningOutcomesModal
      v-if="isModalOpen"
      :show="isModalOpen"
      @update:show="isModalOpen = $event"
      :outcomes="outcomes"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import LearningOutcomesModal from './LearningOutcomesModal.vue';

// Props and state variables
const props = defineProps({
  outcomes: {
    type: Array,
    required: true
  }
});

const maxDisplay = 2; // Max outcomes to display before showing the "View more" button
const isModalOpen = ref(false);

// Displayed outcomes (slice first maxDisplay outcomes)
const displayedOutcomes = computed(() => props.outcomes.slice(0, maxDisplay));

// Open the modal (set isModalOpen to true)
const openModal = () => {
  console.log('open modal');
  isModalOpen.value = true;
};
</script>

<style scoped>
.dense {
  padding: 0;
  list-style-type: none;
}
</style>
