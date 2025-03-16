<template>
  <v-layout class="bg-background">
    <v-main class="px-6 py-8">
      <!-- Header Section -->
      <div class="mx-auto mb quince8 max-w-7xl animate-fade-in">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h4 font-weight-bold transition-all gradient-text">
            User Management
          </h1>
          <div class="d-flex align-center gap-4">
            <v-btn
              @click="toggleFilters"
              :color="activeFiltersCount > 0 ? 'primary' : 'secondary'"
              variant="tonal"
              class="rounded-xl shadow-sm hover-scale"
            >
              <v-icon start>mdi-filter</v-icon>
              Filters
              <v-badge
                v-if="activeFiltersCount > 0"
                :content="activeFiltersCount"
                color="primary"
                class="ml-4 mb-1 bounce-in"
              ></v-badge>
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              :to="'/add-user'"
              class="px-6 rounded-xl shadow-sm hover-scale"
            >
              Add User
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <v-expand-transition>
        <v-card
          v-if="showFilters"
          class="mb-8 max-w-7xl mx-auto rounded-xl bg-surface shadow-md animate-slide-up"
          elevation="0"
        >
          <v-card-text class="py-6">
            <v-row class="gap-6">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filters.search_query"
                  label="Search"
                  placeholder="Search by email"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="rounded-lg input-hover"
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="filters.role"
                  :items="roleOptions"
                  label="Role"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="rounded-lg input-hover"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <div class="d-flex gap-4">
                  <v-select
                    v-model="filters.status"
                    :items="statusOptions"
                    label="Status"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    class="rounded-lg input-hover flex-grow-1"
                  ></v-select>
                  <div class="d-flex align-end gap-2">
                    <v-btn
                      variant="outlined"
                      @click="resetFilters"
                      :disabled="loading"
                      min-width="100"
                      class="rounded-lg shadow-sm hover-scale"
                    >
                      Reset
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-expand-transition>

      <!-- Data Table -->
      <v-card
        class="mt-4 max-w-7xl mx-auto rounded-xl bg-surface shadow-md animate-fade-in"
      >
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          class="elevation-0 table-hover enhanced-table"
          hover
        >
          <template v-slot:item.role="{ item }">
            <v-chip
              :color="getRoleColor(item.role)"
              variant="tonal"
              size="small"
              class="font-weight-medium text-capitalize transition-all hover-chip"
            >
              {{ item.role }}
            </v-chip>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status ? 'success' : 'error'"
              variant="tonal"
              size="small"
              class="font-weight-medium transition-all hover-chip"
            >
              {{ item.status ? "Active" : "Inactive" }}
            </v-chip>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-6 text-text-secondary">
              <v-icon size="48" class="mb-2 animate-pulse"
                >mdi-account-group-outline</v-icon
              >
              <div>No users found</div>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { usersService } from "@/services/usersServices";
import type { GetAllUsersResponse } from "@/types/User";
import debounce from "@/composables/useDebounce";
import "../table.css";

const users = ref<GetAllUsersResponse[]>([]);
const loading = ref(false);
const showFilters = ref(false);

interface Filters {
  search_query: string;
  role: "student" | "professor" | "admin" | "";
  status: boolean | undefined;
}

const filters = ref<Filters>({
  search_query: "",
  role: "",
  status: undefined,
});

const headers: Array<{
  title: string;
  key: string;
  align?: "start" | "center" | "end";
}> = [
  { title: "Name", key: "name", align: "start" },
  { title: "Email", key: "email" },
  { title: "Role", key: "role", align: "center" },
  { title: "Status", key: "status", align: "center" },
];

const roleOptions = [
  { title: "All Roles", value: "" },
  { title: "Student", value: "student" },
  { title: "Professor", value: "professor" },
  { title: "Admin", value: "admin" },
];

const statusOptions = [
  { title: "All Status", value: undefined },
  { title: "Active", value: true },
  { title: "Inactive", value: false },
];

const activeFiltersCount = computed(() => {
  return Object.entries(filters.value).filter(([_, value]) => {
    if (typeof value === "string") return value.length > 0;
    return value !== undefined;
  }).length;
});

const getRoleColor = (role: string) => {
  const colors = {
    student: "primary",
    professor: "purple",
    admin: "warning",
  };
  return colors[role as keyof typeof colors] || "gray";
};

const resetFilters = () => {
  filters.value = {
    search_query: "",
    role: "",
    status: undefined,
  };
  // No need to call fetchUsers here since watch will handle it
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const filterParams = {
      ...Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => {
          if (typeof value === "string") return value.length > 0;
          return value !== undefined;
        })
      ),
    };

    const response = await usersService.getAllUsers(filterParams);
    if (response.data) {
      users.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};

// Debounced fetchUsers function
const debouncedFetchUsers = debounce.useDebounceFn(fetchUsers, 500);

// Watch filters object deeply and apply debounced fetch
watch(
  () => filters.value,
  () => {
    debouncedFetchUsers();
  },
  { deep: true }
);

onMounted(() => {
  fetchUsers(); // Initial fetch without debounce
});

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};
</script>

<style scoped>
/* Your existing styles remain unchanged */
.shadow-sm {
  box-shadow: 0 2px 4px rgba(33, 55, 54, 0.1);
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(33, 55, 54, 0.1);
}

.hover-scale {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-scale:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(33, 55, 54, 0.15);
}

.input-hover {
  transition: all 0.2s ease;
}

.input-hover:hover {
  border-color: var(--primary);
}

.hover-chip {
  transition: all 0.2s ease;
}

.hover-chip:hover {
  filter: brightness(110%);
  transform: translateY(-1px);
}

.table-hover :deep(.v-data-table__tr:hover) {
  background-color: rgba(72, 169, 166, 0.05);
  transition: background-color 0.2s ease;
}

:deep(.v-data-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.v-data-table__thead) {
  background-color: rgba(72, 169, 166, 0.05);
  color: var(--text-primary);
}

:deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  text-transform: none !important;
  white-space: nowrap;
  border-bottom: 2px solid var(--primary) !important;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.bounce-in {
  animation: bounceIn 0.3s ease-out;
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
