<template>
  <v-app>
    <!-- Sidebar and Appbar components -->
    <Sidebar />
    <Appbar />

    <v-main class="pt-0 pb-2 pl-4 pr-4">
      <!-- Recent Courses -->
      <RecentCourses />

      <!-- My Courses Section -->
      <section class="ml-14">
        <h2 class="text-xl font-semibold">My Courses</h2>

        <!-- Vuetify TextField for search with Tailwind styling -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          class="mt-4 w-full"
          solo
          append-inner-icon="mdi-magnify"
          outlined
          dense
          hide-details
        />

        <!-- Course Items -->
        <div class="space-y-4 mt-6">
          <CourseItem />
        </div>
      </section>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { ref } from 'vue';
import Sidebar from "@/components/Sidebar.vue";
import Appbar from "@/components/Appbar.vue";
import RecentCourses from "@/pages/Course/CourseList/RecentCourses/index.vue";
import CourseItem from "@/pages/Course/CourseList/CourseItem/index.vue";

export default {
  name: 'CourseList',
  components: {
    Sidebar,
    Appbar,
    RecentCourses,
    CourseItem
  },
  setup() {
    const searchQuery = ref<string>("");

    return {
      searchQuery
    };
  }
};
</script>

<style scoped>
.icon {
  font-size: 1.5rem;
}
</style>
