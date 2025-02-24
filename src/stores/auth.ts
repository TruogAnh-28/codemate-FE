import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserInfo {
  name: string;
  email: string;
  role: string;
  is_email_verified?: boolean;
  rememberMe: string;
}

export const useAuthStore = defineStore('auth', () => {

  const user = ref<UserInfo>({
    name: '',
    email: '',
    role: '',
    is_email_verified: false,
    rememberMe: "false"
  });

  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  const setUser = (userInfo: UserInfo) => {
    user.value = userInfo;

    const storage = userInfo.rememberMe === "true" ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(userInfo));
    storage.setItem('rememberMe', userInfo.rememberMe);
  };

  const setTokens = (accessToken: string, refreshToken: string) => {
    const storage = user.value.rememberMe === "true" ? localStorage : sessionStorage;
    storage.setItem('access_token', accessToken);
    storage.setItem('refresh_token', refreshToken);
  };

  const logout = () => {

    user.value = {
      name: '',
      email: '',
      role: '',
      is_email_verified: false,
      rememberMe: "false"
    };

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('rememberMe');

    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('rememberMe');
  };

  const isAuthenticated = () => {
    const storage = user.value.rememberMe === "true" ? localStorage : sessionStorage;
    return !!storage.getItem('access_token');
  };

  const getUser = () => {
    const getUserInfo = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (getUserInfo) {
      return JSON.parse(getUserInfo);
    }
  };

  return {
    user,
    setUser,
    setTokens,
    logout,
    isAuthenticated,
    getUser
  };
});
