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
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/add-user",
    name: "AddUser",
    component: () => import("@/pages/UserManagement/AddUser.vue"),
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },
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

const isValidToken = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    return tokenData.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

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

// Update the router.beforeEach to work with our new auto-login mechanism
router.beforeEach(async (to, from, next) => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const refreshToken =
    localStorage.getItem("refresh_token") ||
    sessionStorage.getItem("refresh_token");
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  const role = user ? JSON.parse(user).role : null;

  // Always allow access to public routes
  if (PUBLIC_ROUTES.includes(to.path)) {
    return next();
  }

  // If we have a refresh token but no valid access token, try to refresh
  if ((!token || !isValidToken(token)) && refreshToken) {
    const refreshed = await ApiService.refreshToken();

    // If refresh was unsuccessful, redirect to login
    if (!refreshed) {
      sessionStorage.setItem("redirectUrl", to.fullPath);
      return next("/login");
    }
  }

  // Re-check token after possible refresh
  const currentToken = ApiService.getToken();

  // If we still don't have a valid token, redirect to login
  if (!currentToken || !isValidToken(currentToken)) {
    sessionStorage.setItem("redirectUrl", to.fullPath);
    return next("/login");
  }

  // Check role-based access
  if (to.meta.role && to.meta.role !== role) {
    switch (role) {
      case "admin":
        return next("/admin-dashboard");
      case "professor":
        return next("/professor-dashboard");
      case "student":
        return next("/dashboard");
      default:
        return next("/login");
    }
  }

  // Start token expiration timer
  manageExpirationTimer();
  next();
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
