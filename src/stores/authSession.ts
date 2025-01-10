import { defineStore } from 'pinia';
import { UserInfor } from './auth';

interface AuthSessionState {
  token: string | null;
  user: UserInfor | null;
}

export const useAuthSessionStore = defineStore('authSession', {
  state: (): AuthSessionState => ({
    token: sessionStorage.getItem('access_token') || null,
    user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  }),

  actions: {
    setAuthSession(token: string, user: UserInfor) {
      this.token = token;
      this.user = user;

      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    },

    clearAuthSession() {
      this.token = null;
      this.user = null;

      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user');
    },

    isAuthenticated() {
      return this.token !== null && this.user !== null;
    },
  },
});
