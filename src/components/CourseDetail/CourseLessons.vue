<template>
  <v-card class="p-6" v-if="lessons">
    <div v-for="lesson in lessons" :key="lesson.id" class="mb-6">
      <v-row class="mb-4 m-0">
        <v-col cols="12" md="8" class="border-b-2">
          <div class="font-bold text-body-large-1">{{ lesson.title }}</div>
          <div class="text-text-tetiary text-body-base-1">
            {{ lesson.description }}
          </div>
        </v-col>
        <v-col cols="12" md="4" class="flex justify-center items-center border-b-2">
          <v-tooltip
            bottom
            v-for="button in getActionButtons(lesson)"
            :key="button.index"
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                variant="text"
                :icon="button.icon"
                @click="handleButtonClick(button, lesson)"
                v-bind="activatorProps"
                :class="button.class"
                :color="button.color"
              ></v-btn>
            </template>
            <span>{{ button.value }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>
  </v-card>
  <v-card v-else>
    <v-card-title class="text-heading-4 font-semibold">Lessons:</v-card-title>
    <v-card-text>No lessons available</v-card-text>
  </v-card>

  <!-- Only show feedback modal for students -->
  <FeedbackLesson
    v-if="isStudent"
    :lessonId="selectedLessonId"
    :showModal="showFeedbackModal"
    @update:showModal="updateFeedbackModal"
    @feedback-submitted="handleFeedbackSubmitted"
  />

  <!-- Add CreateLessonModal for edit functionality -->
  <v-dialog
    v-model="showEditModal"
    persistent
    max-width="800px"
    max-height="calc(100% - 130px)"
  >
    <CreateLessonModal
      v-if="!isStudent && showEditModal"
      :courseId="props.course.course_id"
      :courseName="props.course.course_name"
      :lessonId="selectedLessonId"
      @update="fetchLessons"
      @close="showEditModal = false"
    />
  </v-dialog>

  <!-- Confirmation Dialog for Delete -->
  <v-dialog v-model="showDeleteConfirmDialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Confirm Deletion</v-card-title>
      <v-card-text>
        Are you sure you want to delete this lesson? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="showDeleteConfirmDialog = false"
          >Cancel</v-btn
        >
        <v-btn color="error" variant="text" @click="confirmDeleteLesson">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add Documents Modal -->
  <v-dialog v-model="showAddDocumentsModal" max-width="800px">
    <v-card>
      <v-card-title class="text-h5">Add Documents to Lesson</v-card-title>
      <v-card-text>
        <Uploader v-model="uploadFiles" />

        <div v-if="uploadFiles.length > 0" class="mt-6">
          <div class="font-bold mb-4">Document Descriptions</div>
          <div v-for="(file, index) in uploadFiles" :key="index" class="mb-4">
            <div class="mb-1 font-medium">{{ file.name }}</div>
            <v-text-field
              v-model="fileDescriptions[index]"
              label="Description"
              variant="outlined"
              placeholder="Enter a description for this document"
              density="compact"
            ></v-text-field>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="showAddDocumentsModal = false"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          variant="text"
          @click="submitDocuments"
          :loading="isUploading"
          :disabled="uploadFiles.length === 0"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ShowDocumentsModal
    :showModal="showDocumentsModal"
    @update:showModal="showDocumentsModal = $event"
    :documents="selectedDocuments"
  />
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import {
  DocumentOriginalResponse,
  LessonOriginalResponse,
  CourseDetailResponse,
  GetDocumentsProfessor,
  GetCourseDetailProfessorResponse,
} from "@/types/Course";
import { coursesService } from "@/services/courseslistServices";
import { lessonService } from "@/services/lessonServices";
import { lessonService as lessonProfessorService } from "@/services/Professor/LessonServices";

type CourseProps = {
  course: CourseDetailResponse | GetCourseDetailProfessorResponse;
};

const props = defineProps<CourseProps>();

const role = computed(() => useAuthStore().user?.role);
const isStudent = computed(() => role.value === "student");

const showDocumentsModal = ref(false);
const showFeedbackModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirmDialog = ref(false);
const showAddDocumentsModal = ref(false);
const selectedLessonId = ref<string | undefined>(undefined);
const selectedDocuments = ref<DocumentOriginalResponse[] | GetDocumentsProfessor[]>([]);
const lessons = ref<LessonOriginalResponse[]>([]);
const documents = ref<DocumentOriginalResponse[]>([]);
const uploadFiles = ref<File[]>([]);
const fileDescriptions = ref<string[]>([]);
const isUploading = ref(false);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Watch for changes in uploadFiles to initialize descriptions
watch(uploadFiles, (newFiles) => {
  // Initialize descriptions array with empty strings for each file
  fileDescriptions.value = newFiles.map(() => "");
});

const handleButtonClick = async (button: any, lesson: LessonOriginalResponse) => {
  switch (button.index) {
    case 0:
      await fetchDocuments(lesson.id);
      showDocuments(documents.value);
      break;
    case 1:
      downloadDocuments(lesson.id);
      break;
    case 2:
      if (isStudent.value) {
        openFeedbackModal(lesson.id);
      } else {
        // For professors, open edit modal
        openEditModal(lesson.id);
      }
      break;
    case 3:
      // Only for professors - delete lesson
      if (!isStudent.value) {
        openDeleteConfirmDialog(lesson.id);
      }
      break;
    case 4:
      // Only for professors - add documents
      if (!isStudent.value) {
        openAddDocumentsModal(lesson.id);
      }
      break;
    default:
      console.error("Invalid button index:", button.index);
  }
};

const showDocuments = (documentList: any[] | string) => {
  if (Array.isArray(documentList)) {
    selectedDocuments.value = documentList;
    showDocumentsModal.value = true;
  } else {
    console.error("Invalid argument for showDocuments:", documentList);
  }
};

const fetchLessons = async () => {
  const response = await coursesService.getLessonsForCourse(
    { showError, showSuccess },
    props.course.course_id
  );
  if (response && "data" in response && response.data) {
    lessons.value = response.data as LessonOriginalResponse[];
  }
};

const fetchDocuments = async (lessonId: string) => {
  const response = await lessonService.getDocumentsfromLesson(
    { showError, showSuccess },
    lessonId
  );
  if (response && "data" in response && response.data) {
    documents.value = response.data as DocumentOriginalResponse[];
  } else {
    documents.value = [];
  }
};

const downloadDocuments = (lessonId: string) => {
  console.log("Downloading documents for lesson:", lessonId);
};

const updateFeedbackModal = (value: boolean): void => {
  showFeedbackModal.value = value;
};

const openFeedbackModal = (lessonId: string): void => {
  selectedLessonId.value = lessonId;
  showFeedbackModal.value = true;
};

const openEditModal = (lessonId: string): void => {
  selectedLessonId.value = lessonId;
  showEditModal.value = true;
};

// New function to open add documents modal
const openAddDocumentsModal = (lessonId: string): void => {
  selectedLessonId.value = lessonId;
  uploadFiles.value = []; // Reset files
  fileDescriptions.value = []; // Reset descriptions
  showAddDocumentsModal.value = true;
};

// New function to check if files are of valid format
const validateFileFormats = (files: File[]): boolean => {
  const validExtensions = [".pdf", ".docx", ".pptx"];
  const invalidFiles = files.filter((file) => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    return !validExtensions.includes(extension);
  });

  if (invalidFiles.length > 0) {
    const invalidFileNames = invalidFiles.map((file) => file.name).join(", ");
    showError(
      `Invalid file format(s): ${invalidFileNames}. Only PDF, DOCX, and PPTX files are allowed.`
    );
    return false;
  }

  return true;
};

// New function to handle document submission
const submitDocuments = async (): Promise<void> => {
  if (!selectedLessonId.value || uploadFiles.value.length === 0) {
    showError("No files selected or lesson ID is missing");
    return;
  }

  // Validate file formats
  if (!validateFileFormats(uploadFiles.value)) {
    return;
  }

  try {
    isUploading.value = true;

    const response = await lessonProfessorService.addDocuments(
      { showError, showSuccess },
      selectedLessonId.value,
      uploadFiles.value,
      fileDescriptions.value
    );

    if (response) {
      showSuccess("Documents uploaded successfully");
      showAddDocumentsModal.value = false;
      uploadFiles.value = [];
      fileDescriptions.value = [];

      // Refresh documents if needed
      await fetchDocuments(selectedLessonId.value);
    }
  } catch (error) {
    showError("Failed to upload documents");
    console.error("Error uploading documents:", error);
  } finally {
    isUploading.value = false;
  }
};

// New function to open delete confirmation dialog
const openDeleteConfirmDialog = (lessonId: string): void => {
  selectedLessonId.value = lessonId;
  showDeleteConfirmDialog.value = true;
};

// New function to handle lesson deletion
const confirmDeleteLesson = async (): Promise<void> => {
  if (selectedLessonId.value) {
    try {
      const response = await lessonProfessorService.deleteLesson(
        { showError, showSuccess },
        selectedLessonId.value
      );

      if (response) {
        showSuccess("Lesson deleted successfully");
        await fetchLessons(); // Refresh lesson list
      }
    } catch (error) {
      showError("Failed to delete lesson");
      console.error("Error deleting lesson:", error);
    } finally {
      showDeleteConfirmDialog.value = false;
      selectedLessonId.value = undefined;
    }
  }
};

const handleFeedbackSubmitted = (feedbackData: {
  lessonId: string;
  feedback: string;
}): void => {
  console.log(
    `Feedback received for lesson ${feedbackData.lessonId}:`,
    feedbackData.feedback
  );
  showFeedbackModal.value = false;
  selectedLessonId.value = undefined;
};

const getActionButtons = (lesson: any) => {
  const baseButtons = [
    {
      index: 0,
      icon: "mdi-file-document",
      value: "Show Documents",
      class: "text-text-primary",
      color: "primary", // Blue color for document icon
    },
    {
      index: 1,
      icon: "mdi-download",
      value: "Download Documents",
      class: "text-text-primary",
      color: "success", // Green color for download icon
    },
  ];

  if (isStudent.value) {
    baseButtons.push({
      index: 2,
      icon: "mdi-comment-text-outline",
      value: "Feedback Lesson",
      class: "text-text-primary",
      color: "info", // Light blue for feedback
    });
  } else {
    // For professors only
    baseButtons.push({
      index: 2,
      icon: "mdi-pencil",
      value: "Edit Lesson",
      class: "text-text-primary",
      color: "warning", // Orange/yellow color for edit
    });

    // Add delete button for professors
    baseButtons.push({
      index: 3,
      icon: "mdi-delete",
      value: "Delete Lesson",
      class: "text-text-primary",
      color: "error", // Red color for delete
    });

    // Add new button for adding documents (professors only)
    baseButtons.push({
      index: 4,
      icon: "mdi-file-upload",
      value: "Add Documents",
      class: "text-text-primary",
      color: "info", // Light blue for upload
    });
  }

  return baseButtons;
};

onMounted(async () => {
  await fetchLessons();
});
</script>

<style scoped>
.v-row.m-0 {
  margin: 0 !important;
}
</style>
