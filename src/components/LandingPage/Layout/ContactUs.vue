<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-card-title class="bg-primary text-white pa-4">
        <h2 class="text-h4">Contact Us</h2>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="contact-us-content">
          <!-- Introduction Section -->
          <div class="text-center mb-8">
            <h3 class="text-h5 font-weight-bold text-primary mb-4">
              We'd Love to Hear From You
            </h3>
            <p class="text-body-1 text-grey-darken-1 max-w-lg mx-auto">
              Whether you have a question about our features, pricing, need a demo, or
              anything else, our team is ready to answer all your questions.
            </p>
          </div>

          <v-row>
            <!-- Contact Form -->
            <v-col cols="12" md="7">
              <v-card class="pa-4 mb-4" variant="outlined">
                <v-card-title class="px-0">
                  <v-icon color="primary" class="mr-2">mdi-email-outline</v-icon>
                  Send us a message
                </v-card-title>

                <v-form
                  ref="form"
                  v-model="valid"
                  @submit.prevent="submitForm"
                  class="mt-4"
                >
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.firstName"
                        label="First Name"
                        :rules="nameRules"
                        required
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.lastName"
                        label="Last Name"
                        :rules="nameRules"
                        required
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model="formData.email"
                    label="Email"
                    :rules="emailRules"
                    required
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  ></v-text-field>

                  <v-select
                    v-model="formData.subject"
                    :items="subjectOptions"
                    label="Subject"
                    required
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  ></v-select>

                  <v-textarea
                    v-model="formData.message"
                    label="Message"
                    :rules="messageRules"
                    required
                    variant="outlined"
                    auto-grow
                    rows="4"
                    class="mb-3"
                  ></v-textarea>

                  <v-checkbox
                    v-model="formData.terms"
                    :rules="[(v) => !!v || 'You must agree to continue']"
                    label="I agree to receive communications from CodeMate"
                    required
                    class="mb-3"
                  ></v-checkbox>

                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="loading"
                    :disabled="!valid"
                    block
                    class="mt-2"
                    size="large"
                  >
                    Send Message
                  </v-btn>
                </v-form>
              </v-card>
            </v-col>

            <!-- Contact Information -->
            <v-col cols="12" md="5">
              <v-card class="bg-primary text-white pa-4 mb-4 h-100">
                <v-card-title class="px-0">
                  <v-icon class="mr-2">mdi-information-outline</v-icon>
                  Contact Information
                </v-card-title>

                <v-list class="bg-transparent pa-0" nav>
                  <v-list-item class="px-0 py-4">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-map-marker" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold"
                      >Address</v-list-item-title
                    >
                    <v-list-item-subtitle class="mt-1"
                      >123 Innovation Street, Ho Chi Minh City,
                      Vietnam</v-list-item-subtitle
                    >
                  </v-list-item>

                  <v-divider class="my-2" color="white" opacity="0.3"></v-divider>

                  <v-list-item class="px-0 py-4">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-phone" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">Phone</v-list-item-title>
                    <v-list-item-subtitle class="mt-1"
                      >+84 28 1234 5678</v-list-item-subtitle
                    >
                  </v-list-item>

                  <v-divider class="my-2" color="white" opacity="0.3"></v-divider>

                  <v-list-item class="px-0 py-4">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-email" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">Email</v-list-item-title>
                    <v-list-item-subtitle class="mt-1"
                      >group6.gr2003@gmail.com</v-list-item-subtitle
                    >
                  </v-list-item>

                  <v-divider class="my-2" color="white" opacity="0.3"></v-divider>

                  <v-list-item class="px-0 py-4">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-clock-outline" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold"
                      >Working Hours</v-list-item-title
                    >
                    <v-list-item-subtitle class="mt-1"
                      >Monday - Friday: 9:00 AM - 6:00 PM</v-list-item-subtitle
                    >
                  </v-list-item>
                </v-list>

                <v-card-actions class="justify-start pa-0 mt-6">
                  <v-btn icon variant="text" class="mr-2">
                    <v-icon>mdi-facebook</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" class="mr-2">
                    <v-icon>mdi-twitter</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" class="mr-2">
                    <v-icon>mdi-linkedin</v-icon>
                  </v-btn>
                  <v-btn icon variant="text">
                    <v-icon>mdi-instagram</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <!-- FAQ Section -->
          <div class="mt-10">
            <h3 class="text-h5 font-weight-bold text-primary mb-6 text-center">
              Frequently Asked Questions
            </h3>

            <v-expansion-panels variant="accordion" class="mb-4">
              <v-expansion-panel v-for="(faq, index) in faqs" :key="index" class="mb-2">
                <v-expansion-panel-title>
                  <div class="font-weight-bold">{{ faq.question }}</div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  {{ faq.answer }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <div class="text-center mt-6">
              <p class="text-body-1 mb-4">Still have questions?</p>
              <v-btn color="secondary" variant="outlined" @click="openFAQs" class="px-6">
                View All FAQs
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="closeDialog" class="px-6">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-success text-white pa-4"> Message Sent! </v-card-title>
        <v-card-text class="pa-4 text-center">
          <v-icon color="success" size="64" class="my-4">mdi-check-circle</v-icon>
          <h3 class="text-h6 mb-2">Thank You for Contacting Us!</h3>
          <p class="text-body-1">
            We've received your message and will get back to you as soon as possible.
          </p>
        </v-card-text>
        <v-card-actions class="justify-center pa-4">
          <v-btn color="primary" @click="successDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";

const dialog = ref(true);
const emit = defineEmits(["close", "openFAQs"]);
const valid = ref(false);
const form = ref(null);
const loading = ref(false);
const successDialog = ref(false);

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
  terms: false,
});

const nameRules = [
  (v: string) => !!v || "Name is required",
  (v: string) => v.length <= 50 || "Name must be less than 50 characters",
];

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const messageRules = [
  (v: string) => !!v || "Message is required",
  (v: string) => v.length >= 10 || "Message must be at least 10 characters",
];

const subjectOptions = [
  "General Inquiry",
  "Technical Support",
  "Billing & Payments",
  "Partnership Opportunities",
  "Feedback",
];

const faqs = [
  {
    question: "How do I get started with CodeMate?",
    answer:
      "Simply sign up for an account, choose your learning path, and start your programming journey. Our guided onboarding will help you get set up quickly.",
  },
  {
    question: "Is CodeMate suitable for beginners?",
    answer:
      "Absolutely! We offer a range of courses from beginner to advanced levels. Our personalized learning paths adapt to your skill level and learning pace.",
  },
  {
    question: "What programming languages do you support?",
    answer:
      "We currently support Python, JavaScript, Java, C++, and Ruby, with more languages being added regularly based on user demand.",
  },
];

const submitForm = async () => {
  if (!valid.value) return;

  loading.value = true;

  // Simulate form submission with a delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  loading.value = false;
  successDialog.value = true;

  // Reset form after submission
  if (form.value) {
    form.value = null;
  }
};

const closeDialog = () => {
  dialog.value = false;
  emit("close");
};

const openFAQs = () => {
  emit("openFAQs");
  dialog.value = false;
};
</script>

<style scoped>
.contact-info-item {
  margin-bottom: 20px;
}

.v-list-item--density-default {
  min-height: auto;
}
</style>
