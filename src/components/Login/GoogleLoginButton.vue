<script setup lang="ts">
import { googleTokenLogin } from "vue3-google-login";
import ApiService from "@/common/api.service";
import { googleApiLink } from "@/common/config";
import { FetchUserInformationFromGoogleResponse } from "@/types/Auth";
import { authenService } from "@/services/authenServices";
import googleLogo from "@/assets/login/googleLogo.vue";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const router = useRouter();
const passwordFromModal = ref("");
const isModalVisible = ref(false);
const loading = ref(false);
const googleLoginMessage = ref("");
const googleUserInfo_Store = ref<FetchUserInformationFromGoogleResponse>();

const showModal = () => {
  isModalVisible.value = true;
};

const handlePasswordSubmitted = (password: string) => {
  passwordFromModal.value = password;
  isModalVisible.value = false;
  loading.value = false;
};

const handleDialogClose = (isOpen: boolean) => {
  isModalVisible.value = isOpen;
  loading.value = false;
};
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const login = async () => {
  loading.value = true;

  try {
    const responseFromGoogle = await googleTokenLogin();

    if (!responseFromGoogle.access_token) {
      showError("No access token received from Google");
    }

    const googleUserInfo =
      await ApiService.query<FetchUserInformationFromGoogleResponse>(
        googleApiLink,
        { access_token: responseFromGoogle.access_token },
        {
          parseResponse: (response) => response.data,
        }
      );

    if (!googleUserInfo?.email) {
      showError("Unable to retrieve email from Google");
    }

    const sendGoogleTokenResponse = await authenService.loginWithGoogle(
      { showError, showSuccess },
      {
        access_token: responseFromGoogle.access_token,
        user_info: googleUserInfo,
      }
    );
    if (sendGoogleTokenResponse?.isSuccess) {
      if (
        sendGoogleTokenResponse.message ===
          "Google login successfully! Please add password to your account to complete your profile." ||
        sendGoogleTokenResponse.message ===
          "Your account hasn't had the password. Please add a password to your account to complete your profile."
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

          authStore.setUser(userInfo);
          authStore.setTokens(
            sendGoogleTokenResponse.data.access_token,
            sendGoogleTokenResponse.data.refresh_token
          );

          const user = authStore.getUser();
          if (user.role === "student") {
            router.push("/dashboard");
          } else if (user.role === "professor") {
            // router.push({ name: "DashboardProfessor" });
          } else if (user.role === "admin") {
            router.push("/admin-dashboard");
          } else {
            router.push("/login");
          }
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
    if (newPassword) {
      try {
        if (googleUserInfo_Store.value?.email) {
          const response = await authenService.loginWithEmail(
            { showError, showSuccess },
            {
              email: googleUserInfo_Store.value.email,
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

              authStore.setUser(userInfo);
              authStore.setTokens(
                response.data.access_token,
                response.data.refresh_token
              );

              const user = authStore.getUser();
              if (user.role === "student") {
                router.push("/dashboard");
              } else if (user.role === "professor") {
                // router.push({ name: "DashboardProfessor" });
              } else if (user.role === "admin") {
                router.push("/admin-dashboard");
              } else {
                router.push("/login");
              }
            }
          }
        } else {
          showError("Cannot fetch your email from google");
        }
      } catch (error) {
        showError(("Error during login: " + error) as unknown as string);
      }
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
