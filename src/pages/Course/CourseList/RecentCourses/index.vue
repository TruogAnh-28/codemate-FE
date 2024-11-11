<template>
  <section class="mb-8">
    <h2 class="text-xl font-semibold">Recent Courses:</h2>
    <div class="flex space-x-4 mt-4">
      <Cards />
      </div>
  </section>
</template>

<script>
import Cards from "./Cards/index.vue";
export default {
  name: "RecentCourses",
  components: { Cards },
};
</script>
