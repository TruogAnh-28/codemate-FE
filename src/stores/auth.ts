import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';

interface UserInfo {
  role: string;
  email: string;
  name: string;
  avatar?: string;
  ms?: string;
  rememberMe: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserInfo | null,
    isAuthenticated: false,
  }),

  getters: {
    userRole: (state) => state.user?.role || null,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    userAvatar: (state) => state.user?.avatar || '',
    userMs: (state) => state.user?.ms || '',
  },

  actions: {
    setUser(userInfo: UserInfo) {
      this.user = userInfo;
      this.isAuthenticated = true;

      // Store user info in appropriate storage based on rememberMe flag
      const storage = userInfo.rememberMe === 'true' ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('rememberMe', userInfo.rememberMe);
    },

    setTokens(accessToken: string, refreshToken: string) {
      const rememberMe = this.user?.rememberMe === 'true';
      ApiService.setTokens(accessToken, refreshToken);

      // Also store rememberMe preference
      localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      ApiService.clearAuthData();
      localStorage.removeItem("user");
      sessionStorage.clear();
    },

    checkAuth() {
      // Load user from storage if available
      const userFromLocal = localStorage.getItem('user');
      const userFromSession = sessionStorage.getItem('user');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';

      const userJson = rememberMe ? userFromLocal : userFromSession;

      if (userJson) {
        try {
          this.user = JSON.parse(userJson);
          this.isAuthenticated = true;
        } catch (e) {
          this.user = null;
          this.isAuthenticated = false;
        }
      }
    },
    setAvatar(avatar: string) {
      if (this.user) {
        this.user.avatar = avatar;
      }
    },
    setMs(ms: string) {
      if (this.user) {
        this.user.ms = ms;
      }
    }

  }
});