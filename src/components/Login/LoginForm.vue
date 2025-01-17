<template>
  <div class="flex items-center justify-center">
    <v-card
      class="w-full max-w-md bg-on-primary border"
      style="border-radius: 24px !important"
    >
      <v-card-item style="padding: 32px">
        <h1 class="text-heading-3 text-center mb-2 text-secondary">Log In</h1>
        <div class="py-4"><GoogleLoginButton /></div>

        <div class="relative mb-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-body-base-regular">
            <span class="px-4 bg-on-primary text-gray-500">OR</span>
          </div>
        </div>

        <v-form
          @submit.prevent="handleSubmit"
          v-model="isValid"
          class="space-y-6"
        >
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Email address</label
            >
            <v-text-field
              v-model="email"
              :rules="emailRules"
              placeholder="Enter your email address"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              class="rounded-lg"
              hide-details="auto"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Password</label>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your Password"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              class="rounded-lg"
              hide-details="auto"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
            />
          </div>

          <div class="flex items-center justify-between">
            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              class="text-body-base-bold"
              hide-details
              density="compact"
            />
            <a
              href="/forgot-password"
              class="text-body-small-medium text-gray-600 hover:text-gray-900"
            >
              Forget your password
            </a>
          </div>

          <v-btn
            type="submit"
            class="w-full bg-primary text-on-primary rounded-md"
            height="44"
            :disabled="!isValid"
            :loading="loading"
          >
            Log in
          </v-btn>
        </v-form>
      </v-card-item>
    </v-card>
  </div>
  <VerifyCode
    v-if="isModalVisible"
    :message="messageToVerifyModal"
    :email="email"
    @verifyCode="handleVerifyCode"
    @update:isDialogOpen="handleDialogClose"
  />
</template>

<script setup lang="ts">
import { authenService } from "@/services/authenServices";
import { useAuthStore } from "@/stores/auth";
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "@/utils/constant";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isValid = ref(false);
const loading = ref(false);
const messageToVerifyModal = ref("");
const verifyCode = ref("");
const isModalVisible = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const rememberMeDefault = localStorage.getItem("user");
if (rememberMeDefault) {
  rememberMe.value = JSON.parse(rememberMeDefault).rememberMe === "true";
}

const showModal = () => {
  isModalVisible.value = true;
};

const handleVerifyCode = (code: string) => {
  verifyCode.value = code;
  isModalVisible.value = false;
};

const handleDialogClose = (value: boolean) => {
  isModalVisible.value = value;
};

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => EMAIL_PATTERN.test(v) || "Invalid email address",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters",
  (v: string) => /[A-Z]/.test(v) || "Must contain uppercase letter",
  (v: string) => /[a-z]/.test(v) || "Must contain lowercase letter",
  (v: string) => /[0-9]/.test(v) || "Must contain number",
  (v: string) => /[^A-Za-z0-9]/.test(v) || "Must contain special character",
  (v: string) =>
    PASSWORD_PATTERN.test(v) ||
    "Password must be at least 6 characters, contain uppercase, lowercase, number, and special character",
];

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const handleSubmit = async () => {
  if (!isValid.value) return;

  loading.value = true;
  try {
    const handleLogin = await authenService.loginWithEmail(showError, {
      email: email.value,
      password: password.value,
    });

    if (
      handleLogin?.message ===
        "User not found. Verification code sent to email" ||
      handleLogin?.message ===
        "Your email hasn't been verified. Please verify your email to login."
    ) {
      loading.value = false;
      messageToVerifyModal.value =
        handleLogin?.message ===
        "User not found. Verification code sent to email"
          ? "Your account hasn't been registered. Please verify your email to create an account."
          : "Your email hasn't been verified. Please verify your email to login.";
      showModal();

    } else if (handleLogin?.message === "Login successfully") {
      showSuccess("Login successfully");
      loading.value = false;

      if (handleLogin.data && "access_token" in handleLogin.data) {
        const userInfo = {
          role: handleLogin.data.role,
          email: handleLogin.data.email,
          name: handleLogin.data.name,
          rememberMe: rememberMe.value ? "true" : "false",
        };

        authStore.setUser(userInfo);
        authStore.setTokens(
          handleLogin.data.access_token,
          handleLogin.data.refresh_token
        );

        const user = authStore.getUser();
        if (user.role === "student") {
          router.push("/dashboard");
        } else if (user.role === "professor") {
          // router.push({ name: "DashboardProfessor" });
        } else if (user.role === "admin") {
          showSuccess("Admin login successfully");
          router.push("/admin-dashboard");
        } else {
          router.push("/login");
        }
      }
    }
  } catch {
    loading.value = false;
    showError("Invalid email or password");
  }
  finally{
    loading.value = false;
  }
};
</script>
<style scoped></style>
