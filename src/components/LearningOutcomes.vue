<template>
  <div class="learning-outcomes">
    <p class="text-sm text-text-primary font-sans font-bold mb-2">
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
    <v-btn
      v-if="outcomes.length > maxDisplay"
      variant="text"
      size="small"
      @click="openModal"
      class="text-xxs text-text-teriary hover:underline"
    >
      View more
    </v-btn>

    <LearningOutcomesModal
      v-model:show="isModalOpen"
      :outcomes="outcomes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LearningOutcomesModal from '@/modals/LearningOutcomesModal.vue';

const props = defineProps<{
  outcomes: string[]
}>();

const maxDisplay = 2;
const isModalOpen = ref(false);

const displayedOutcomes = computed(() =>
  props.outcomes.slice(0, maxDisplay)
);

const openModal = () => {
  isModalOpen.value = true;
};
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LearningOutcomes'
});
</script>
