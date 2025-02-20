import ApiService from "@/common/api.service";
import { AuthConfig } from "@/services/authenServices";
import {
    GetDashboardProfessorResponse,

} from "@/types/Dashboard";
export const dashboardService = {
    async fetchDashboardProfessor({ showError, showSuccess }: AuthConfig) {
        return await ApiService.query<GetDashboardProfessorResponse>(
            "dashboard/professors",
            { showError, showSuccess }
        );
    },
};
