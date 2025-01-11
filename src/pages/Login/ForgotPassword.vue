<template>
  <v-container className="fill-height">
    <v-main className="pt-16">
      <div class="flex w-full items-center justify-center">
        <v-card
          class="w-full max-w-md bg-on-primary border"
          style="border-radius: 24px !important"
        >
          <v-card-title class="text-heading-3 text-center mb-2 text-secondary">
            Forgot Password
          </v-card-title>
          <v-card-subtitle class="text-center">
            Securing Your Account with a New Password
          </v-card-subtitle>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                dense
                required
              ></v-text-field>
              <v-card-actions class="flex flex-col gap-4 px-6 pb-6">
                <div class="flex justify-between gap-3 w-full">
                  <v-btn
                    variant="outlined"
                    :disabled="loading"
                    :to="`/login`"
                    class="min-w-[100px]"
                  >
                    Cancel
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    color="primary"
                    :loading="loading"
                    :disabled="!email || loading"
                    @click="sendEmail"
                    class="min-w-[100px]"
                  >
                    <v-icon start icon="mdi-check" />
                    Send Request
                  </v-btn>
                </div>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
import { authenService } from "@/services/authenServices";
import { useResetPasswordEmailStore } from "@/stores/resetPasswordEmail";

const email = ref("");
const loading = ref(false);
const router = useRouter();
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const sendEmail = async () => {
  loading.value = true;
  const sendRequestEmail = await authenService.forgotPassword(
    showError,
    email.value
  );
  if (sendRequestEmail?.isSuccess) {
    showSuccess(
      "Please check that the code has been sent to your email to reset your password."
    );
    if(email.value){
      useResetPasswordEmailStore().setEmail(email.value);
      router.push(`/reset-password`);
    }
  }
  loading.value = false;
};
</script>
