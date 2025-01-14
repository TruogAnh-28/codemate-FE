<template>
  <v-app>
    <v-main class="pt-0 pb-2 pl-4 pr-4 bg-gray-50">
      <RecentCourses :courses="courses" />
      <section>
        <h2 class="text-heading-4 font-semibold mb-6">My Courses</h2>
        <v-text-field
          v-model="searchQuery"
          placeholder="You can search by course name and your professor's name here ... 🌸🎆"
          class="mt-4 w-full rounded-lg shadow-sm bg-on-primary"
          :loading="isLoading"
          solo
          append-inner-icon="mdi-magnify"
          outlined
          dense
          hide-details
          @input="handleSearch"
        >
          <template v-slot:append>
            <v-fade-transition>
              <v-icon
                v-if="searchQuery"
                color="gray"
                class="cursor-pointer"
                @click="clearSearch"
              >
                mdi-close
              </v-icon>
            </v-fade-transition>
          </template>
        </v-text-field>
        <div class="space-y-4 mt-6">
          <CourseItem :courses="courses" />
        </div>
        <v-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
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
import useDebounce from "@/composables/useDebounce";
import { PAGE_SIZE_OF_COURSE_LIST } from "@/constants/courses";

const searchQuery = ref<string>("");
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const isLoading = ref<boolean>(false);
const courses = ref<CoursesListResponse[]>([]);

const debouncedSearch = useDebounce.useDebounceFn(() => {
  fetchCourses();
}, 500);

const handleSearch = () => {
  currentPage.value = 1;
  debouncedSearch();
};

const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
  fetchCourses();
};

const showError = inject("showError") as (message: string) => void;

const fetchCourses = async () => {
  isLoading.value = true;
  try {
    const courseReviewRequest: CoursesListDashBoardRequest = {
      student_id: User.id,
      offset: (currentPage.value - 1) * PAGE_SIZE_OF_COURSE_LIST,
      page_size: PAGE_SIZE_OF_COURSE_LIST,
      search_query: searchQuery.value || undefined,
    };

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

watch(currentPage, () => {
  fetchCourses();
});

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
.icon {
  font-size: 1.5rem;
}
</style>
