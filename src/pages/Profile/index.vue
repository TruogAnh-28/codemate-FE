<template>
  <v-container fluid class="profile-container pa-0 ma-0">
    <v-row no-gutters class="h-100">
      <!-- Left Section: Avatar/Profile Image -->
      <v-col
        cols="12"
        md="4"
        class="avatar-section pa-6"
        :style="{
          background:
            'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
        }"
      >
        <div
          class="avatar-container d-flex flex-column align-center justify-center text-center"
        >
          <v-avatar size="250" class="avatar-border mb-4" elevation="6">
            <v-img
              :src="
                editedInfo.avatar ||
                userInfo?.avatar ||
                '../../assets/default-student-avt.jpg'
              "
              alt="User Avatar"
              cover
              class="avatar-image"
            />
            <div class="avatar-overlay" v-if="isEditing">
              <v-btn
                icon
                variant="text"
                class="upload-btn"
                @click="triggerFileUpload"
                :color="`hsl(var(--on-primary))`"
              >
                <v-icon size="48">mdi-camera</v-icon>
              </v-btn>
            </div>
          </v-avatar>

          <div v-if="isEditing" class="avatar-upload-section">
            <input
              type="file"
              ref="fileInput"
              accept="image/jpeg, image/png, image/webp"
              class="hidden-input"
              @change="handleFileUpload"
            />
            <v-btn
              :color="`hsl(var(--on-primary))`"
              variant="outlined"
              class="mt-3 upload-avatar-btn"
              prepend-icon="mdi-upload"
              @click="triggerFileUpload"
              size="small"
            >
              Change Photo
            </v-btn>
            <div class="text-caption" :style="{ color: 'hsl(var(--text-secondary))' }">
              JPG, PNG, WebP
            </div>
            <div
              v-if="fileError"
              class="text-error text-caption mt-1"
              :style="{ color: 'hsl(var(--error))' }"
            >
              {{ fileError }}
            </div>
            <div
              v-if="avatarFile"
              class="text-success text-caption mt-1"
              :style="{ color: 'hsl(var(--success))' }"
            >
              {{ avatarFile.name }}
            </div>
          </div>

          <v-chip
            class="role-badge mt-4"
            :class="`role-${userInfo?.role}`"
            :color="`hsl(var(--surface))`"
            :text-color="`hsl(var(--primary))`"
            size="large"
          >
            {{ capitalizeFirstLetter(userInfo?.role || "") }}
          </v-chip>
        </div>
      </v-col>

      <!-- Right Section: User Information Fields -->
      <v-col cols="12" md="8" class="profile-info-section pa-6">
        <div class="d-flex justify-space-between align-center flex-wrap mb-4">
          <h1 class="text-h4 font-weight-bold gradient-text">Profile Information</h1>
          <div class="edit-actions mt-2 mt-md-0">
            <v-btn
              v-if="!isEditing"
              :color="`hsl(var(--primary))`"
              variant="elevated"
              class="edit-btn text-text-secondary"
              prepend-icon="mdi-pencil"
              @click="startEditing"
            >
              Edit Profile
            </v-btn>
            <div v-else class="edit-action-buttons d-flex gap-2">
              <v-btn
                :color="`hsl(var(--secondary-variant))`"
                variant="elevated"
                class="save-btn text-text-secondary"
                prepend-icon="mdi-check"
                @click="saveChanges"
                :loading="isSaving"
                :disabled="isSaving"
              >
                Save
              </v-btn>
              <v-btn
                :color="`hsl(var(--primary))`"
                variant="outlined"
                class="cancel-btn"
                prepend-icon="mdi-close"
                @click="cancelEditing"
                :disabled="isSaving"
              >
                Cancel
              </v-btn>
            </div>
          </div>
        </div>

        <v-divider
          class="my-4"
          :style="{ borderColor: 'hsl(var(--border))' }"
        ></v-divider>

        <div class="profile-fields">
          <!-- Username Field -->
          <v-row class="mb-4" align="center">
            <v-col cols="4" class="field-label py-0">
              <v-icon :color="`hsl(var(--primary))`" class="mr-2">mdi-account</v-icon>
              <span class="text-subtitle-1 font-weight-medium">Username</span>
            </v-col>
            <v-col cols="8">
              <div v-if="!isEditing" class="field-display pa-3">
                <span class="text-body-1">{{ userInfo?.name || "—" }}</span>
              </div>
              <v-text-field
                v-else
                v-model="editedInfo.name"
                variant="outlined"
                density="compact"
                placeholder="Enter username"
                :rules="[(v) => !!v || 'Username is required']"
                :color="`hsl(var(--primary))`"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Full Name Field -->
          <v-row class="mb-4" align="center">
            <v-col cols="4" class="field-label py-0">
              <v-icon :color="`hsl(var(--primary))`" class="mr-2"
                >mdi-card-account-details</v-icon
              >
              <span class="text-subtitle-1 font-weight-medium">Full Name</span>
            </v-col>
            <v-col cols="8">
              <div v-if="!isEditing" class="field-display pa-3">
                <span class="text-body-1">{{ userInfo?.fullname || "—" }}</span>
              </div>
              <v-text-field
                v-else
                v-model="editedInfo.fullname"
                variant="outlined"
                density="compact"
                placeholder="Enter full name"
                :rules="[(v) => !!v || 'Full name is required']"
                :color="`hsl(var(--primary))`"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Email Field (Display Only) -->
          <v-row class="mb-4" align="center">
            <v-col cols="4" class="field-label py-0">
              <v-icon :color="`hsl(var(--primary))`" class="mr-2">mdi-email</v-icon>
              <span class="text-subtitle-1 font-weight-medium">Email</span>
            </v-col>
            <v-col cols="8">
              <div class="field-display pa-3">
                <span class="text-body-1">{{ userInfo?.email || "—" }}</span>
              </div>
            </v-col>
          </v-row>

          <!-- Student/Staff ID Field (Display Only) -->
          <v-row class="mb-4" align="center">
            <v-col cols="4" class="field-label py-0">
              <v-icon :color="`hsl(var(--primary))`" class="mr-2">mdi-id-card</v-icon>
              <span class="text-subtitle-1 font-weight-medium">
                {{ userInfo?.role === "student" ? "Student ID" : "Staff ID" }}
              </span>
            </v-col>
            <v-col cols="8">
              <div class="field-display pa-3">
                <span class="text-body-1">{{ userInfo?.ms || "—" }}</span>
              </div>
            </v-col>
          </v-row>

          <!-- Date of Birth Field -->
          <v-row class="mb-4" align="center">
            <v-col cols="4" class="field-label py-0">
              <v-icon :color="`hsl(var(--primary))`" class="mr-2">mdi-calendar</v-icon>
              <span class="text-subtitle-1 font-weight-medium">Date of Birth</span>
            </v-col>
            <v-col cols="8">
              <div v-if="!isEditing" class="field-display pa-3">
                <span class="text-body-1">{{ formatDate(userInfo?.date_of_birth) }}</span>
              </div>
              <v-date-input
                v-else
                v-model="dateOfBirth"
                label="Select a date"
                max-width="368"
              ></v-date-input>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- Notification Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="`hsl(var(--${snackbar.color}))`"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
          :color="`hsl(var(--on-${snackbar.color}))`"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.profile-container {
  background: hsl(var(--background));
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.avatar-section {
  color: hsl(var(--on-primary));
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-border {
  border: 5px solid hsl(var(--surface));
  transition: transform 0.3s ease;
}

.avatar-border:hover {
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.hidden-input {
  display: none;
}

.role-badge {
  font-weight: bold;
  letter-spacing: 1px;
}

.profile-info-section {
  background: hsl(var(--surface));
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: hsl(var(--on-surface));
}

.field-label {
  display: flex;
  align-items: center;
}

.field-display {
  background: hsl(var(--input));
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
}

.edit-action-buttons {
  gap: 8px;
}

.gradient-text {
  background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}
</style>
<script setup lang="ts">
// Define emit events
const emit = defineEmits(["update:userInfo"]);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
import { usersService } from "@/services/usersServices";
import { GetProfileResponse } from "@/types/User";
const userInfo = ref<GetProfileResponse | undefined>();

// Original user info for reset when canceling
const originalUserInfo = ref<GetProfileResponse | undefined>();

// Date picker menu control
const datePickerMenu = ref(false);

const fetchUserProfile = async () => {
  try {
    const response = await usersService.getProfile({ showError, showSuccess });
    if (response && "data" in response) {
      userInfo.value = response.data as GetProfileResponse;
      // Store original user info for reset when canceling
      originalUserInfo.value = JSON.parse(JSON.stringify(userInfo.value));
      // Initialize the edited info with current user info
      Object.assign(editedInfo, userInfo.value);
    }
  } catch (error) {
    showError("Failed to fetch profile information");
  }
};

onMounted(fetchUserProfile);

// State for editing mode
const isEditing = ref(false);
const isSaving = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const avatarFile = ref<File | null>(null);
const fileError = ref<string | null>(null);

// Create a copy of the user info for editing
const editedInfo = reactive<GetProfileResponse>({
  id: "",
  name: "",
  fullname: "",
  avatar: "",
  email: "",
  ms: "",
  date_of_birth: new Date().toISOString(),
  role: "",
});

// Computed property for formatted date display
const formattedDateForDisplay = computed(() => {
  if (!editedInfo.date_of_birth) return "";
  return formatDate(editedInfo.date_of_birth);
});

// Computed property for date input binding
const dateOfBirth = computed({
  get() {
    return new Date(editedInfo.date_of_birth);
  },
  set(value: Date) {
    editedInfo.date_of_birth = value.toISOString();
  },
});

// Snackbar state
const snackbar = reactive({
  show: false,
  text: "",
  color: "success",
});

// Methods
function startEditing() {
  // Reset edited info to current user info
  if (userInfo.value) {
    Object.assign(editedInfo, JSON.parse(JSON.stringify(userInfo.value)));
  }
  isEditing.value = true;
  fileError.value = null;
  avatarFile.value = null;
}

function cancelEditing() {
  isEditing.value = false;
  fileError.value = null;
  avatarFile.value = null;

  // Restore userInfo from originalUserInfo if cancel was clicked
  if (originalUserInfo.value) {
    userInfo.value = JSON.parse(JSON.stringify(originalUserInfo.value));
  }
}

async function saveChanges() {
  const date = new Date(editedInfo.date_of_birth);

  // Extract year, month, and day
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month and ensure 2 digits
  const day = date.getDate().toString().padStart(2, "0"); // Get day and ensure 2 digits

  // Format as YYYY-MM-DD
  const formattedDate = `${year}-${month}-${day}`;

  isSaving.value = true;

  try {
    const response = await usersService.updateUser(
      {
        name: editedInfo.name,
        fullname: editedInfo.fullname,
        date_of_birth: formattedDate,
        avatar: avatarFile.value || undefined,
        role: "student",
      },
      {
        showError,
        showSuccess,
      }
    );

    if (response && "data" in response) {
      if (response.data) {
        const getUserInfo = await usersService.getProfile({ showError, showSuccess });
        if (getUserInfo && "data" in getUserInfo) {
          userInfo.value = getUserInfo.data as GetProfileResponse;
          originalUserInfo.value = JSON.parse(JSON.stringify(userInfo.value));
          emit("update:userInfo", userInfo.value);
          showSuccess("Profile updated successfully!");
          isEditing.value = false;
          fileError.value = null;
          avatarFile.value = null;
        }
      }
    }

    // Show success message
    showSnackbar("Profile updated successfully!", "success");

    // Exit edit mode
    isEditing.value = false;
  } catch (error) {
    console.error("Error updating profile:", error);
    showSnackbar("Failed to update profile. Please try again.", "error");
  } finally {
    isSaving.value = false;
  }
}

function triggerFileUpload() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  fileError.value = null;

  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      fileError.value = "Invalid file type. Please select JPG, PNG, or WebP.";
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      fileError.value = "File size exceeds 5MB limit.";
      input.value = "";
      return;
    }

    avatarFile.value = file;

    // Create a preview of the new avatar
    editedInfo.avatar = URL.createObjectURL(file);
  }
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "—";

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function capitalizeFirstLetter(string: string): string {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function showSnackbar(text: string, color: string) {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
}
</script>
