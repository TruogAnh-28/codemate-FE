import axios, { AxiosError } from "axios";
import { V1_API_URL } from "@/common/config";
import { IResponseData } from "@/modals/apis/response";
import router from "@/router";
export const PUBLIC_ROUTES = [
  "/login",
  "/",
  "/forgot-password",
  "/reset-password",
];
interface ApiService {
  init(): void;
  getToken(): string | null;
  checkTokenExpiration(): boolean;
  clearAuthData(): void;
  handleTokenExpiration(): void;
  isPublicRoute(url: string): boolean;
  query<T, R = IResponseData<T>>(
    resource: string,
    params?: object,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R>;
  get<T, R = IResponseData<T>>(
    resource: string,
    slug?: string,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R>;
  post<T, R = IResponseData<T>>(
    resource: string,
    params: object,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R>;
  update<T, R = IResponseData<T>>(
    resource: string,
    slug: string,
    params: object,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R>;
  put<T, R = IResponseData<T>>(
    resource: string,
    params: object,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R>;
  delete<T, R = IResponseData<T>>(
    resource: string,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R>;
  handleError(error: AxiosError, showError?: (message: string) => void): never;
}

const ApiService: ApiService = {
  init() {
    axios.defaults.baseURL = V1_API_URL;

    axios.interceptors.request.use(
      (config) => {
        const url = config.url || "";

        if (!this.isPublicRoute(url)) {
          if (this.checkTokenExpiration()) {
            this.handleTokenExpiration();
            return Promise.reject(new Error("Token expired"));
          }

          const token = this.getToken();
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const url = error.config?.url || "";

        if (!this.isPublicRoute(url) && error.response?.status === 401) {
          this.handleTokenExpiration();
          return Promise.reject(new Error("Token expired"));
        }
        return Promise.reject(error);
      }
    );
  },

  isPublicRoute(url: string): boolean {
    return PUBLIC_ROUTES.some((route) => url.includes(route));
  },

  getToken(): string | null {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      return localStorage.getItem("access_token");
    } else {
      return sessionStorage.getItem("access_token");
    }
  },

  checkTokenExpiration(): boolean {
    const token = this.getToken();
    if (!token) return true;

    if (this.isPublicRoute(router.currentRoute.value.path) || !token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },

  clearAuthData(): void {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("role");
    localStorage.removeItem("rememberMe");
  },

  handleTokenExpiration(): void {
    if (router.currentRoute.value.path !== "/login") {
      sessionStorage.setItem("redirectUrl", router.currentRoute.value.fullPath);
      this.clearAuthData();
      alert("Your session has expired. Please log in again.");
      router.push("/login");
    }
  },

  query<T, R = IResponseData<T>>(
    resource: string,
    params?: object,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R> {
    return axios
      .get<R>(resource, { params })
      .then((response) => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch((error) => this.handleError(error, showError));
  },

  get<T, R = IResponseData<T>>(
    resource: string,
    slug = "",
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R> {
    return axios
      .get<R>(`${resource}/${slug}`)
      .then((response) => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch((error) => this.handleError(error, showError));
  },

  post<T, R = IResponseData<T>>(
    resource: string,
    params: object,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R> {
    return axios
      .post<R>(`${resource}`, params)
      .then((response) => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch((error) => this.handleError(error, showError));
  },

  update<T, R = IResponseData<T>>(
    resource: string,
    slug: string,
    params: object,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R> {
    return axios
      .put<R>(`${resource}/${slug}`, params)
      .then((response) => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch((error) => this.handleError(error, showError));
  },

  put<T, R = IResponseData<T>>(
    resource: string,
    params: object,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R> {
    return axios
      .put<R>(`${resource}`, params)
      .then((response) => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch((error) => this.handleError(error, showError));
  },

  delete<T, R = IResponseData<T>>(
    resource: string,
    showError?: (message: string) => void,
    showSuccess?: (message: string) => void
  ): Promise<R> {
    return axios
      .delete<R>(resource)
      .then((response) => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch((error) => this.handleError(error, showError));
  },

  handleError(error: AxiosError, showError?: (message: string) => void) {
    const url = error.config?.url || "";
    if (error.message === "Token expired" && !this.isPublicRoute(url)) {
      throw error;
    }

    if (error.response) {
      const responseData = error.response.data as IResponseData<any>;
      const errorMessage = responseData.message || "An unknown error occurred";
      if (showError) {
        showError(`API Error: ${errorMessage}`);
      } else {
        console.error("API Error:", errorMessage);
      }
    } else {
      console.error("Network Error:", error.message);
    }
    throw error;
  },
};

let expirationTimer: number;

export const startExpirationTimer = () => {
  if (expirationTimer) {
    clearInterval(expirationTimer);
  }

  if (!ApiService.isPublicRoute(router.currentRoute.value.path)) {
    expirationTimer = window.setInterval(() => {
      if (ApiService.checkTokenExpiration()) {
        ApiService.handleTokenExpiration();
        clearInterval(expirationTimer);
      }
    }, 60000);
  }
};

export const manageExpirationTimer = () => {
  if (ApiService.isPublicRoute(router.currentRoute.value.path)) {
    if (expirationTimer) {
      clearInterval(expirationTimer);
    }
  } else {
    startExpirationTimer();
  }
};

export const clearExpirationTimer = () => {
  if (expirationTimer) {
    clearInterval(expirationTimer);
  }
};

export default ApiService;
