import ApiService from "@/common/api.service";
import { AuthConfig } from "./authenServices";
import { IResponseData } from "@/modals/apis/response";
import { GetAllUsersResponse, CreateUserRequest, CreateUserResponse, GetProfileResponse, CreateUserLogin, UserLoginResponse } from "@/types/User";
import { get } from "node_modules/axios/index.cjs";

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
    }
}
