<template>
  <v-dialog v-model="internalDialog" max-width="500" class="rounded-lg">
    <div class="bg-white p-6 rounded-lg">
      <div class="p-2 rounded-full">
        <CheckCircle />
      </div>
      <h3 class="text-heading-4 font-bold mb-4">Tell Us About Your Goals</h3>
      <p class="text-text-tetiary text-body-small-3 mb-6">
        Help us understand your learning goals so we can recommend the best
        lessons for you.
      </p>
      <v-alert
        v-if="learningGoal.length > 200"
        type="error"
        class="mb-4"
        border="start"
      >
        Please enter a learning goal that is less than 200 characters.
      </v-alert>
      <v-textarea
        v-model="learningGoal"
        label="What is your main learning goal?"
        placeholder="E.g., Master data analysis, Become proficient in machine learning..."
        class="mb-6 rounded-lg border-2 text-body-base-4 border-gray-300 focus:border-primary-500 focus:ring-0"
        hide-details
        rows="3"
        maxlength="200"
      />
      <div class="flex justify-end">
        <v-btn
          variant="text"
          class="text-text-tetiary mr-4 hover:text-text-tetiary text-body-base-4"
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          class="rounded-lg bg-on-background text-text-secondary text-body-base-4"
          :disabled="learningGoal.length > 200"
          @click="submitGoal"
        >
          Get Recommendations
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts" setup>
import CheckCircle from "@/assets/icons/check-circle.vue";

const props = defineProps<{ dialog: boolean }>();
const emit = defineEmits<{
  (e: "update:dialog", value: boolean): void;
  (e: "submitGoal", value: string): void;
}>();

const internalDialog = ref(props.dialog);
const learningGoal = ref("");
watch(
  () => props.dialog,
  (newVal: boolean) => {
    internalDialog.value = newVal;
  }
);

watch(internalDialog, (newVal: boolean) => {
  emit("update:dialog", newVal);
});
const cancel = () => {
  internalDialog.value = false;
};

const submitGoal = () => {
  if (learningGoal.value.length <= 200) {
    emit("submitGoal", learningGoal.value);
    internalDialog.value = false;
  }
};
</script>

<style scoped>

</style>
