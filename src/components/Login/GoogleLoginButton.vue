<script setup lang="ts">
import { googleTokenLogin } from "vue3-google-login";
import ApiService from "@/common/api.service";
import { googleApiLink } from "@/common/config";
import { FetchUserInformationFromGoogleResponse } from "@/types/Auth";
import { authenService } from "@/services/authenServices";
import googleLogo from "@/assets/login/googleLogo.vue";
import { useAuthSessionStore } from "@/stores/authSession";

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

    if (responseFromGoogle.access_token) {
      const params = { access_token: responseFromGoogle.access_token };

      const googleUserInfo = await ApiService.query<
        FetchUserInformationFromGoogleResponse,
        FetchUserInformationFromGoogleResponse
      >(googleApiLink, params);

      if (googleUserInfo.email) {
        googleUserInfo_Store.value = googleUserInfo;

        const sendGoogleTokenResponse = await authenService.loginWithGoogle(
          showError,
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
              useAuthSessionStore().setAuthSession(
                sendGoogleTokenResponse.data.access_token,
                {
                  role: sendGoogleTokenResponse.data.role,
                  email: sendGoogleTokenResponse.data.email,
                  name: sendGoogleTokenResponse.data.name,
                  rememberMe: "false",
                }
              );
            }
          }
        } else {
          showError("Authentication failed. Please try again later.");
        }
      } else {
        showError(
          "Unable to retrieve your email from Google. Please check your Google account settings."
        );
      }
    } else {
      showError(
        "Failed to authenticate with Google. Please ensure you have granted the necessary permissions."
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Popup window closed") {
      showError("Google login process was canceled by the user.");
    } else {
      showError(
        "An error occurred during Google login. Please try again later."
      );
    }
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
          const response = await authenService.loginWithEmail(showError, {
            email: googleUserInfo_Store.value.email,
            password: newPassword,
          });
          if (response) {
            showSuccess("Login successfully");
            if (response.data && "access_token" in response.data) {
              useAuthSessionStore().setAuthSession(response.data.access_token, {
                role: response.data.role,
                email: response.data.email,
                name: response.data.name,
                rememberMe: "false",
              });
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
