<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="!expanded"
    @mouseenter="handleExpand(true)"
    @mouseleave="handleExpand(false)"
    permanent
    elevation="1"
    class="sidebar-navigation bg-background dark:bg-background text-text-primary dark:text-text-primary"
  >
    <div class="d-flex flex-column h-100">
      <!-- Fixed Header -->
      <div class="flex-grow-0">
        <v-list>
          <v-list-item
            prepend-avatar="@/assets/codemate.png"
            title="CODEMATE"
            class="text-body-large-2 font-bold mb-2 text-text-primary dark:text-text-primary"
          ></v-list-item>
        </v-list>
        <v-divider class="border-border dark:border-border"></v-divider>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-grow-1 overflow-y-auto">
        <v-list density="compact" nav>
          <template v-for="item in filteredNavigationItems" :key="item.value">
            <!-- For items with children -->
            <v-list-group v-if="item.children" :value="item.value">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="item.icon"
                  :title="item.title"
                ></v-list-item>
              </template>

              <v-list-item
                v-for="child in item.children"
                :key="child.value"
                :value="child.value"
                :prepend-icon="child.icon"
                :title="child.title"
                :to="child.to"
                class="pl-4"
              ></v-list-item>
            </v-list-group>

            <!-- For items without children -->
            <v-list-item
              v-else
              :prepend-icon="item.icon"
              :title="item.title"
              :value="item.value"
              :to="item.to"
            ></v-list-item>
          </template>
        </v-list>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import feedbackManagement from "@/assets/icons/feedbackManagement.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "expand", value: boolean): void;
}>();

const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const expanded = ref(false);
const role = computed(() => useAuthStore().userRole);

const handleExpand = (value: boolean) => {
  expanded.value = value;
  emit("expand", value);
};

interface NavigationItem {
  icon: string | typeof feedbackManagement;
  title: string;
  value: string;
  to?: string;
  children?: NavigationItem[];
}

const studentItems: NavigationItem[] = [
  {
    icon: "mdi-view-dashboard",
    title: "Dashboard",
    value: "dashboard",
    to: "/dashboard",
  },
  { icon: "mdi-school", title: "My Courses", value: "course", to: "/courselist" },
  {
    icon: "mdi-chart-pie",
    title: "My Progress",
    value: "progress-tracking",
    to: "/progress-tracking",
  },
  // { icon: "mdi-calendar", title: "Schedule", value: "schedule", to: "/schedule" },
];

const professorItems: NavigationItem[] = [
  {
    icon: "mdi-view-dashboard",
    title: "Professor Dashboard",
    value: "dashboard",
    to: "/professor-dashboard",
  },
  {
    icon: "mdi-school",
    title: "My Courses",
    value: "courselist",
    to: "/professor-courselist",
  },
  {
    icon: feedbackManagement,
    title: "Feedback Management",
    value: "professor-feedback",
    to: "/professor-feedback",
  },
  {
    icon: "mdi-chart-pie",
    title: "Progress",
    value: "professor-progress",
    to: "/professor-progress",
  },
];

const adminItems: NavigationItem[] = [
  {
    icon: "mdi-view-dashboard",
    title: "Admin Dashboard",
    value: "admin-dashboard",
    to: "/admin-dashboard",
  },
  {
    icon: feedbackManagement,
    title: "Feedback Management",
    value: "feedback-management",
    to: "/feedback-management",
  },
  {
    icon: "mdi-account-group",
    title: "User Management",
    value: "user-management",
    to: "/user-management",
  },
  {
    icon: "mdi-code-tags",
    title: "Course Management",
    value: "course-management",
    to: "/course-management",
  },
  {
    icon: "mdi-cog",
    title: "Settings",
    value: "settings",
    children: [
      {
        icon: "mdi-account-cog",
        title: "Add User",
        value: "add-user",
        to: "/add-user",
      },
      {
        icon: "mdi-account-details",
        title: "Add Course",
        value: "add-course",
        to: "/add-course",
      },
    ],
  },
  {
    icon: "mdi-chart-pie",
    title: "Statistics",
    value: "statistics",
    children: [
      {
        icon: "mdi-chart-bar",
        title: "Feedback Statistics",
        value: "feedback-statistics",
        to: "/feedback-statistics",
      },
      {
        icon: "mdi-chart-line",
        title: "System Usage Statistics",
        value: "system-usage-statistics",
        to: "/system-usage-statistics",
      },
    ],
  },
];

// Add a computed property to filter navigation items based on role
const filteredNavigationItems = computed(() => {
  switch (role.value) {
    case "student":
      return studentItems;
    case "professor":
      return professorItems;
    case "admin":
      return adminItems;
    default:
      return [];
  }
});
</script>

<style scoped>
.sidebar-navigation {
  height: 100vh !important;
  position: fixed !important;
  z-index: 100;
}

:deep(.v-navigation-drawer__content) {
  height: 100vh !important;
  overflow: hidden !important;
}

.overflow-y-auto {
  overflow-y: auto !important;
  height: calc(100vh - 80px) !important;
}

:deep(.v-navigation-drawer--rail) {
  width: 80px !important;
}

:deep(.v-navigation-drawer) {
  width: 256px !important;
}

/* Optional: Custom scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
