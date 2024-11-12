<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeModal"
    >
      <!-- Overlay -->
      <div
        class="fixed inset-0 bg-black "
      ></div>
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:max-w-lg w-full"
          @click.stop
        >
          <!-- Header -->
          <div class="border-b border-gray-200 p-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Learning Outcomes
            </h3>
          </div>

          <!-- Body -->
          <div class="p-6 max-h-[60vh] overflow-y-auto">
            <ul class="list-disc pl-6 space-y-2">
              <li
                v-for="(outcome, index) in outcomes"
                :key="index"
                class="text-sm text-gray-600"
              >
                {{ outcome }}
              </li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 p-4 flex justify-end">
            <button
              class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "LearningOutcomesModal",
  props: {
    show: Boolean,
    outcomes: Array as () => string[],
  },
  emits: ['update:show'],
  methods: {
    closeModal() {
      this.$emit('update:show', false);
    }
  }
});
</script>
