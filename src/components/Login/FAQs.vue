<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="800"
    content-class="rounded-lg"
  >
    <v-card class="pa-4">
      <v-card-title
        class="d-flex align-center gap-2 text-heading-4 mb-6"
      >
        <v-icon icon="mdi-help-circle" color="secondary" size="32" />
        Frequently Asked Questions
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-expansion-panels
              v-model="expandedPanel"
              variant="accordion"
              class="bg-transparent"
            >
              <v-expansion-panel
                v-for="(faq, index) in faqs"
                :key="index"
                class="mb-4 rounded-lg border bg-on-primary hover:shadow-md transition-shadow duration-200"
                elevation="0"
              >
                <v-expansion-panel-title class="py-4">
                  <div class="d-flex align-center gap-3">
                    <v-icon :icon="faq.icon" color="primary" />
                    <span class="text-body-base-bold font-medium">{{
                      faq.question
                    }}</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text
                  class="text-body-base-regular text-secondary pl-12 pb-4"
                >
                  {{ faq.answer }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="mt-6 justify-end">
        <v-btn
          color="primary"
          size="large"
          variant="elevated"
          class="px-6 text-on-primary"
          @click="closeModal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
interface FAQ {
  question: string;
  answer: string;
  icon: string;
}
const expandedPanel = ref<number | null>(null);
const faqs: FAQ[] = [
  {
    question: "What is CodeMate?",
    answer:
      "CodeMate is an online learning platform designed to help you improve your coding skills through interactive exercises, guided learning paths, and personalized recommendations.",
    icon: "mdi-rocket-launch",
  },
  {
    question: "How does CodeMate work?",
    answer:
      "CodeMate provides structured learning paths with interactive coding exercises, quizzes, and AI-generated recommendations to help you progress at your own pace.",
    icon: "mdi-lightbulb",
  },
  {
    question: "Who is CodeMate for?",
    answer:
      "CodeMate is designed for educational institutions, corporate training programs, and individual learners looking to enhance their coding skills and track their progress effectively.",
    icon: "mdi-account-group",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our support team at group6.gr2003@gmail.com or through the Contact Us section on our website.",
    icon: "mdi-email",
  },
];
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});
const closeModal = () => {
  emit("update:modelValue", false);
};
</script>
