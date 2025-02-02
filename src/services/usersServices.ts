import ApiService from "@/common/api.service";
import { AuthConfig } from "./authenServices";
import { IResponseData } from "@/modals/apis/response";
export const usersService = {
    async countUsers({ showError, showSuccess, role }: AuthConfig & { role?: string }) {
        return await ApiService.query<IResponseData<number>>(
            "users/count",
            role ? { role } : undefined,
            { showError, showSuccess }
        );
    },
}