<template>
  <v-dialog
    v-model="localShow"
    max-width="600px"
    persistent
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-lg shadow-xl bg-on-primary transform transition-all">
      <v-card-title class="text-heading-4 font-semibold">
        <div class="text-center">
          Learning Outcomes
        </div>
        <div class="text-center font-medium mt-2">{{ nameCourse }}</div>
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
  },
  nameCourse: {
    type: String,
    required: true
  }
});

const localShow = ref(props.show);

watch(
  () => props.show,
  (newVal: boolean) => {
    localShow.value = newVal;
  }
);

const emit = defineEmits();

const closeModal = () => {
  localShow.value = false;
  emit('update:show', false);
};
</script>

<style scoped>
.v-dialog .v-card {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.v-dialog .v-card-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.v-card-title .font-medium {
  font-weight: 600;
  margin-top: 0.5rem;
}

.v-card-text {
  padding: 24px;
}

.v-btn {
  margin-top: 1rem;
}

.v-dialog .v-card {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  animation: fadeInUp 0.5s ease-out;
}
</style>
