<template>
  <v-app>
    <v-main class="pt-0 pb-2 pl-4 pr-4 bg-gray-50">
      <!-- Recent Courses - Original Position -->
      <RecentCourses :courses="courses" />

      <!-- My Courses Section - Original Position -->
      <section>
        <h2 class="text-heading-4 font-semibold mb-6">My Courses</h2>

        <!-- Search Bar - Original Position -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          class="mt-4 w-full rounded-lg shadow-sm"
          :loading="isLoading"
          solo
          append-inner-icon="mdi-magnify"
          outlined
          dense
          hide-details
          @update:model-value="handleSearch"
        >
          <template v-slot:append>
            <v-fade-transition>
              <v-icon
                v-if="searchQuery"
                color="gray"
                class="cursor-pointer"
                @click="searchQuery = ''"
              >
                mdi-close
              </v-icon>
            </v-fade-transition>
          </template>
        </v-text-field>

        <!-- Course Items -->
        <div class="space-y-4 mt-6">
          <CourseItem :courses="courses" />
        </div>

        <!-- Pagination Controls -->
        <v-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          @input="fetchCourses"
        />
      </section>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { coursesService } from "@/services/courseslistServices";
import {
  CoursesListDashBoardRequest,
  CoursesListResponse,
} from "@/types/Course";

import { User } from "@/constants/user";
const searchQuery = ref<string>("");
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const isLoading = ref<boolean>(false);
const courses = ref<CoursesListResponse[]>([]);

const handleSearch = () => {
  currentPage.value = 1;
  fetchCourses();
};
const showError = inject("showError") as (message: string) => void;

const courseReviewRequest: CoursesListDashBoardRequest = {
  student_id: User.id,
  offset: 0,
  page_size: 10,
};

const fetchCourses = async () => {
  isLoading.value = true;
  try {
    const response = (await coursesService.fetchCoursesList(
      showError,
      courseReviewRequest
    )) || {
      content: [],
      currentPage: 0,
      pageSize: 0,
      totalRows: 0,
      totalPages: 0,
    };

    if (response) {
      courses.value = response.content;
      totalPages.value = response.totalPages;
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    isLoading.value = false;
  }
};

watchEffect(() => {
  fetchCourses();
});
</script>

<style scoped>
.icon {
  font-size: 1.5rem;
}
</style>
