<template>
  <div class="learning-outcomes" v-if="outcomes.length > 0">
    <p class="text-body-large-4 text-text-primary font-sans font-bold mb-2">
      Learning Outcomes:
    </p>

    <!-- List the displayed outcomes -->
    <ul class="mx-auto" :class="{ dense: outcomes.length <= maxDisplay }">
      <li
        v-for="(outcome, index) in displayedOutcomes"
        :key="index"
        class="mb-1 line-clamp-1"
      >
        {{ outcome }}
      </li>
    </ul>

    <!-- Button to view more if outcomes exceed maxDisplay -->
    <div class="flex justify-end mt-2" v-if="outcomes.length > maxDisplay">
      <button
        @click="openModal"
        class="text-body-small-1 text-text-tetiary hover:underline"
      >
        View more
      </button>
    </div>

    <!-- Modal Component -->
    <LearningOutcomesModal
      v-if="isModalOpen"
      :show="isModalOpen"
      @update:show="isModalOpen = $event"
      :outcomes="outcomes"
      :nameCourse="nameCourse"
    />
  </div>
  <div v-else>
    <p class="text-body-small-1">No learning outcomes available</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import LearningOutcomesModal from "./LearningOutcomesModal.vue";

const props = defineProps({
  outcomes: {
    type: Array,
    required: true,
  },
  nameCourse: {
    type: String,
    required: true,
  },
});

const maxDisplay = 2;
const isModalOpen = ref(false);

const displayedOutcomes = computed(() => props.outcomes.slice(0, maxDisplay));

const openModal = () => {
  isModalOpen.value = true;
};
</script>

<style scoped>
.dense {
  padding: 0;
  list-style-type: none;
}
</style>
