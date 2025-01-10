import { defineStore } from 'pinia';
import { ref } from 'vue';

interface UserInfor {
  name: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserInfor>({
    name: '',
    email: '',
    role: ''
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
      role: ''
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
