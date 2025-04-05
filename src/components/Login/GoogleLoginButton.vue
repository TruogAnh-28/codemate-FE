<script setup lang="ts">
import { ref, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { googleTokenLogin } from "vue3-google-login";
import ApiService from "@/common/api.service";
import { FetchUserInformationFromGoogleResponse } from "@/types/Auth";
import { authenService } from "@/services/authenServices";
import googleLogo from "@/assets/login/googleLogo.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore;
const { setUser, setTokens } = authStore.getState();
const router = useRouter();

const passwordFromModal = ref("");
const isModalVisible = ref(false);
const loading = ref(false);
const googleLoginMessage = ref("");
const googleUserInfo = ref<FetchUserInformationFromGoogleResponse | null>(null);

const showModal = () => {
  isModalVisible.value = true;
};

const handlePasswordSubmitted = (password: string) => {
  passwordFromModal.value = password;
  isModalVisible.value = false;
};

const handleDialogClose = (isOpen: boolean) => {
  isModalVisible.value = isOpen;
  loading.value = false;
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const navigateToDashboard = (role?: string) => {
  switch (role) {
    case "student":
      router.push("/dashboard");
      break;
    case "professor":
      router.push("/professor-dashboard");
      break;
    case "admin":
      router.push("/admin-dashboard");
      break;
    default:
      router.push("/login");
  }
};

const login = async () => {
  loading.value = true;

  try {
    const responseFromGoogle = await googleTokenLogin();

    if (!responseFromGoogle.access_token) {
      showError("No access token received from Google");
      return;
    }

    const fetchedGoogleUserInfo = await ApiService.query<FetchUserInformationFromGoogleResponse>(
      import.meta.env.VITE_APP_googleApiLink,
      { access_token: responseFromGoogle.access_token },
      {
        parseResponse: (response) => response.data,
      }
    );

    if (!fetchedGoogleUserInfo?.email) {
      showError("Unable to retrieve email from Google");
      return;
    }

    // Store the Google user info
    googleUserInfo.value = fetchedGoogleUserInfo;

    const sendGoogleTokenResponse = await authenService.loginWithGoogle(
      { showError, showSuccess },
      {
        access_token: responseFromGoogle.access_token,
        user_info: fetchedGoogleUserInfo,
      }
    );

    if (sendGoogleTokenResponse?.isSuccess) {
      if (
        sendGoogleTokenResponse.message.includes("Please add password") ||
        sendGoogleTokenResponse.message.includes("hasn't had the password")
      ) {
        googleLoginMessage.value = sendGoogleTokenResponse.message;
        showModal();
      } else if (sendGoogleTokenResponse.message === "Login successfully") {
        showSuccess("Login successfully");
        
        if (
          sendGoogleTokenResponse.data &&
          "access_token" in sendGoogleTokenResponse.data
        ) {
          const userInfo = {
            role: sendGoogleTokenResponse.data.role,
            email: sendGoogleTokenResponse.data.email,
            name: sendGoogleTokenResponse.data.name,
            rememberMe: "false",
          };

          setUser(userInfo);
          setTokens(
            sendGoogleTokenResponse.data.access_token,
            sendGoogleTokenResponse.data.refresh_token
          );

          navigateToDashboard(userInfo.role);
        }
      }
    } else {
      showError("Authentication failed. Please try again later.");
    }
  } catch (error) {
    console.error("Google Login Error:", error);
    showError(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during Google login"
    );
  } finally {
    loading.value = false;
  }
};

watch(
  () => passwordFromModal.value,
  async (newPassword: string) => {
    if (newPassword && googleUserInfo.value?.email) {
      try {
        const response = await authenService.loginWithEmail(
          { showError, showSuccess },
          {
            email: googleUserInfo.value.email,
            password: newPassword,
          }
        );

        if (response) {
          showSuccess("Login successfully");
          if (response.data && "access_token" in response.data) {
            const userInfo = {
              role: response.data.role,
              email: response.data.email,
              name: response.data.name,
              rememberMe: "false",
            };

            setUser(userInfo);
            setTokens(
              response.data.access_token,
              response.data.refresh_token
            );

            navigateToDashboard(userInfo.role);
          }
        }
      } catch (error) {
        showError(String(error));
      }
    } else {
      showError("Cannot fetch your email from google");
    }
  }
);
</script>

<template>
  <v-btn
    @click="login"
    class="w-full flex items-center justify-center p-6 border rounded-lg shadow-lg hover:bg-on-primary secondary-variant transition duration-300 transform hover:scale-105"
    :loading="loading"
    :disabled="loading"
  >
    <googleLogo />
    <p class="ml-4 text-body-base-bold normal-case">Login with Google</p>
  </v-btn>
  <PasswordModal
    v-if="isModalVisible"
    :message="googleLoginMessage"
    @passwordSubmitted="handlePasswordSubmitted"
    @update:isDialogOpen="handleDialogClose"
  />
</template>

<style scoped>
.v-btn p {
  text-transform: none !important;
}
</style>