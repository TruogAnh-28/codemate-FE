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
import { GetProfileResponse } from "@/types/User";

const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const getUserInfo = async (): Promise<GetProfileResponse | undefined> => {
  try {
    // Get current user profile from API
    const response = await usersService.getProfile({ showError, showSuccess });
    if (response && "data" in response) {
      return response.data ?? undefined;
    }
  } catch (error) {
    if (showError) {
      showError("Failed to get user info.");
    }
  }
  return undefined;
};

const autoLogin = async () => {
  loading.value = true;
  console.log("set loading to true");

  // Capture the current route path before any redirects happen
  const currentPath = router.currentRoute.value.fullPath;
  console.log("Current path before auth check:", currentPath);

  try {
    const accessToken = ApiService.getToken();
    const refreshToken = ApiService.getRefreshToken();
    console.log("get token and refresh token");
    // No tokens available
    if (!accessToken && !refreshToken) {
      loading.value = false;
      console.log("no token and refresh token");
    }

    // Check if access token is valid
    if (accessToken && !ApiService.checkTokenExpiration()) {
      console.log("access token is valid");
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
        const rolePaths: { [key: string]: string } = {
          student: "/dashboard",
          professor: "/professor-dashboard",
          admin: "/admin-dashboard",
        };
        const redirectPath = rolePaths[userInfo.role] || "/";

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
    console.log("access token is invalid");
    // If access token is expired or invalid but refresh token exists
    if (refreshToken) {
      console.log("refresh token exists");
      const refreshed = await ApiService.refreshToken();
      if (refreshed) {
        console.log("refreshed");
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

        // Store the original path that triggered the auth failure
        // This captures the route the user was trying to access
        if (!ApiService.isPublicRoute(currentPath)) {
          console.log("Storing redirect URL:", currentPath);
          sessionStorage.setItem("redirectUrl", currentPath);
        }

        showError("Your session has expired. Please log in again.");
        // Only redirect to landing page if on a protected route
        if (!ApiService.isPublicRoute(router.currentRoute.value.path)) {
          router.push("/");
        }
      }
    } else {
      // No refresh token, clear auth data
      ApiService.clearAuthData();

      // Store the original path
      if (!ApiService.isPublicRoute(currentPath)) {
        console.log("Storing redirect URL:", currentPath);
        sessionStorage.setItem("redirectUrl", currentPath);
      }

      // Only redirect to landing page if on a protected route
      if (!ApiService.isPublicRoute(router.currentRoute.value.path)) {
        router.push("/");
      }
    }
  } catch (error) {
    if (showError) {
      showError("Your session has expired. Please log in again.");
    }
    ApiService.clearAuthData();

    // Store the original path on error
    if (!ApiService.isPublicRoute(currentPath)) {
      console.log("Storing redirect URL on error:", currentPath);
      sessionStorage.setItem("redirectUrl", currentPath);
    }

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
