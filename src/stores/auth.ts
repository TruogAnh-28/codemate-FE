import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserInfor {
  name: string;
  email: string;
  role: string;
  rememberMe: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserInfor>({
    name: '',
    email: '',
    role: '',
    rememberMe: "false"
  });
  const token = ref(localStorage.getItem('access_token') || null);

  const setUser = (userInfo: UserInfor) => {
    user.value = userInfo;
    localStorage.setItem('user', JSON.stringify(userInfo));
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('access_token', newToken);
  };

  const logout = () => {
    user.value = {
      name: '',
      email: '',
      role: '',
      rememberMe: "false"
    };
    token.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  return {
    user,
    token,
    setUser,
    setToken,
    logout
  };
});
