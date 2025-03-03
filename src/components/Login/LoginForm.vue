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

        <v-form @submit.prevent="handleSubmit" v-model="isValid" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Email address</label>
            <v-text-field
              v-model="email"
              :rules="validationRules.email"
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
              :rules="validationRules.password"
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
import type { LoginSuccessResponse } from "@/types/Auth";
import ApiService, { PUBLIC_ROUTES } from "@/common/api.service";
import { usersService } from "@/services/usersServices";

const email = ref("");
const password = ref("");
const verifyCode = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isValid = ref(false);
const loading = ref(false);
const messageToVerifyModal = ref("");
const isModalVisible = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const validationRules = {
  email: [
    (v: string) => !!v || "Email is required",
    (v: string) => EMAIL_PATTERN.test(v) || "Invalid email address",
  ],
  password: [
    (v: string) => !!v || "Password is required",
    (v: string) => v.length >= 6 || "Password must be at least 6 characters",
    (v: string) => /[A-Z]/.test(v) || "Must contain uppercase letter",
    (v: string) => /[a-z]/.test(v) || "Must contain lowercase letter",
    (v: string) => /[0-9]/.test(v) || "Must contain number",
    (v: string) => /[^A-Za-z0-9]/.test(v) || "Must contain special character",
    (v: string) => PASSWORD_PATTERN.test(v) || "Invalid password format",
  ],
};

const rememberMeDefault = localStorage.getItem("user");
if (rememberMeDefault) {
  rememberMe.value = JSON.parse(rememberMeDefault).rememberMe === "true";
}

const handleVerifyCode = (code: string) => {
  verifyCode.value = code;
  isModalVisible.value = false;
};

const showModal = () => {
  isModalVisible.value = true;
};

const handleDialogClose = (value: boolean) => {
  isModalVisible.value = value;
};

const handleSuccessfulLogin = (data: LoginSuccessResponse) => {
  const userInfo = {
    role: data.role,
    email: data.email,
    name: data.name,
    rememberMe: rememberMe.value.toString(),
  };

  authStore.setUser(userInfo);
  authStore.isAuthenticated = true;
  authStore.setTokens(data.access_token, data.refresh_token);

  const redirectUrl = sessionStorage.getItem("redirectUrl");
  if (redirectUrl && !PUBLIC_ROUTES.includes(redirectUrl)) {
    console.log("Redirecting to:", redirectUrl);
    router.push(redirectUrl);
    sessionStorage.removeItem("redirectUrl");
    return;
  }

  const redirectPath =
    {
      student: "/dashboard",
      professor: "/professor-dashboard",
      admin: "/admin-dashboard",
    }[data.role] || "/dashboard"; // Mặc định là /dashboard thay vì /

  console.log("Role:", data.role, "Redirecting to:", redirectPath);

  if (data.role === "admin") {
    showSuccess("Admin login successfully");
  } else if (data.role === "professor") {
    showSuccess("Professor login successfully");
  } else {
    showSuccess("Student login successfully");
  }
  router.push(redirectPath);
};

const handleSubmit = async () => {
  if (!isValid.value) return;
  loading.value = true;

  try {
    const response = await authenService.loginWithEmail(
      { showError, showSuccess },
      { email: email.value, password: password.value }
    );

    if (
      response?.message === "User not found. Verification code sent to email" ||
      response?.message ===
        "Your email hasn't been verified. Please verify your email to login."
    ) {
      loading.value = false;
      messageToVerifyModal.value = response.message;
      showModal();
      return;
    }

    const responseData = response.data;
    if (!responseData) return;

    if (
      responseData.is_email_verified &&
      "is_active" in responseData &&
      responseData.is_active
    ) {
      // await usersService.createUserLogin({
      //   user_role: responseData.role,
      //   login_timestamp: new Date().toISOString(),
      // });
      handleSuccessfulLogin(responseData);
    }
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped></style>
