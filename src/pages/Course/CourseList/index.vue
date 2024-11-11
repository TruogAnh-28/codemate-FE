<template>
  <Sidebar />
  <Appbar />
  <v-main class="pt-0 pb-2 pl-4 pr-4">
    <!-- Recent Courses -->
    <RecentCourses />
    <!-- My Courses -->
    <section>
      <h2 class="text-xl font-semibold">My Courses</h2>
      <input
        type="text"
        placeholder="Search"
        class="w-full mt-4 p-2 border rounded bg-input text-on-surface"
      />
      <div class="space-y-4 mt-6">
        <!-- Course Item -->
        <CourseItem />
      </div>
    </section>
  </v-main>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Appbar from "@/components/Appbar.vue";
import RecentCourses from "./RecentCourses/index.vue";
import CourseItem from "./CourseItem/index.vue";
export default {
  name: "CoursesList",
  components: {
    Sidebar,
    Appbar,
    RecentCourses,
    CourseItem,
  },
};
</script>

<style scoped>
.icon {
  font-size: 1.5rem;
}
</style>
