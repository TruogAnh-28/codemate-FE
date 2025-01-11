export interface LoginWithGoogleRequest {
  access_token: string;
  user_info: FetchUserInformationFromGoogleResponse;
}

export interface LoginWithGoogleResponse {
  email: string;
}

export interface FetchUserInformationFromGoogleResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export interface LoginWithEmailRequest {
  email: string;
  password: string;
}
export interface LoginSuccessResponse {
  access_token: string;
  role: string;
  name: string;
  email: string;
  is_email_verified: boolean;
}
export interface LoginRequestVerifyEmail {
  name: string;
  email: string;
  is_email_verified: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
  reset_password?: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
}

export interface VerifyEmailResponse extends LoginRequestVerifyEmail {}

export interface ResendVerifyEmailResponse extends VerifyEmailResponse {}

export interface ForgotPasswordResponse extends LoginRequestVerifyEmail {}

export interface ResetPasswordResponse extends LoginRequestVerifyEmail {}
