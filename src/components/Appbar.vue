<template>
  <v-app-bar class="custom-app-bar" app fixed :elevation="0" color="secondary variant">
    <v-spacer></v-spacer>

    <v-btn icon="mdi-bell-outline" class="mr-2"></v-btn>
    <v-btn icon="mdi-email-box" class="mr-2"></v-btn>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          prepend-avatar="@/assets/codemate.png"
          :title="userInfo?.name"
          :subtitle="userInfo?.email"
          class="cursor-pointer"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-img src="@/assets/codemate.png" cover></v-img>
            </v-avatar>
          </template>
        </v-list-item>
      </template>

      <v-list>
        <v-list-item @click="handleProfile">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleLogout">
          <v-list-item-title class="text-red">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const userInfo = authStore.user;
const showSuccess = inject("showSuccess") as (message: string) => void;
import { nextTick } from "vue";

const handleLogout = async () => {
  const authStore = useAuthStore();
  authStore.logout();
  await nextTick();
  router.push("/login");
  showSuccess("Logged out successfully");
};

const handleProfile = () => {
  // router.push("/profile");
};
</script>

<style scoped>
.custom-app-bar {
  position: fixed !important;
  top: 0 !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
