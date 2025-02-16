import ApiService from "@/common/api.service";
import { AuthConfig } from "./authenServices";
import { IResponseData } from "@/modals/apis/response";
import { GetAllUsersResponse } from "@/types/User";

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
            "users/",
            queryParams,
            {
                showError: config.showError,
                showSuccess: config.showSuccess,
            }
        );
    }
}