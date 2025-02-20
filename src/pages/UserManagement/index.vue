<template>
  <v-layout class="bg-gray-50">
    <v-main class="px-6 py-8">
      <!-- Header Section -->
      <div class="mx-auto mb-6 max-w-7xl">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h4 font-weight-bold">User Management</h1>
          <div class="d-flex align-center gap-4">
            <v-btn
              @click="showFilters = !showFilters"
              :color="activeFiltersCount > 0 ? 'primary' : undefined"
              variant="tonal"
              class="rounded-lg"
            >
              <v-icon start>mdi-filter</v-icon>
              Filters
              <v-badge
                v-if="activeFiltersCount > 0"
                :content="activeFiltersCount"
                color="primary"
                class="ml-2"
              ></v-badge>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <v-expand-transition>
        <v-card
          v-if="showFilters"
          class="mb-6 max-w-7xl mx-auto rounded-xl"
          elevation="1"
        >
          <v-card-text class="py-6">
            <v-row class="gap-6">
              <!-- Search Filter -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="debouncedSearchQuery"
                  label="Search"
                  placeholder="Search by MASO or email"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="rounded-lg"
                ></v-text-field>
              </v-col>

              <!-- Role Filter -->
              <v-col cols="12" md="4">
                <v-select
                  v-model="filters.role"
                  :items="roleOptions"
                  label="Role"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="rounded-lg"
                ></v-select>
              </v-col>

              <!-- Status Filter and Actions -->
              <v-col cols="12" md="4">
                <div class="d-flex gap-4">
                  <v-select
                    v-model="filters.status"
                    :items="statusOptions"
                    label="Status"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    class="rounded-lg flex-grow-1"
                  ></v-select>
                  <div class="d-flex align-end gap-2">
                    <v-btn
                      color="primary"
                      @click="applyFilters"
                      :loading="loading"
                      min-width="100"
                    >
                      Apply
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      @click="resetFilters"
                      :disabled="loading"
                      min-width="100"
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
      <v-card class="max-w-7xl mx-auto rounded-xl" elevation="1">
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          class="elevation-0"
        >
          <template v-slot:item.role="{ item }">
            <v-chip
              :color="getRoleColor(item.role)"
              variant="outlined"
              size="small"
              class="font-weight-medium text-capitalize"
            >
              {{ item.role }}
            </v-chip>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status ? 'success' : 'error'"
              variant="outlined"
              size="small"
              class="font-weight-medium"
            >
              {{ item.status ? "Active" : "Inactive" }}
            </v-chip>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-4">No users found</div>
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

const users = ref<GetAllUsersResponse[]>([]);
const loading = ref(false);
const showFilters = ref(false);

interface Filters {
  search_query?: string;
  role?: "student" | "professor" | "admin" | "";
  status?: boolean;
}

const filters = ref<Filters>({
  search_query: "",
  role: "",
  status: undefined,
});

// Create a debounced search query
const debouncedSearchQuery = debounce.useDebounce("", 500);

// Watch for changes in the debounced search query
watch(debouncedSearchQuery, (newValue) => {
  filters.value.search_query = newValue;
  fetchUsers();
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
  debouncedSearchQuery.value = "";
  filters.value = {
    search_query: "",
    role: "",
    status: undefined,
  };
  fetchUsers();
};

const applyFilters = () => {
  fetchUsers();
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

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
:deep(.v-data-table) {
  border-radius: 12px;
}

:deep(.v-data-table__thead) {
  background-color: rgb(249, 250, 251);
}

:deep(.v-data-table__thead th) {
  font-weight: 600 !important;
  text-transform: none !important;
  white-space: nowrap;
}

:deep(.v-data-table-footer) {
  background-color: rgb(249, 250, 251);
}
</style>
