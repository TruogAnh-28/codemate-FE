<template>
  <v-navigation-drawer
    expand-on-hover
    rail
    class="bg-background dark:bg-background text-text-primary dark:text-text-primary"
  >
    <v-list>
      <v-list-item
        prepend-avatar="@/assets/codemate.png"
        title="CODEMATE"
        class="text-body-large-2 font-bold mb-2 text-text-primary dark:text-text-primary"
      ></v-list-item>
    </v-list>
    <v-divider class="border-border dark:border-border"></v-divider>

    <!-- Student Navigation -->
    <v-list v-if="role === 'student'" density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        value="dashboard"
        :to="'/dashboard'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant text-text-primary dark:text-text-primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-school"
        title="My Courses"
        value="course"
        :to="'/courselist'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant text-text-primary dark:text-text-primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-pie"
        title="My Progress"
        value="progress-tracking"
        :to="'/progress-tracking'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant text-text-primary dark:text-text-primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-calendar"
        title="Schedule"
        value="schedule"
        :to="'/schedule'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant text-text-primary dark:text-text-primary"
      ></v-list-item>
    </v-list>

    <!-- Teacher Navigation -->
    <v-list v-else-if="role === 'professor'" density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Professor Dashboard"
        value="dashboard"
        :to="'/professor-dashboard'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant text-text-primary dark:text-text-primary"
      ></v-list-item>
    </v-list>

    <!-- Admin Navigation -->
    <v-list v-else density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Admin Dashboard"
        value="admin-dashboard"
        :to="'/admin-dashboard'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant text-text-primary dark:text-text-primary"
      ></v-list-item>
      <v-list-item
        :prepend-icon="feedbackManagement"
        title="Feedback Management"
        value="feedback-management"
        :to="'/feedback-management'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant text-text-primary dark:text-text-primary"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-account-group"
        title="User Management"
        value="user-management"
        :to="'/user-management'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant text-text-primary dark:text-text-primary"
      >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import feedbackManagement from "@/assets/icons/feedbackManagement.vue";

const role = computed(() => useAuthStore().getUser().role);
</script>
