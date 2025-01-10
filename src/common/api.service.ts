import axios, { AxiosError } from "axios";
import { V1_API_URL } from "@/common/config";
import { IResponseData } from "@/modals/apis/response";

interface ApiService {
  init(): void;

  // Make the return type generic to allow flexibility in response structure
  query<T, R = IResponseData<T>>(resource: string, params?: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R>;

  get<T, R = IResponseData<T>>(resource: string, slug?: string, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R>;

  post<T, R = IResponseData<T>>(resource: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R>;

  update<T, R = IResponseData<T>>(resource: string, slug: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R>;

  put<T, R = IResponseData<T>>(resource: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R>;

  delete<T, R = IResponseData<T>>(resource: string, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R>;

  handleError(error: AxiosError, showError?: (message: string) => void): never;
}

const ApiService: ApiService = {
  init() {
    axios.defaults.baseURL = V1_API_URL;
  },

  query<T, R = IResponseData<T>>(resource: string, params?: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R> {
    return axios.get<R>(resource, { params })
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data; // The response is typed as `R`, which can be IResponseData or any other shape
      })
      .catch(error => this.handleError(error, showError));
  },

  get<T, R = IResponseData<T>>(resource: string, slug = "", showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R> {
    return axios.get<R>(`${resource}/${slug}`)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data; // The response is typed as `R`, which can be IResponseData or any other shape
      })
      .catch(error => this.handleError(error, showError));
  },

  post<T, R = IResponseData<T>>(resource: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R> {
    return axios.post<R>(`${resource}`, params)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data; // The response is typed as `R`, which can be IResponseData or any other shape
      })
      .catch(error => this.handleError(error, showError));
  },

  update<T, R = IResponseData<T>>(resource: string, slug: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R> {
    return axios.put<R>(`${resource}/${slug}`, params)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data; // The response is typed as `R`, which can be IResponseData or any other shape
      })
      .catch(error => this.handleError(error, showError));
  },

  put<T, R = IResponseData<T>>(resource: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R> {
    return axios.put<R>(`${resource}`, params)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data; // The response is typed as `R`, which can be IResponseData or any other shape
      })
      .catch(error => this.handleError(error, showError));
  },

  delete<T, R = IResponseData<T>>(resource: string, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<R> {
    return axios.delete<R>(resource)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data; // The response is typed as `R`, which can be IResponseData or any other shape
      })
      .catch(error => this.handleError(error, showError));
  },

  handleError(error: AxiosError, showError?: (message: string) => void) {
    if (error.response) {
      const responseData = error.response.data as IResponseData<any>;  // Using 'any' for flexibility in error response
      const errorMessage = responseData.message || "An unknown error occurred";
      if (showError) {
        showError(`API Error: ${errorMessage}`);
      } else {
        console.error("API Error:", errorMessage);
      }
    } else {
      console.error("Network Error:", error.message);
    }
    throw error; // Always rethrow the error
  },
};

export default ApiService;
