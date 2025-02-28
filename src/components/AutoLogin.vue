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

const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const getUserInfo = async () => {
  try {
    // Get current user profile from API
    const response = await usersService.getProfile({showError, showSuccess});
    return response.data;
  } catch (error) {
    return null;
  }
};

const autoLogin = async () => {
  loading.value = true;

  try {
    const accessToken = ApiService.getToken();
    const refreshToken = ApiService.getRefreshToken();

    // No tokens available
    if (!accessToken && !refreshToken) {
      loading.value = false;
      return;
    }

    // Check if access token is valid
    if (accessToken && !ApiService.checkTokenExpiration()) {
      // Token is valid, get user info
      const userInfo = await getUserInfo();

      if (userInfo) {
        // Set user in store
        authStore.setUser({
          role: userInfo.role,
          email: userInfo.email,
          name: userInfo.name,
          rememberMe: localStorage.getItem("rememberMe") === "true" ? "true" : "false",
        });

        // Redirect to appropriate dashboard
        const redirectPath =
          {
            student: "/dashboard",
            professor: "/professor-dashboard",
            admin: "/admin-dashboard",
          }[userInfo.role] || "/";

        if (
          router.currentRoute.value.path === "/login" ||
          router.currentRoute.value.path === "/"
        ) {
          router.push(redirectPath);
        }
        loading.value = false;
        return;
      }
    }

    // If access token is expired or invalid but refresh token exists
    if (refreshToken) {
      const refreshed = await ApiService.refreshToken();

      if (refreshed) {
        // Successfully refreshed, get user info
        const userInfo = await getUserInfo();

        if (userInfo) {
          // Set user in store
          authStore.setUser({
            role: userInfo.role,
            email: userInfo.email,
            name: userInfo.name,
            rememberMe: localStorage.getItem("rememberMe") === "true" ? "true" : "false",
          });

          // Redirect to appropriate dashboard
          const redirectPath =
            {
              student: "/dashboard",
              professor: "/professor-dashboard",
              admin: "/admin-dashboard",
            }[userInfo.role] || "/";

          if (
            router.currentRoute.value.path === "/login" ||
            router.currentRoute.value.path === "/"
          ) {
            router.push(redirectPath);
          }
          loading.value = false;
          return;
        }
      } else {
        // Refresh token failed, clear auth data
        ApiService.clearAuthData();

        // Only redirect to landing page if on a protected route
        if (!ApiService.isPublicRoute(router.currentRoute.value.path)) {
          router.push("/");
        }
      }
    } else {
      // No refresh token, clear auth data
      ApiService.clearAuthData();

      // Only redirect to landing page if on a protected route
      if (!ApiService.isPublicRoute(router.currentRoute.value.path)) {
        router.push("/");
      }
    }
  } catch (error) {
    if (showError) {
      showError("Authentication failed. Please log in again.");
    }
    ApiService.clearAuthData();

    // Only redirect to landing page if on a protected route
    if (!ApiService.isPublicRoute(router.currentRoute.value.path)) {
      router.push("/");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  autoLogin();
});
</script>
