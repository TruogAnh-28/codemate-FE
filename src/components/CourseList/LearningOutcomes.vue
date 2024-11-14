<template>
  <div class="learning-outcomes">
    <p class="text-body-large-4 text-text-primary font-sans font-bold mb-2">
      Learning Outcomes:
    </p>
    <v-list class="mx-auto" dense tile>
      <v-list-item
        v-for="(outcome, index) in displayedOutcomes"
        :key="index"
        class="mb-1 line-clamp-1"
      >
        <v-list-item-content>
          <v-list-item-title>{{ outcome }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- View More Button Aligned to the Right using Tailwind CSS -->
    <div class="flex justify-end mt-2">
      <v-btn
        v-if="outcomes.length > maxDisplay"
        variant="text"
        size="small"
        @click="openModal"
        class="text-body-xs-1 text-text-teriary hover:underline"
      >
        View more
      </v-btn>
    </div>

    <!-- Modal Component -->
    <LearningOutcomesModal
      :show="isModalOpen"
      @update:show="isModalOpen = $event"
      :outcomes="outcomes"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ outcomes: string[] }>();

const maxDisplay = 2;
const isModalOpen = ref(false);

// Calculate the outcomes to be displayed initially
const displayedOutcomes = computed(() => props.outcomes.slice(0, maxDisplay));

// Open the modal
const openModal = () => {
  isModalOpen.value = true;
};
</script>
