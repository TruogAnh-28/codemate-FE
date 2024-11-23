import axios, { AxiosError } from "axios";
import { V1_API_URL } from "@/common/config";
import { IResponseData } from "@/modals/apis/response";

interface ApiService {
  init(): void;
  query<T>(resource: string, params?: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>>;
  get<T>(resource: string, slug?: string, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>>;
  post<T>(resource: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>>;
  update<T>(resource: string, slug: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>>;
  put<T>(resource: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>>;
  delete<T>(resource: string, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>>;
  handleError(error: AxiosError, showError?: (message: string) => void): never;
}

const ApiService: ApiService = {
  init() {
    axios.defaults.baseURL = V1_API_URL;
  },

  query<T>(resource: string, params?: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>> {
    return axios.get<IResponseData<T>>(resource, { params })
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch(error => this.handleError(error, showError));
  },

  get<T>(resource: string, slug = "", showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>> {
    return axios.get<IResponseData<T>>(`${resource}/${slug}`)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch(error => this.handleError(error, showError));
  },

  post<T>(resource: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>> {
    return axios.post<IResponseData<T>>(`${resource}`, params)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch(error => this.handleError(error, showError));
  },

  update<T>(resource: string, slug: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>> {
    return axios.put<IResponseData<T>>(`${resource}/${slug}`, params)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch(error => this.handleError(error, showError));
  },

  put<T>(resource: string, params: object, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>> {
    return axios.put<IResponseData<T>>(`${resource}`, params)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch(error => this.handleError(error, showError));
  },

  delete<T>(resource: string, showError?: (message: string) => void, showSuccess?: (message: string) => void): Promise<IResponseData<T>> {
    return axios.delete<IResponseData<T>>(resource)
      .then(response => {
        if (showSuccess) showSuccess("API request was successful!");
        return response.data;
      })
      .catch(error => this.handleError(error, showError));
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
