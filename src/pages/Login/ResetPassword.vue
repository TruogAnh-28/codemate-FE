<template>
  <v-container className="fill-height">
    <v-main className="pt-0">
      <div class="flex w-full items-center justify-center">
        <v-card class="rounded-2xl pa-6">
          <!-- Header Section (unchanged) -->
          <div class="text-center mb-8">
            <v-icon
              icon="mdi-shield-lock-outline"
              color="primary"
              size="x-large"
              class="mb-4 animate-bounce"
            />
            <v-card-title class="text-h5 font-weight-bold mb-2">
              Password Recovery: Quick and Easy
            </v-card-title>
            <v-card-subtitle
              class="text-body-1 text-medium-emphasis"
              style="white-space: normal; word-wrap: break-word"
            >
              Regain Access to Your Account Instantly
            </v-card-subtitle>
          </div>

          <!-- Form Section -->
          <v-card-text class="pa-0">
            <v-form @submit.prevent="submitForm" ref="form">
              <v-slide-y-transition group>
                <div key="password-field" class="mb-4">
                  <v-text-field
                    v-model="password"
                    :append-inner-icon="!showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    placeholder="Enter your password"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    :rules="passwordRules"
                    autocomplete="new-password"
                  >
                    <template v-slot:details>
                      <v-container class="pa-0">
                        <v-row
                          v-for="(rule, index) in passwordRequirements"
                          :key="index"
                          class="ma-0 mb-1"
                          align="center"
                          no-gutters
                        >
                          <v-col cols="12" class="d-flex align-center">
                            <v-icon
                              :color="rule.valid ? 'success' : 'medium-emphasis'"
                              size="small"
                              class="mr-2"
                            >
                              {{ rule.valid ? "mdi-check-circle" : "mdi-circle-outline" }}
                            </v-icon>
                            <span
                              :class="rule.valid ? 'text-success' : 'text-medium-emphasis'"
                            >
                              {{ rule.text }}
                            </span>
                          </v-col>
                        </v-row>
                      </v-container>
                    </template>
                  </v-text-field>
                </div>

                <!-- Confirm Password Field (unchanged) -->
                <div key="confirm-password-field" class="mb-6">
                  <v-text-field
                    v-model="confirmPassword"
                    :append-inner-icon="!showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
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

          <!-- Actions Section (unchanged) -->
          <v-card-actions class="pa-0 mt-4">
            <v-row no-gutters>
              <v-col cols="6" class="pr-2">
                <v-btn
                  block
                  variant="tonal"
                  :to="`/login`"
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
      </div>
    </v-main>
  </v-container>
  <VerifyCode
    v-if="isModalVisible"
    :message="messageToVerifyModal"
    :email="email"
    :reset-password="true"
    @verifyCode="handleVerifyCode"
    @update:isDialogOpen="handleDialogClose"
  />
</template>
<script setup lang="ts">
import { authenService } from "@/services/authenServices";
import { useResetPasswordEmailStore } from "@/stores/resetPasswordEmail";
import { PASSWORD_PATTERN } from "@/utils/constant";

const form = ref(null);
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const isModalVisible = ref(true);
const messageToVerifyModal = ref("");
const verifyCode = ref("");
const router = useRouter();
const email = useResetPasswordEmailStore().email;
watch(
  () => verifyCode.value,
  () => {
    if (verifyCode.value.length === 6) {
      useResetPasswordEmailStore().setCode(verifyCode.value);
    }
  }
);
const handleVerifyCode = (code: string) => {
  verifyCode.value = code;
  isModalVisible.value = false;
};

const handleDialogClose = (value: boolean) => {
  isModalVisible.value = value;
};

const passwordRequirements = computed(() => [
  {
    text: "At least 6 characters",
    valid: password.value.length >= 6,
  },
  {
    text: "Contains uppercase letter",
    valid: /[A-Z]/.test(password.value),
  },
  {
    text: "Contains lowercase letter",
    valid: /[a-z]/.test(password.value),
  },
  {
    text: "Contains number",
    valid: /[0-9]/.test(password.value),
  },
  {
    text: "Contains special character",
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
  (v: string) => !!v || "Password is required",
  (v: string) =>
    PASSWORD_PATTERN.test(v) || "Password does not meet requirements",
];

const confirmPasswordRules = {
  match: (v: string) => v === password.value || "Passwords do not match",
};
const showError = inject("showError") as (message: string) => void;
const submitForm = async () => {
  if (!password.value || !confirmPassword.value) {
    errorMessage.value = "Password and Confirm Password are required.";
    return;
  }
  if (password.value === confirmPassword.value) {
    errorMessage.value = "";
    loading.value = true;
    useResetPasswordEmailStore().setPassword(password.value);
    try {
      const response = await authenService.resetPassword(showError, {
        email: useResetPasswordEmailStore().email,
        code: useResetPasswordEmailStore().code,
        new_password: useResetPasswordEmailStore().password,
      });
      if (response?.isSuccess) {
        showSuccess("Password reset successfully");
        router.push("/login");
      } else {
        showError("Password reset failed");
      }
    } catch (error) {
      showError("Error during password reset: " + error);
    } finally {
      loading.value = false;
    }
  } else {
    errorMessage.value = "Passwords do not match.";
  }
};
const showSuccess = inject("showSuccess") as (message: string) => void;
</script>
<style scoped>
</style>

