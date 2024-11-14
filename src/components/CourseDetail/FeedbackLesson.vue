<template>
  <v-dialog v-model="dialogModel" persistent max-width="500px">
    <v-card>
      <v-card-title class="headline">Provide Feedback</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="feedback"
          label="Your Feedback"
          outlined
          rows="4"
          placeholder="Write your feedback here..."
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="closeModal">Cancel</v-btn>
        <v-btn variant="text" @click="submitFeedback">Submit</v-btn>
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

// Use v-model with dialog
const dialogModel = computed({
  get: () => props.showModal,
  set: (value: boolean) => emit('update:showModal', value)
});

const closeModal = () => {
  feedback.value = ''; // Reset feedback
  emit('update:showModal', false);
};

const submitFeedback = () => {
  if (feedback.value.trim()) {
    emit('feedback-submitted', {
      lessonId: props.lessonId,
      feedback: feedback.value
    });
    feedback.value = ''; // Reset feedback after submission
  } else {
    alert('Please provide some feedback before submitting.');
  }
};
</script>
