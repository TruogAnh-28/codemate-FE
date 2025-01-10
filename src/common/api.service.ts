import axios, { AxiosError } from "axios";
import { V1_API_URL } from "@/common/config";
import { IResponseData } from "@/modals/apis/response";

interface ApiService {
  init(): void;
  getToken(): string | null;
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
        const token = this.getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  },
  getToken(): string | null {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      return localStorage.getItem("access_token");
    } else {
      return sessionStorage.getItem("access_token");
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

export default ApiService;
