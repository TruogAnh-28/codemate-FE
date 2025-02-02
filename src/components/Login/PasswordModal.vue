<template>
  <v-dialog
    v-model="isDialogOpen"
    max-width="440px"
    transition="dialog-transition"
    class="max-w-2xl"
    persistent
  >
    <v-card class="rounded-2xl pa-6">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <v-icon
          icon="mdi-shield-lock-outline"
          color="primary"
          size="x-large"
          class="mb-4 animate-bounce"
        />
        <v-card-title class="text-h5 font-weight-bold mb-2">
          Secure Your Account
        </v-card-title>
        <v-card-subtitle class="text-body-1 text-medium-emphasis" style="white-space: normal; word-wrap: break-word">
          {{ props.message }}
        </v-card-subtitle>
      </div>

      <!-- Form Section -->
      <v-card-text class="pa-0">
        <v-form @submit.prevent="submitForm" ref="form">
          <v-slide-y-transition group>
            <div key="password-field" class="mb-4">
              <v-text-field
                v-model="password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                placeholder="Enter your password"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :rules="passwordRules"
                autocomplete="new-password"
              >
                <template v-slot:details>
                  <div class="password-requirements mt-2">
                    <div
                      v-for="(rule, index) in passwordRequirements"
                      :key="index"
                      class="d-flex align-center mb-1"
                    >
                      <v-icon
                        :color="rule.valid ? 'success' : 'medium-emphasis'"
                        size="small"
                        class="mr-2"
                      >
                        {{ rule.valid ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                      </v-icon>
                      <span :class="rule.valid ? 'text-success' : 'text-medium-emphasis'">
                        {{ rule.text }}
                      </span>
                    </div>
                  </div>
                </template>
              </v-text-field>
            </div>

            <div key="confirm-password-field" class="mb-6">
              <v-text-field
                v-model="confirmPassword"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirm Password"
                placeholder="Confirm your password"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                variant="outlined"
                :rules="[confirmPasswordRules.match]"
                autocomplete="new-password"
              />
            </div>
          </v-slide-y-transition>

          <v-alert
            v-if="errorMessage"
            density="comfortable"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-card-text>

      <!-- Actions Section -->
      <v-card-actions class="pa-0 mt-4">
        <v-row no-gutters>
          <v-col cols="6" class="pr-2">
            <v-btn
              block
              variant="tonal"
              @click="closeDialog"
              class="text-medium-emphasis"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6" class="pl-2">
            <v-btn
              block
              color="primary"
              @click="submitForm"
              :loading="loading"
              :disabled="!isFormValid"
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { PASSWORD_PATTERN } from '@/utils/constant';

const props = defineProps({
  message: {
    type: String,
    default: 'Create a strong password to protect your account',
  },
});

const form = ref(null);
const isDialogOpen = ref(true);
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const showPassword = ref(true);
const showConfirmPassword = ref(true);
const loading = ref(false);

const passwordRequirements = computed(() => [
  {
    text: 'At least 6 characters',
    valid: password.value.length >= 6,
  },
  {
    text: 'Contains uppercase letter',
    valid: /[A-Z]/.test(password.value),
  },
  {
    text: 'Contains lowercase letter',
    valid: /[a-z]/.test(password.value),
  },
  {
    text: 'Contains number',
    valid: /[0-9]/.test(password.value),
  },
  {
    text: 'Contains special character',
    valid: /[^A-Za-z0-9]/.test(password.value),
  },
]);

const isFormValid = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    PASSWORD_PATTERN.test(password.value) &&
    password.value === confirmPassword.value
  );
});

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => PASSWORD_PATTERN.test(v) || 'Password does not meet requirements',
];

const confirmPasswordRules = {
  match: (v: string) => v === password.value || 'Passwords do not match',
};

const submitForm = () => {
  if (!password.value || !confirmPassword.value) {
    errorMessage.value = "Please fill in all fields.";
    return;
  }
  if (password.value === confirmPassword.value) {
    emit("passwordSubmitted", password.value);
    isDialogOpen.value = false;
  } else {
    errorMessage.value = "Passwords do not match.";
  }
};

const closeDialog = () => {
  isDialogOpen.value = false;
  emit('update:isDialogOpen', false);
};

const emit = defineEmits<{
  (e: 'passwordSubmitted', password: string): void;
  (e: 'update:isDialogOpen', value: boolean): void;
}>();
</script>

<style scoped>
.dialog-transition-enter-active,
.dialog-transition-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-transition-enter-from,
.dialog-transition-leave-to {
  opacity: 0;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.password-requirements {
  font-size: 0.875rem;
  display: block !important;
}
</style>
