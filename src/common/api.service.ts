import axios, { AxiosError, AxiosResponse } from "axios";
import { V1_API_URL } from "@/common/config";
import { IResponseData } from "@/modals/apis/response";

interface ApiService {
  init(): void;
  query<T>(resource: string, params?: object): Promise<AxiosResponse<IResponseData<T>>>;
  get<T>(resource: string, slug?: string): Promise<AxiosResponse<IResponseData<T>>>;
  post<T>(resource: string, params: object): Promise<AxiosResponse<IResponseData<T>>>;
  update<T>(
    resource: string,
    slug: string,
    params: object
  ): Promise<AxiosResponse<IResponseData<T>>>;
  put<T>(resource: string, params: object): Promise<AxiosResponse<IResponseData<T>>>;
  delete<T>(resource: string): Promise<AxiosResponse<IResponseData<T>>>;
  handleError(error: AxiosError): never;
}

const ApiService: ApiService = {
  init() {
    axios.defaults.baseURL = V1_API_URL;
  },

  query<T>(resource: string, params?: object): Promise<AxiosResponse<IResponseData<T>>> {
    return axios.get<IResponseData<T>>(resource, { params }).catch(this.handleError);
  },

  get<T>(resource: string, slug = ""): Promise<AxiosResponse<IResponseData<T>>> {
    return axios.get<IResponseData<T>>(`${resource}/${slug}`).catch(this.handleError);
  },

  post<T>(resource: string, params: object): Promise<AxiosResponse<IResponseData<T>>> {
    return axios.post<IResponseData<T>>(`${resource}`, params).catch(this.handleError);
  },

  update<T>(
    resource: string,
    slug: string,
    params: object
  ): Promise<AxiosResponse<IResponseData<T>>> {
    return axios.put<IResponseData<T>>(`${resource}/${slug}`, params).catch(this.handleError);
  },

  put<T>(resource: string, params: object): Promise<AxiosResponse<IResponseData<T>>> {
    return axios.put<IResponseData<T>>(`${resource}`, params).catch(this.handleError);
  },

  delete<T>(resource: string): Promise<AxiosResponse<IResponseData<T>>> {
    return axios.delete<IResponseData<T>>(resource).catch(this.handleError);
  },

  handleError(error: AxiosError) {
    if (error.response) {
      // Extract the message from the response if available
      const responseData = error.response.data as IResponseData<any>;

      if (!responseData.isSuccess) {
        // If API response indicates failure, show the error message from the API response
        const errorMessage = responseData.message || "An unknown error occurred";

        // Inject the showError method to trigger the alert
        const showError = inject("showError") as (message: string) => void;
        if (showError) {
          showError(`API Error: ${errorMessage}`);
        } else {
          console.error("API Error:", errorMessage);
        }
      } else {
        // If isSuccess is true, we handle it as a success
        console.log("API Call Success:", responseData);
      }
    } else {
      // If there's no response (network error or timeout), handle it as a generic error
      console.error("Network Error:", error.message);
    }

    // Rethrow the error so the promise is rejected and can be handled by the caller
    throw error;
  },
};

export default ApiService;
