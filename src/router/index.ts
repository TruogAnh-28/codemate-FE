/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import { routes as autoRoutes } from "vue-router/auto-routes";
import { manageExpirationTimer, PUBLIC_ROUTES } from "@/common/api.service";
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
];
const ProfessorRoutes = [
  {
    path: "/professor-dashboard",
    name: "ProfessorDashboard",
    component: () => import("@/pages/Dashboard/Professor.vue"),
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

router.beforeEach(async (to, from, next) => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  const role = user ? JSON.parse(user).role : null;

  if (PUBLIC_ROUTES.includes(to.path)) {
    return next();
  }

  if (!token || !isValidToken(token)) {
    sessionStorage.setItem("redirectUrl", to.fullPath);
    return next("/login");
  }

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
