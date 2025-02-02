import { defineStore } from "pinia";

export const useResetPasswordEmailStore = defineStore("resetPasswordEmail", {
  state: () => ({
    email: "",
    code: "",
    password: "",
  }),
  actions: {
    setEmail(email: string) {
      this.email = email;
    },
    setCode(code: string) {
      this.code = code;
    },
    setPassword(password: string) {
      this.password = password;
    },
    clearAll() {
      this.email = "";
      this.code = "";
      this.password = "";
    },
  },
});
