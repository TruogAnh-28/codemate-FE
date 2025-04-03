<template>
  <v-app-bar
    class="custom-app-bar"
    app
    fixed
    :elevation="2"
    :style="{
      background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
    }"
  >
    <v-spacer></v-spacer>

    <!-- Notification Bell -->
    <v-btn
      icon="mdi-bell-outline"
      class="mr-2"
      :color="`hsl(var(--on-secondary))`"
      variant="text"
    ></v-btn>

    <!-- Email Icon -->
    <v-btn
      icon="mdi-email-outline"
      class="mr-2"
      :color="`hsl(var(--on-secondary))`"
      variant="text"
    ></v-btn>

    <!-- User Menu -->
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          :prepend-avatar="user?.avatar"
          :title="userInfo?.name"
          :subtitle="userInfo?.email"
          class="cursor-pointer pa-2"
          :style="{ color: 'hsl(var(--on-secondary))' }"
        >
          <template v-slot:prepend>
            <v-avatar size="36" class="avatar-border">
              <v-img :src="user?.avatar" cover></v-img>
            </v-avatar>
          </template>
        </v-list-item>
      </template>

      <v-list
        :style="{ background: 'hsl(var(--surface))', color: 'hsl(var(--on-surface))' }"
        rounded="lg"
      >
        <v-list-item @click="handleProfile" class="hover-item">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleLogout" class="hover-item">
          <v-list-item-title :style="{ color: 'hsl(var(--error))' }">
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.custom-app-bar {
  border-bottom: 1px solid hsl(var(--border));
}

.avatar-border {
  border: 2px solid hsl(var(--surface));
  transition: transform 0.3s ease;
}

.avatar-border:hover {
  transform: scale(1.1);
}

.cursor-pointer {
  cursor: pointer;
}

.custom-app-bar {
  position: fixed !important;
  top: 0 !important;
}

.hover-item:hover {
  background-color: hsl(var(--input));
  transition: background-color 0.2s ease;
}

.v-list-item-title {
  font-weight: 500;
}
</style>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore;
const router = useRouter();

const { logout, user } = authStore.getState();
const userInfo = user;
const showSuccess = inject("showSuccess") as (message: string) => void;
import { nextTick } from "vue";

const handleLogout = async () => {
  logout();
  await nextTick();
  router.push("/login");
  showSuccess("Logged out successfully");
};

const handleProfile = (event: MouseEvent | KeyboardEvent) => {
  const newEmail = userInfo?.email || "";
  const newRole = userInfo?.role || "";
  router.push({ path: "/profile", query: { email: newEmail, role: newRole } });
};
onMounted(() => {
  console.log("User Info:", userInfo);
})
</script>
