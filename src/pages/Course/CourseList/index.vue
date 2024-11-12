<template>
  <v-app>

    <v-main class="pt-0 pb-2 pl-4 pr-4">
      <!-- Recent Courses -->
      <RecentCourses />

      <!-- My Courses Section -->
      <section >
        <h2 class="text-xl font-semibold">My Courses</h2>
        <!-- Search Bar -->
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

export default {
  name: 'CourseList',
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
