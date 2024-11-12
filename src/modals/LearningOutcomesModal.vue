<template>
  <v-dialog
    v-model="localShow"
    max-width="600px"
    persistent
    scrollable
  >
    <v-card class="rounded-lg shadow-xl bg-white">
      <!-- Header -->
      <v-card-title class="text-lg font-semibold">
        Learning Outcomes
      </v-card-title>

      <!-- Body -->
      <v-card-text class="p-6 max-h-[60vh] overflow-y-auto">
        <ul class="list-disc pl-6 space-y-2">
          <li
            v-for="(outcome, index) in outcomes"
            :key="index"
            class="text-sm text-gray-600"
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

<script lang="ts">
export default {
  name: 'LearningOutcomesModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    outcomes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      localShow: this.show,
    };
  },
  watch: {
    show(newVal) {
      this.localShow = newVal;
    },
    localShow(newVal) {
      this.$emit('update:show', newVal);
    },
  },
  methods: {
    closeModal() {
      this.localShow = false;
    },
  },
};
</script>
