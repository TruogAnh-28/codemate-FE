<template>
  <v-dialog
    v-model="isDialogVisible"
    max-width="448px"
    transition="dialog-bottom-transition"
    class="rounded-lg"
    persistent
  >
    <v-card class="rounded-lg">
      <v-card-item class="pb-0">
        <div class="flex justify-between items-center">
          <div>
            <v-card-title class="text-h5 font-semibold mb-1">
              Verify Code
            </v-card-title>
            <v-card-subtitle class="text-gray-500">
              Enter the verification code sent to you
            </v-card-subtitle>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            density="comfortable"
            class="text-gray-500"
            @click="closeDialog"
          />
        </div>
      </v-card-item>

      <v-card-text class="pt-6">
        <!-- Error Message -->
        <v-alert
          v-if="props.message"
          density="comfortable"
          type="error"
          variant="tonal"
          class="mb-6 text-body-2"
        >
          {{ props.message }}
        </v-alert>

        <!-- Verification Input -->
        <div class="space-y-2">
          <label for="verifyCode" class="text-sm font-medium text-gray-700">
            Verification Code
          </label>

          <v-text-field
            id="verifyCode"
            v-model="verifyCode"
            :rules="verifyCodeRules"
            variant="outlined"
            density="comfortable"
            placeholder="Enter 6-digit code"
            maxlength="6"
            class="verify-input mt-1"
            :loading="loading"
            :disabled="loading"
            hide-details
          >
            <template #append>
              <span class="text-sm text-gray-500">
                {{ verifyCode.length }}/6
              </span>
            </template>
          </v-text-field>
        </div>
      </v-card-text>

      <v-card-actions class="flex flex-col gap-4 px-6 pb-6">
        <div class="flex justify-between gap-3 w-full">
          <v-btn
            variant="outlined"
            :disabled="loading"
            @click="closeDialog"
            class="min-w-[100px]"
          >
            Cancel
          </v-btn>

          <v-btn
            variant="outlined"
            color="primary"
            :loading="loading"
            :disabled="!verifyCode || loading"
            @click="submitCode"
            class="min-w-[100px]"
          >
            <v-icon start icon="mdi-check" />
            Verify
          </v-btn>
        </div>

        <v-btn
          variant="text"
          :loading="loading"
          :disabled="loading"
          @click="resendVerifyCode"
          class="w-full"
          color="secondary"
        >
          <v-icon start icon="mdi-refresh" />
          Resend Code
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { authenService } from "@/services/authenServices";
import { useResetPasswordEmailStore } from "@/stores/resetPasswordEmail";
import { NUMBER_PATTERN } from "@/utils/constant";

const verifyCodeRules = [
  (v: string) => !!v || "Verify code is required",
  (v: string) =>
    (v && v.length === 6) || "Verify code must be 6 characters long",
  (v: string) => NUMBER_PATTERN.test(v) || "Verify code must be a number",
];

const props = defineProps({
  message: {
    type: String,
    default: "Enter the code we just sent to your email",
  },
  email: {
    type: String,
    required: true,
  },
  resetPassword: {
    type: Boolean,
    default: false,
  },
});
const isDialogVisible = ref(true);
const verifyCode = ref("");
const loading = ref(false);

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const emit = defineEmits<{
  (e: "verifyCode", code: string): void;
  (e: "update:isDialogVisible", value: boolean): void;
}>();

const closeDialog = () => {
  isDialogVisible.value = false;
  emit("update:isDialogVisible", false);
};

const submitCode = async () => {
  if (verifyCode.value.length === 6) {
    loading.value = true;
    try {
      const emailToUse = props.resetPassword
        ? useResetPasswordEmailStore().email
        : props.email;
      const response = await authenService.verifyEmail(
        { showError, showSuccess },
        {
          email: emailToUse,
          code: verifyCode.value,
          reset_password: props.resetPassword,
        }
      );
      if (response?.data?.is_email_verified) {
        showSuccess("Email verified successfully! Please log in~");
        emit("verifyCode", verifyCode.value);
        closeDialog();
      } else {
        showError("Verification failed. Please try again.");
      }
    } finally {
      loading.value = false;
    }
  }
};

const resendVerifyCode = async () => {
  loading.value = true;
  try {
    const response = await authenService.resendVerifyEmail(
      { showError, showSuccess },
      props.email
    );
    if (response?.isSuccess) {
      showSuccess("Verification code sent again");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.verify-input :deep(input) {
  text-align: center;
  letter-spacing: 0.25em;
  font-size: 1.125rem;
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.dialog-bottom-transition-enter-from,
.dialog-bottom-transition-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
