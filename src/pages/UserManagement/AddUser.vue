<script lang="ts" setup>
import { usersService } from "@/services/usersServices";
import { ref, inject } from "vue";

interface CreateUserRequest {
  id?: number;
  name: string;
  fullname: string;
  email: string;
  date_of_birth: Date;
  ms: string;
  role: "student" | "professor" | "admin";
}

// State
const users = ref<CreateUserRequest[]>([
  {
    name: "",
    fullname: "",
    email: "",
    date_of_birth: new Date(),
    ms: "",
    role: "student",
  },
]);

const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const searchTerm = ref("");

// Methods
const addNewUser = () => {
  users.value.push({
    name: "",
    fullname: "",
    email: "",
    date_of_birth: new Date(),
    ms: "",
    role: "student",
  });
};

const showSnackbar = (text: string, color: string = "success") => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const handleConfirm = async () => {
  try {
    loading.value = true;

    // Validate data
    const isValid = users.value.every(
      (user) => user.name && user.fullname && user.email && user.ms && user.role
    );

    if (!isValid) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    const formattedUsers = users.value.map((user) => {
      const dateOfBirth = new Date(user.date_of_birth);

      dateOfBirth.setUTCHours(0, 0, 0, 0);

      return {
        ...user,
        date_of_birth: dateOfBirth.toISOString(),
      };
    });

    const response = await usersService.createUser(formattedUsers, {
      showError,
      showSuccess,
    });

    if (response && response.isSuccess) {
      // Reset form after successful submission
      users.value = [
        {
          name: "",
          fullname: "",
          email: "",
          date_of_birth: new Date(),
          ms: "",
          role: "student",
        },
      ];
      showSnackbar("Users created successfully");
    }
  } catch (error) {
    console.error("Error creating users:", error);
    showSnackbar("Failed to create users", "error");
  } finally {
    loading.value = false;
  }
};

const removeUser = (index: number) => {
  users.value.splice(index, 1);
  showSnackbar("User removed");
};
</script>

<template>
  <v-container class="max-w-7xl mx-auto py-8">
    <v-card class="mb-8">
      <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
        <h1 class="text-h4 font-weight-bold">User Management</h1>
        <v-text-field
          v-model="searchTerm"
          prepend-inner-icon="mdi-magnify"
          label="Search users"
          density="compact"
          hide-details
          class="max-w-xs"
        ></v-text-field>
      </v-card-title>

      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(user, index) in users"
            :key="index"
            :title="`User ${index + 1}`"
            class="mb-4"
          >
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.name"
                    label="Username*"
                    variant="outlined"
                    :rules="[(v) => !!v || 'Username is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.fullname"
                    label="Full Name*"
                    variant="outlined"
                    :rules="[(v) => !!v || 'Full name is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.email"
                    label="Email*"
                    variant="outlined"
                    type="email"
                    :rules="[
                      (v) => !!v || 'Email is required',
                      (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                    ]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.ms"
                    label="MS Number*"
                    variant="outlined"
                    :rules="[(v) => !!v || 'MS number is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card>
                    <v-card-title>Date of Birth</v-card-title>
                    <v-date-picker
                      v-model="user.date_of_birth"
                      variant="outlined"
                    ></v-date-picker>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="user.role"
                    label="Role*"
                    variant="outlined"
                    :items="['student', 'professor', 'admin']"
                    :rules="[(v) => !!v || 'Role is required']"
                  ></v-select>
                </v-col>

                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="error"
                    variant="outlined"
                    class="mr-2"
                    @click="removeUser(index)"
                    :disabled="users.length === 1"
                  >
                    Remove User
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <div class="d-flex justify-end gap-4">
      <v-btn
        @click="addNewUser"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-plus"
      >
        Add User
      </v-btn>
      <v-btn @click="handleConfirm" color="primary" :loading="loading">
        Submit All Users
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.v-expansion-panel {
  margin-bottom: 1rem !important;
}
</style>
