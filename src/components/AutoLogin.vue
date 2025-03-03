<template>
  <div
    v-if="loading"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <v-progress-circular indeterminate color="primary" size="64" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ApiService from "@/common/api.service";
import { useAuthStore } from "@/stores/auth";
import { usersService } from "@/services/usersServices";
import { PUBLIC_ROUTES } from "@/common/api.service";

const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const getUserInfo = async () => {
  try {
    const response = await usersService.getProfile({ showError, showSuccess });
    if (!response?.data) {
      console.error("No user data returned from getProfile");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    showError("Unable to retrieve user information.");
    return null;
  }
};

const redirectUser = (userRole: string) => {
  const redirectUrl = sessionStorage.getItem("redirectUrl");
  if (redirectUrl && !PUBLIC_ROUTES.includes(redirectUrl)) {
    sessionStorage.removeItem("redirectUrl");
    router.push(redirectUrl);
  } else {
    const redirectPath =
      {
        student: "/dashboard",
        professor: "/professor-dashboard",
        admin: "/admin-dashboard",
      }[userRole] || "/";
    router.push(redirectPath);
  }
};

const autoLogin = async () => {
  loading.value = true;
  try {
    const accessToken = ApiService.getToken();
    const refreshToken = ApiService.getRefreshToken();

    if (!accessToken && !refreshToken) {
      loading.value = false;
      return;
    }

    if (accessToken && !ApiService.checkTokenExpiration()) {
      const userInfo = await getUserInfo();
      if (userInfo) {
        authStore.setUser({
          role: userInfo.role,
          email: userInfo.email,
          name: userInfo.name,
          rememberMe: localStorage.getItem("rememberMe") || "false",
        });
        authStore.isAuthenticated = true;
        redirectUser(userInfo.role);
        loading.value = false;
        return;
      }
    }

    if (refreshToken) {
      const refreshed = await ApiService.refreshToken();
      if (refreshed) {
        const userInfo = await getUserInfo();
        if (userInfo) {
          authStore.setUser({
            role: userInfo.role,
            email: userInfo.email,
            name: userInfo.name,
            rememberMe: localStorage.getItem("rememberMe") || "false",
          });
          authStore.isAuthenticated = true;
          redirectUser(userInfo.role);
          loading.value = false;
          return;
        }
      } else {
        ApiService.clearAuthData();
        if (!PUBLIC_ROUTES.includes(router.currentRoute.value.path)) {
          router.push("/login"); // Redirect to login instead of "/"
        }
      }
    } else {
      ApiService.clearAuthData();
      if (!PUBLIC_ROUTES.includes(router.currentRoute.value.path)) {
        router.push("/login");
      }
    }
  } catch (error) {
    console.error("Auto-login failed:", error);
    showError("Authentication failed. Please log in again.");
    ApiService.clearAuthData();
    if (!PUBLIC_ROUTES.includes(router.currentRoute.value.path)) {
      router.push("/login");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  autoLogin();
});
</script>
