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
import { useRouter, useRoute } from "vue-router";
import ApiService from "@/common/api.service";
import { useAuthStore } from "@/stores/auth";
import { usersService } from "@/services/usersServices";
import { PUBLIC_ROUTES } from "@/common/api.service";
const authStore = useAuthStore;
const loading = ref(false);
const router = useRouter();
const route = useRoute(); // Add useRoute to access current route
const {setUser, setAvatar, setMs} = authStore.getState();
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
  const rolePaths = {
    student: ["/dashboard", "/courselist", "/courselist/course/", "/progress-tracking", "/lessonRecommend/", "/profile"],
    professor: ["/professor-dashboard", "/professor-courselist", "/professor-courselist/courses/", "/professor-feedback", "/professor-progress", "/professor-code", "/professor-schedule", "/courses/", "/profile"],
    admin: ["/admin-dashboard", "/feedback-management", "/user-management", "/course-management", "/add-course", "/add-user", "/feedback-statistics", "/system-usage-statistics", "/profile"],
  };
const isRouteValidForRole = (role: string, path: string): boolean => {
  return rolePaths[role as keyof typeof rolePaths]?.some(pattern => path.startsWith(pattern)) || false;
};

const redirectUser = async (userRole: string) => {
  const redirectUrl = sessionStorage.getItem("redirectUrl");
  const currentPath = route.path;

  // If current route is valid for the role, stay there
  if (!PUBLIC_ROUTES.includes(currentPath) && isRouteValidForRole(userRole, currentPath)) {
    return; // No redirect needed
  }

  // Otherwise, redirect to stored URL or default dashboard
  if (redirectUrl && !PUBLIC_ROUTES.includes(redirectUrl)) {
    sessionStorage.removeItem("redirectUrl");
    router.push(redirectUrl);
  } else {
    const redirectPath =
      {
        student: "/dashboard",
        professor: "/professor-dashboard",
        admin: "/admin-dashboard",
      }[userRole] || "/login";
    router.push(redirectPath);
  }
  await trackUserLogin(userRole);
};

const trackUserLogin = async (userRole: string) => {
  try {
    await usersService.createUserLogin({
      user_role: userRole,
      login_timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to track user login:", error);
  }
};

const autoLogin = async () => {
  loading.value = true;
  try {
    const accessToken = ApiService.getToken();
    const refreshToken = ApiService.getRefreshToken();

    if (!accessToken && !refreshToken) {
      if (!PUBLIC_ROUTES.includes(route.path)) {
        router.push("/login");
      }
      return;
    }

    if (accessToken && !ApiService.checkTokenExpiration()) {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUser({
          role: userInfo.role,
          email: userInfo.email,
          name: userInfo.name,
          rememberMe: localStorage.getItem("rememberMe") || "false",
        });
        setAvatar(userInfo.avatar);
        setMs(userInfo.ms);
        redirectUser(userInfo.role);
        return;
      }
    }

    if (refreshToken) {
      const refreshed = await ApiService.refreshToken();
      if (refreshed) {
        const userInfo = await getUserInfo();
        if (userInfo) {
          setUser({
            role: userInfo.role,
            email: userInfo.email,
            name: userInfo.name,
            rememberMe: localStorage.getItem("rememberMe") || "false",
          });
          redirectUser(userInfo.role);
          return;
        }
      } else {
        ApiService.clearAuthData();
        if (!PUBLIC_ROUTES.includes(route.path)) {
          router.push("/login");
        }
      }
    } else {
      ApiService.clearAuthData();
      if (!PUBLIC_ROUTES.includes(route.path)) {
        router.push("/login");
      }
    }
  } catch (error) {
    console.error("Auto-login failed:", error);
    showError("Authentication failed. Please log in again.");
    ApiService.clearAuthData();
    if (!PUBLIC_ROUTES.includes(route.path)) {
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