<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <!-- Header với icon và nút đóng -->
      <v-card-title class="d-flex align-center">
        <v-icon color="green" class="mr-2">mdi-check-circle</v-icon>
        <span class="text-h6">Select Your Preferred Learning Style</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Subtitle -->
      <v-card-subtitle class="text-body-2 mb-4">
        Select the learning style that works best for you in this module
      </v-card-subtitle>

      <!-- Module Title -->
      <v-card-subtitle class="text-subtitle-1 font-weight-bold">
        Module: Check for type compatibility
      </v-card-subtitle>

      <!-- Options list -->
      <v-card-text>
        <v-radio-group v-model="selectedOption">
          <v-radio
            label="Interactive Quizzes (Rec: for Beginner to Intermediate)"
            value="quizzes"
          >
            <template #message>
              <div class="text-body-2">
                <strong>Purpose:</strong> Quick assessments to test knowledge retention.<br>
                <strong>Engagement:</strong> High, through direct Q&A interaction.
              </div>
            </template>
          </v-radio>
          <v-radio
            label="Hands-On Exercises (Rec: for Intermediate to Advanced)"
            value="exercises"
          >
            <template #message>
              <div class="text-body-2">
                <strong>Purpose:</strong> Practical application of skills in real-world scenarios.<br>
                <strong>Engagement:</strong> High, requiring active problem-solving.
              </div>
            </template>
          </v-radio>
          <v-radio
            label="Reading Materials (Rec: for All Levels)"
            value="reading"
          >
            <template #message>
              <div class="text-body-2">
                <strong>Purpose:</strong> Detailed theory and background information.<br>
                <strong>Engagement:</strong> Low, primarily passive reading.
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>

      <!-- Action Buttons -->
      <v-card-actions>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn color="black" dark @click="confirmSelection">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default defineComponent({
  name: 'DialogLearningType',
  props: {
    dialog: Boolean
  },
  emits: ['update:dialog', 'confirm'],
  setup(props: { dialog: boolean }, { emit }: { emit: (event: string, ...args: any[]) => void }) {
    const selectedOption = ref('');
    const closeDialog = () => {
      emit('update:dialog', false);
    };

    const confirmSelection = () => {
      emit('confirm', selectedOption.value);
      emit('update:dialog', false);
    };

    return {
      selectedOption,
      closeDialog,
      confirmSelection
    };
  }
});
</script>
<style scoped>
.v-radio {
  margin-top: 16px;
}
.v-card-title,
.v-card-subtitle {
  padding: 8px 16px;
}
.v-card-text {
  padding: 0 16px;
}
.v-card-actions {
  padding: 16px;
}
</style>
