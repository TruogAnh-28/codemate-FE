import ApiService from "@/common/api.service";
import { IResponseData } from "@/modals/apis/response";
import {
  LoginWithGoogleRequest,
  LoginWithEmailRequest,
  LoginRequestVerifyEmail,
  LoginSuccessResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ResetPasswordRequest,
} from "@/types/Auth";

export interface AuthConfig {
  showError: (message: string) => void;
  showSuccess?: (message: string) => void;
}

export const authenService = {
  async loginWithGoogle(
    { showError, showSuccess }: AuthConfig,
    request: LoginWithGoogleRequest
  ) {
    return ApiService.post<IResponseData<LoginSuccessResponse>>(
      "auth/google-login",
      request,
      {
        showError,
        showSuccess,
        parseResponse: (res) => res.data,
      }
    );
  },

  async loginWithEmail(
    { showError, showSuccess }: AuthConfig,
    request: LoginWithEmailRequest
  ) {
    return ApiService.post<IResponseData<LoginRequestVerifyEmail | LoginSuccessResponse>>("auth/login", request, {
      showError,
      showSuccess,
      parseResponse: (res) => res.data,
    });
  },

  async verifyEmail(
    { showError, showSuccess }: AuthConfig,
    request: VerifyEmailRequest
  ) {
    return ApiService.post<IResponseData<VerifyEmailResponse>>("auth/verify-email", request, {
      showError,
      showSuccess,
    });
  },

  async resendVerifyEmail(
    { showError, showSuccess }: AuthConfig,
    email: string
  ) {
    return ApiService.post<IResponseData<VerifyEmailResponse>>(
      "auth/resend-verification-code",
      { email },
      { showError, showSuccess }
    );
  },

  async forgotPassword({ showError, showSuccess }: AuthConfig, email: string) {
    return ApiService.post<IResponseData<ForgotPasswordResponse>>(
      "auth/forgot-password",
      { email },
      { showError, showSuccess }
    );
  },

  async resetPassword(
    { showError, showSuccess }: AuthConfig,
    request: ResetPasswordRequest
  ) {
    return ApiService.post<IResponseData<ResetPasswordResponse>>(
      "auth/reset-password",
      request,
      { showError, showSuccess }
    );
  },

  async protected({ showError, showSuccess }: AuthConfig) {
    return ApiService.get<unknown>("auth/protected", "", {
      showError,
      showSuccess,
    });
  },
};
