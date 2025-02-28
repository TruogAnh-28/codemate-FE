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
    // children:[
    //   {
    //     path: "exercise-quiz",
    //     name: "ExerciseQuiz",
    //     component: () => import("@/pages/ExerciseQuiz/index.vue"),
    //     meta: { requiresAuth: true, role: "professor" },
    //   }
    // ]
  },
  {
    path: "/courses/:id/exercise-quiz",
    name: "ExerciseQuiz",
    component: () => import("@/pages/ExerciseQuiz/index.vue"),
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
  {
    path: "/professor-code",
    name: "ProfessorCode",
    component: () => import("@/pages/Code/index.vue"),
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
  
  // Start token expiration timer
  manageExpirationTimer();
  
  // If going to a public route, proceed normally
  if (to.meta.requiresAuth === false || PUBLIC_ROUTES.includes(to.path)) {
    return next();
  }
  
  const accessToken = ApiService.getToken();
  const refreshToken = ApiService.getRefreshToken();
  const authStore = useAuthStore();
  
  // Check if we already have user info in the store
  if (!authStore.isAuthenticated) {
    // Try to restore session from storage
    authStore.checkAuth();
  }
  
  // If no tokens, redirect to login
  if (!accessToken && !refreshToken) {
    if (to.fullPath !== "/" && to.fullPath !== "/login") {
      // Store the intended destination
      sessionStorage.setItem("redirectUrl", to.fullPath);
    }
    return next("/login");
  }
  
  // Check if access token is valid
  if (accessToken && !ApiService.checkTokenExpiration()) {
    
    // Get user info if not already authenticated in store
    if (!authStore.isAuthenticated) {
      try {
        const userInfo = await getUserInfo();
        
        if (userInfo) {
          // Set user in store
          authStore.setUser({
            role: userInfo.role,
            email: userInfo.email,
            name: userInfo.name,
            rememberMe: localStorage.getItem("rememberMe") === "true" ? "true" : "false",
          });
        } else {
          // User info retrieval failed
          throw new Error("Failed to get user info");
        }
      } catch (error) {
        console.error("Error getting user info:", error);
        ApiService.clearAuthData();
        sessionStorage.setItem("redirectUrl", to.fullPath);
        return next("/login");
      }
    }
    
    // Check role-based access
    if (to.meta.role && to.meta.role !== authStore.userRole) {
      const rolePaths: { [key: string]: string } = {
        student: "/dashboard",
        professor: "/professor-dashboard",
        admin: "/admin-dashboard",
      };
      return next(rolePaths[authStore.userRole as string] || "/");
    }
    
    // Allow access to the requested page
    return next();
  }
  
  // If access token is expired or invalid but refresh token exists
  if (refreshToken) {
    try {
      const refreshed = await ApiService.refreshToken();
      if (refreshed) {
        
        // Get user info if not already in store
        if (!authStore.isAuthenticated) {
          const userInfo = await getUserInfo();
          
          if (userInfo) {
            // Set user in store
            authStore.setUser({
              role: userInfo.role,
              email: userInfo.email,
              name: userInfo.name,
              rememberMe: localStorage.getItem("rememberMe") === "true" ? "true" : "false",
            });
          } else {
            throw new Error("Failed to get user info after refresh");
          }
        }
        
        // Check role-based access
        if (to.meta.role && to.meta.role !== authStore.userRole) {
          const rolePaths: { [key: string]: string } = {
            student: "/dashboard",
            professor: "/professor-dashboard",
            admin: "/admin-dashboard",
          };
          return next(rolePaths[authStore.userRole as string] || "/");
        }
        
        // Allow access to the requested page
        return next();
      } else {
        // Refresh token failed
        authStore.logout(); // Use store's logout method instead of just clearing API data
        
        if (to.fullPath !== "/" && to.fullPath !== "/login") {
          sessionStorage.setItem("redirectUrl", to.fullPath);
        }
        
        showError("Your session has expired. Please log in again.");
        return next("/login");
      }
    } catch (error) {
      // Error during refresh
      console.error("Error during token refresh:", error);
      authStore.logout();
      
      if (to.fullPath !== "/" && to.fullPath !== "/login") {
        sessionStorage.setItem("redirectUrl", to.fullPath);
      }
      
      showError("Your session has expired. Please log in again.");
      return next("/login");
    }
  }
  
  // No valid tokens and no refresh token, redirect to login
  authStore.logout();
  
  if (to.fullPath !== "/" && to.fullPath !== "/login") {
    sessionStorage.setItem("redirectUrl", to.fullPath);
  }
  
  return next("/login");
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