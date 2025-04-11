<template>
  <v-card class="rounded-lg overflow-hidden" elevation="2">
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-body-large-1 font-semibold text-gray-800">Courses</h3>
        <v-btn variant="text" color="secondary" :to="'/courselist'"> View Details </v-btn>
      </div>

      <div
        class="flex justify-between items-center py-3 border-b border-gray-200 font-medium text-gray-700"
      >
        <span class="w-1/3">Course Name</span>
        <span class="w-1/4">Members</span>
        <span class="w-1/4">Progress</span>
      </div>

      <div class="max-h-80 overflow-y-auto">
        <div
          v-for="course in courses.content"
          :key="course.id"
          class="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-0"
        >
          <!-- Avatar and Course Name Section -->
          <div class="flex items-center w-1/3 space-x-3">
            <!-- Course Avatar -->
            <div class="avatar-container">
              <template v-if="course.image_url">
                <v-img
                  class="flex-shrink-0 course-image"
                  :width="120"
                  :height="80"
                  :src="course.image_url"
                  cover
                >
                  <template v-slot:error>
                    <div class="h-full w-60 flex items-center justify-center rounded-lg">
                      <CourseInitialAvatar :course-name="course.name" />
                    </div>
                  </template>
                </v-img>
              </template>
              <template v-else>
                <div class="h-3/4 w-60 flex items-center justify-center rounded-lg">
                  <CourseInitialAvatar :course-name="course.name" />
                </div>
              </template>
            </div>
            
            <!-- Course Name -->
            <span class="font-medium text-gray-800">{{ course.name }}</span>
          </div>

          <!-- Members Section -->
          <div class="w-1/4">
            <AvatarStack :courses="course" :maxVisible="3" />
          </div>

          <!-- Progress Section -->
          <div class="w-1/4">
            <v-progress-linear
              :model-value="course.percentage_complete"
              height="15"
              class="mb-4 rounded-lg"
              color="secondary"
            >
              <template #default>
                <strong class="text-text-primary"> {{ course.percentage_complete }}%</strong>
              </template>
            </v-progress-linear>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { coursesService } from "@/services/courseslistServices";
import { CoursesListPaginatedResponse } from "@/types/Course";
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
const courses = ref<CoursesListPaginatedResponse>({
  content: [],
  currentPage: 0,
  pageSize: 0,
  totalRows: 0,
  totalPages: 0,
});
const fetchCoursesList = async () => {
  const response = await coursesService.fetchCoursesList({
    showError,
    showSuccess,
  });
  if (response && "data" in response && response.data) {
    courses.value = response.data as CoursesListPaginatedResponse;
  }
};

defineEmits<{
  (e: "view-details"): void;
}>();

onMounted(() => {
  fetchCoursesList();
});
</script>
<style scoped>
.course-image {
  transition: transform 0.5s ease;
}
.image-container {
  width: 300px;
  overflow: hidden;
  border-radius: 8px;
}
.avatar-container {
  width: 200px;
  height: 160px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}
</style>
