/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import { routes as autoRoutes } from "vue-router/auto-routes";
import ApiService, { manageExpirationTimer, PUBLIC_ROUTES } from "@/common/api.service";
import { useAuthStore } from "@/stores/auth";
import { usersService } from "@/services/usersServices";

const LoginRoute = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/layouts/login.vue"),
    meta: { requiresAuth: false },
    children: [
      {
        path: "",
        name: "LoginPage",
        component: () => import("@/pages/Login/index.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: () => import("@/pages/Login/ForgotPassword.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/reset-password",
        name: "ResetPassword",
        component: () => import("@/pages/Login/ResetPassword.vue"),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: "/",
    name: "LandingPage",
    component: () => import("@/pages/index.vue"),
    meta: { requiresAuth: false },
  },
];
const StudentRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/pages/Dashboard/index.vue"),
    meta: { requiresAuth: true, role: "student" },
  },
  {
    path: "/progress-tracking",
    name: "ProgressTracking",
    component: () => import("@/pages/ProgressTracking/index.vue"),
    meta: { requiresAuth: true, role: "student" },
  },
  {
    path: "/courselist",
    name: "CourseList",
    component: () => import("@/pages/Course/CourseList/index.vue"),
    meta: { requiresAuth: true, role: "student" },
  },
  {
    path: "/courselist/course/:id",
    name: "CourseDetail",
    component: () => import("@/pages/Course/CourseDetail/index.vue"),
    props: true,
    meta: { requiresAuth: true, role: "student" },
  },
  {
    path: "/lessonRecommend/:lessonId",
    name: "Lesson",
    component: () => import("@/pages/Lesson/index.vue"),
    props: true,
    meta: { requiresAuth: true, role: "student" },
    children: [
      {
        path: "",
        name: "LessonRecommend",
        component: () => import("@/pages/Lesson/LessonRecommend/index.vue"),
        props: true,
        meta: { requiresAuth: true, role: "student" },
      },
      {
        path: "Module/:moduleId/Quiz",
        name: "LessonRecommendQuiz",
        component: () => import("@/pages/Lesson/Quiz/index.vue"),
        props: true,
        meta: { requiresAuth: true, role: "student" },
      },
      {
        path: "Module/:moduleId/Quiz/:quizId",
        name: "LessonRecommendDoQuiz",
        component: () => import("@/pages/Lesson/DoQuiz/index.vue"),
        props: true,
        meta: { requiresAuth: true, role: "student" },
      },
      {
        path: "Module/:moduleId/Code",
        name: "LessonRecommendCode",
        component: () => import("@/pages/Lesson/Code/index.vue"),
        props: true,
        meta: { requiresAuth: true, role: "student" },
      },
      {
        path: "Module/:moduleId/Document",
        name: "LessonRecommendDocument",
        component: () => import("@/pages/Lesson/Document/index.vue"),
        props: true,
        meta: { requiresAuth: true, role: "student" },
      },
    ],
  },
];
const AdminRoutes = [
  {
    path: "/admin-dashboard",
    name: "AdminDashboard",
    component: () => import("@/pages/Dashboard/Admin.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/feedback-management",
    name: "FeedbackManagement",
    component: () => import("@/pages/FeedbackManagement/index.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/user-management",
    name: "UserManagement",
    component: () => import("@/pages/UserManagement/index.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/course-management",
    name: "CourseManagement",
    component: () => import("@/pages/CourseManagement/index.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/add-course",
    name: "AddCourse",
    component: () => import("@/pages/CourseManagement/AddCourse.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/add-user",
    name: "AddUser",
    component: () => import("@/pages/UserManagement/AddUser.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/feedback-statistics",
    name: "FeedbackStatistics",
    component: () => import("@/pages/FeedbackManagement/FeedbackStatistics.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/system-usage-statistics",
    name: "SystemUsageStatistics",
    component: () => import("@/pages/SystemUsageManagement/index.vue"),
    meta: { requiresAuth: true, role: "admin" },
  }
];
const ProfessorRoutes = [
  {
    path: "/professor-dashboard",
    name: "ProfessorDashboard",
    component: () => import("@/pages/Dashboard/Professor.vue"),
    meta: { requiresAuth: true, role: "professor" },
  },
  {
    path: "/professor-courselist",
    name: "ProfessorCourseList",
    component: () => import("@/pages/Course/CourseList/Professor.vue"),
    meta: { requiresAuth: true, role: "professor" },
  },
  {
    path: "/professor-courselist/course/:id",
    name: "ProfessorCourseDetail",
    component: () => import("@/pages/Course/CourseDetail/Professor.vue"),
    props: true,
    meta: { requiresAuth: true, role: "professor" },
  },
  {
    path: "/professor-feedback",
    name: "ProfessorFeedback",
    component: () => import("@/pages/FeedbackManagement/Professor.vue"),
    meta: { requiresAuth: true, role: "professor" },
  },
  {
    path: "/professor-progress",
    name: "ProfessorProgress",
    component: () => import("@/pages/ProgressTracking/Professor.vue"),
    meta: { requiresAuth: true, role: "professor" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...LoginRoute,
    ...setupLayouts([
      ...autoRoutes,
      ...StudentRoutes,
      ...AdminRoutes,
      ...ProfessorRoutes,
    ]),
  ],
});

const showError = (msg: string) => alert(msg);

// Function to get user profile
const getUserInfo = async () => {
  try {
    const response = await usersService.getProfile({
      showError,
      showSuccess: (msg: string) => alert(msg)
    });
    if (response && "data" in response) {
      return response.data ?? undefined;
    }
  } catch (error) {
    showError("Failed to get user info.");
  }
  return undefined;
};

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const accessToken = ApiService.getToken();
  const refreshToken = ApiService.getRefreshToken();
  const isToPublic = PUBLIC_ROUTES.includes(to.path);
  const isFromPublic = PUBLIC_ROUTES.includes(from.path);
  console.log("isToPublic", to.path, "isFromPublic", from.path);

  if (isToPublic && isFromPublic && !((to.path === "/") && (from.path === "/"))) {
    console.log("isToPublic && isFromPublic");
    return next();
  }

  else if ((!isToPublic && isFromPublic) || (isToPublic && isFromPublic && ((to.path === "/") && (from.path === "/")))) {
    if (!authStore.isAuthenticated) {
      authStore.checkAuth();
    }
    if (!accessToken || !authStore.isAuthenticated) {
      sessionStorage.setItem("redirectUrl", to.fullPath);
      return next("/login");
    }
    if ((to.meta.role && to.meta.role !== authStore.userRole) || (!to.meta.role && authStore.userRole)) {
      console.log("check 3", to.meta.role, authStore.userRole)
      const rolePaths = {
        student: "/dashboard",
        professor: "/professor-dashboard",
        admin: "/admin-dashboard",
      };
      return next(rolePaths[authStore.userRole as keyof typeof rolePaths] || "/");
    }
    const redirectUrl = sessionStorage.getItem("redirectUrl");
    if (redirectUrl) {
      sessionStorage.removeItem("redirectUrl");
      return next(redirectUrl);
    }
    return next();
  }

  else if (isToPublic && !isFromPublic) {
    if (accessToken || authStore.isAuthenticated) {
      return next(from.path);
    } else {
      return next();
    }
  }

  else if (!isToPublic && !isFromPublic) {
    if (!accessToken && !refreshToken) {
      sessionStorage.setItem("redirectUrl", to.fullPath);
      return next("/login");
    }
    if (accessToken) {
      if (ApiService.checkTokenExpiration()) {
        try {
          const refreshed = await ApiService.refreshToken();
          if (refreshed) {
            return next();
          } else {
            authStore.logout();
            sessionStorage.setItem("redirectUrl", to.fullPath);
            showError("Your session has expired. Please log in again.");
            return next("/login");
          }
        } catch (error) {
          console.error("Error during token refresh:", error);
          authStore.logout();
          sessionStorage.setItem("redirectUrl", to.fullPath);
          showError("Your session has expired. Please log in again.");
          return next("/login");
        }
      } else {
        if (!authStore.isAuthenticated) {
          try {
            const userInfo = await getUserInfo();
            if (userInfo) {
              authStore.setUser({
                role: userInfo.role,
                email: userInfo.email,
                name: userInfo.name,
                rememberMe: localStorage.getItem("rememberMe") === "true" ? "true" : "false",
              });
            }
          } catch (error) {
            console.error("Error getting user info:", error);
            authStore.logout();
            sessionStorage.setItem("redirectUrl", to.fullPath);
            return next("/login");
          }
        }
        if (to.meta.role && to.meta.role !== authStore.userRole) {
          const rolePaths = {
            student: "/dashboard",
            professor: "/professor-dashboard",
            admin: "/admin-dashboard",
          };
          return next(rolePaths[authStore.userRole as keyof typeof rolePaths] || "/");
        }
        return next();
      }
    }
  }

  return next();
});

router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;