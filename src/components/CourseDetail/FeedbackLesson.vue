<template>
  <v-dialog v-model="dialogModel" persistent max-width="500px">
    <v-card class="rounded-lg shadow-lg border border-border bg-surface">
      <v-card-title class="text-heading-4 font-semibold text-primary py-6">Provide Feedback</v-card-title>
      <v-card-text class="space-y-4">
        <v-textarea
          v-model="feedback"
          label="Your Feedback"
          outlined
          rows="4"
          placeholder="Write your feedback here..."
          class="border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary p-3"
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="flex justify-end gap-4 p-4">
        <v-btn
          variant="text"
          @click="closeModal"
          class="text-secondary-variant hover:text-primary transition-colors duration-200"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          @click="submitFeedback"
          class="text-primary-variant hover:bg-primary hover:text-on-primary transition-colors duration-200"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  lessonId: {
    type: String,
    required: false,
    default: null
  },
  showModal: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:showModal', 'feedback-submitted']);

const feedback = ref('');

const dialogModel = computed({
  get: () => props.showModal,
  set: (value: boolean) => emit('update:showModal', value)
});

const closeModal = () => {
  feedback.value = '';
  emit('update:showModal', false);
};

const submitFeedback = () => {
  if (feedback.value.trim()) {
    emit('feedback-submitted', {
      lessonId: props.lessonId,
      feedback: feedback.value
    });
    feedback.value = '';
  } else {
    alert('Please provide some feedback before submitting.');
  }
};
</script>
