import ApiService from "@/common/api.service";
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
export const authenService = {
  async loginWithGoogle(
    showError: (message: string) => void,
    request: LoginWithGoogleRequest
  ) {
    try {
      const response = await ApiService.post<any>(
        "auth/google-login",
        request,
        showError
      );
      if (response && response.isSuccess) {
        return response;
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError(error as unknown as string);
      return null;
    }
  },
  async loginWithEmail(
    showError: (message: string) => void,
    request: LoginWithEmailRequest
  ) {
    try {
      const response = await ApiService.post<
        LoginRequestVerifyEmail | LoginSuccessResponse
      >("auth/login", request, showError);
      if (response && response.isSuccess) {
        return response;
      }
    } catch (error) {
      showError(error as unknown as string);
      return null;
    }
  },
  async verifyEmail(
    showError: (message: string) => void,
    request: VerifyEmailRequest
  ) {
    try {
      const response = await ApiService.post<VerifyEmailResponse>(
        "auth/verify-email",
        request,
        showError
      );
      if (response && response.isSuccess) {
        return response;
      }
    } catch (error) {
      showError(error as unknown as string);
      return null;
    }
  },
  async resendVerifyEmail(showError: (message: string) => void, email: string) {
    try {
      const response = await ApiService.post<VerifyEmailResponse>(
        "auth/resend-verification-code",
        { email },
        showError
      );
      if (response && response.isSuccess) {
        return response;
      }
    } catch (error) {
      showError(error as unknown as string);
      return null;
    }
  },
  async forgotPassword(showError: (message: string) => void, email: string) {
    try {
      const response = await ApiService.post<ForgotPasswordResponse>(
        "auth/forgot-password",
        { email },
        showError
      );
      if (response && response.isSuccess) {
        return response;
      }
    } catch (error) {
      showError(error as unknown as string);
      return null;
    }
  },
  async resetPassword(
    showError: (message: string) => void,
    request: ResetPasswordRequest
  ) {
    try {
      const response = await ApiService.post<ResetPasswordResponse>(
        "auth/reset-password",
        request,
        showError
      );
      if (response && response.isSuccess) {
        return response;
      }
    } catch (error) {
      showError(error as unknown as string);
      return null;
    }
  },
  async protected(showError: (message: string) => void) {
    try {
      const response = await ApiService.get<any>("auth/protected");
      if (response && response.isSuccess) {
        return response;
      }
    } catch (error) {
      showError(error as unknown as string);
      return null;
    }
  }
};
