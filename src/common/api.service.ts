import axios, { AxiosError } from "axios";
import { V1_API_URL } from "@/common/config";
import { IResponseData } from "@/modals/apis/response";
import router from "@/router";

// Define routes that don't require authentication
export const PUBLIC_ROUTES = [
  "/login",
  "/",
  "/forgot-password",
  "/reset-password",
];

// Interface defining the structure and methods of the API service
interface ApiService {
  init(): void;
  getToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken: string): void;
  checkTokenExpiration(): boolean;
  clearAuthData(): void;
  handleTokenExpiration(): void;
  refreshToken(): Promise<boolean>;
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

// Flag to track if a token refresh is in progress
let isRefreshing = false;

// Queue to store failed requests that need to be retried after token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process all pending requests in the failed queue
 * @param error - Error object if token refresh failed
 * @param token - New token if refresh was successful
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const ApiService: ApiService = {
  /**
   * Initialize the API service with axios interceptors for handling authentication
   * and token refresh
   */
  init() {
    axios.defaults.baseURL = V1_API_URL;

    // Request interceptor for adding authentication token
    axios.interceptors.request.use(
      async (config) => {
        const url = config.url || "";

        if (!this.isPublicRoute(url)) {
          if (this.checkTokenExpiration()) {
            try {
              await this.refreshToken();
            } catch (error) {
              this.handleTokenExpiration();
              return Promise.reject(new Error("Token refresh failed"));
            }
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

    // Response interceptor for handling token expiration and refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || "";

        if (!this.isPublicRoute(url) && error.response?.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const refreshed = await this.refreshToken();
              if (refreshed) {
                processQueue(null, this.getToken());
                return axios(originalRequest);
              }
            } catch (refreshError) {
              processQueue(new Error("Refresh failed"));
              this.handleTokenExpiration();
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }

          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return axios(originalRequest);
          });
        }
        return Promise.reject(error);
      }
    );
  },

  /**
   * Check if the given URL is a public route that doesn't require authentication
   * @param url - URL to check
   * @returns boolean indicating if the URL is public
   */
  isPublicRoute(url: string): boolean {
    return PUBLIC_ROUTES.some((route) => url.includes(route));
  },

  /**
   * Get the current access token from storage based on remember me preference
   * @returns Access token or null if not found
   */
  getToken(): string | null {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      return localStorage.getItem("access_token");
    } else {
      return sessionStorage.getItem("access_token");
    }
  },

  /**
   * Get the current refresh token from storage based on remember me preference
   * @returns Refresh token or null if not found
   */
  getRefreshToken(): string | null {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      return localStorage.getItem("refresh_token");
    } else {
      return sessionStorage.getItem("refresh_token");
    }
  },

  /**
   * Save access and refresh tokens to appropriate storage based on remember me preference
   * @param accessToken - New access token
   * @param refreshToken - New refresh token
   */
  setTokens(accessToken: string, refreshToken: string): void {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("access_token", accessToken);
    storage.setItem("refresh_token", refreshToken);
  },

  /**
   * Attempt to refresh the access token using the refresh token
   * @returns Promise resolving to boolean indicating success
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await axios.post<
        IResponseData<{ access_token: string }>
      >("/auth/refresh-token", {
        refresh_token: refreshToken,
      });

      if (response.data.data?.access_token) {
        this.setTokens(response.data.data.access_token, refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  },

  /**
   * Check if the current access token has expired
   * @returns boolean indicating if token has expired
   */
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

  /**
   * Clear all authentication related data from storage
   */
  clearAuthData(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("role");
    localStorage.removeItem("rememberMe");
  },

  /**
   * Handle token expiration by redirecting to login and clearing auth data
   */
  handleTokenExpiration(): void {
    if (router.currentRoute.value.path !== "/login") {
      sessionStorage.setItem("redirectUrl", router.currentRoute.value.fullPath);
      this.clearAuthData();
      alert("Your session has expired. Please log in again.");
      router.push("/login");
    }
  },

  /**
   * Make a GET request with query parameters
   * @param resource - API endpoint
   * @param params - Query parameters
   * @param showError - Error callback
   * @param showSuccess - Success callback
   */
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

  /**
   * Make a GET request to fetch a specific resource
   * @param resource - API endpoint
   * @param slug - Resource identifier
   * @param showError - Error callback
   * @param showSuccess - Success callback
   */
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

  /**
   * Make a POST request to create a new resource
   * @param resource - API endpoint
   * @param params - Request body
   * @param showError - Error callback
   * @param showSuccess - Success callback
   */
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

  /**
   * Make a PUT request to update a specific resource
   * @param resource - API endpoint
   * @param slug - Resource identifier
   * @param params - Request body
   * @param showError - Error callback
   * @param showSuccess - Success callback
   */
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

  /**
   * Make a PUT request to update a resource
   * @param resource - API endpoint
   * @param params - Request body
   * @param showError - Error callback
   * @param showSuccess - Success callback
   */
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

  /**
   * Make a DELETE request to remove a resource
   * @param resource - API endpoint
   * @param showError - Error callback
   * @param showSuccess - Success callback
   */
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

  /**
   * Handle API errors and trigger appropriate callbacks
   * @param error - Axios error object
   * @param showError - Error callback
   */
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

// Timer for checking token expiration
let expirationTimer: number;

/**
 * Start the token expiration check timer
 */
export const startExpirationTimer = () => {
  if (expirationTimer) {
    clearInterval(expirationTimer);
  }

  if (!ApiService.isPublicRoute(router.currentRoute.value.path)) {
    expirationTimer = window.setInterval(() => {
      if (ApiService.checkTokenExpiration()) {
        ApiService.refreshToken().catch(() => {
          ApiService.handleTokenExpiration();
        });
      }
    }, 60000);
  }
};

/**
 * Manage the token expiration timer based on current route
 */
export const manageExpirationTimer = () => {
  if (ApiService.isPublicRoute(router.currentRoute.value.path)) {
    if (expirationTimer) {
      clearInterval(expirationTimer);
    }
  } else {
    startExpirationTimer();
  }
};

/**
 * Clear the token expiration timer
 */
export const clearExpirationTimer = () => {
  if (expirationTimer) {
    clearInterval(expirationTimer);
  }
};

export default ApiService;
