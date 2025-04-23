import ApiService from "@/common/api.service";
import { AuthConfig } from "./authenServices";
import { IResponseData } from "@/modals/apis/response";
import {
    UpcomingEvent,

} from "@/types/Dashboard";

export const scheduleService = {
    async fetchSchedule(
      { showError, showSuccess }: AuthConfig,
    ) {
      return await ApiService.get<IResponseData<UpcomingEvent[]>>(
        `schedule/events`,
        "",
        { showError, showSuccess }
      );
    },
  };
  