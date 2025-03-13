import ApiService from "@/common/api.service";
import { AuthConfig } from "./authenServices";
import { IResponseData } from "@/modals/apis/response";
import { GetAllUsersResponse, CreateUserRequest, CreateUserResponse, GetProfileResponse, CreateUserLogin, UserLoginResponse } from "@/types/User";

interface GetUserParams {
    search_query?: string
    role?: 'student' | 'professor' | 'admin';
    status?: boolean
}

export const usersService = {
    async countUsers({ showError, showSuccess, role }: AuthConfig & { role?: string }) {
        return await ApiService.query<IResponseData<number>>(
            "users/count",
            role ? { role } : undefined,
            { showError, showSuccess }
        );
    },
    async getAllUsers(params?: GetUserParams,
        config: { showError?: (message: string) => void; showSuccess?: (message: string) => void } = {}
    ) {
        const queryParams: Record<string, string | number> = {};
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams[key] = value;
                }
            });
        }

        return ApiService.query<IResponseData<GetAllUsersResponse[]>>(
            "users/admin",
            queryParams,
            {
                showError: config.showError,
                showSuccess: config.showSuccess,
            }
        );
    },
    async createUser(
        request: CreateUserRequest[],
        config: { showError?: (message: string) => void; showSuccess?: (message: string) => void } = {}
    ) {
        return ApiService.post<IResponseData<CreateUserResponse[]>>(
            "users/",
            request,
            {
                showError: config.showError,
                showSuccess: config.showSuccess,
            }
        );
    },
    async getProfile(
        config: { showError?: (message: string) => void; showSuccess?: (message: string) => void } = {}
    ) {
        return ApiService.get<IResponseData<GetProfileResponse>>(
            "users",
            undefined,
            {
                showError: config.showError,
                showSuccess: config.showSuccess,
            }
        );
    },
    async createUserLogin(
        request: CreateUserLogin,
        config: { showError?: (message: string) => void; showSuccess?: (message: string) => void } = {}
    ) {
        return ApiService.post<IResponseData<UserLoginResponse>>(
            "users/user-logs",
            request,
            {
                showError: config.showError,
                showSuccess: config.showSuccess,
            }
        );
    },
    async getUserLogin(
        config: { showError?: (message: string) => void; showSuccess?: (message: string) => void } = {}
    ) {
        return ApiService.get<IResponseData<UserLoginResponse[]>>(
            "users/user-logs",
            undefined,
            {
                showError: config.showError,
                showSuccess: config.showSuccess,
            }
        );
    },
    /**
   * Update user information
   * @param data - The user data to be updated
   * @param config - Configuration for success/error handling
   */
    async updateUser(
        data: {
            name: string;
            fullname: string;
            date_of_birth: string;
            role: "student" | "professor" | "admin";
            avatar?: File; // File to be uploaded
        },
        config: { showError?: (message: string) => void; showSuccess?: (message: string) => void } = {}
    ) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("fullname", data.fullname);
        formData.append("date_of_birth", data.date_of_birth);
        formData.append("role", data.role);

        if (data.avatar) {
            formData.append("file", data.avatar);
        }

        return ApiService.update<IResponseData<boolean>>(
            "users", 
            "", 
            formData, 
            {
                showError: config.showError,
                showSuccess: config.showSuccess,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
}
