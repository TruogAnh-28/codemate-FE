<template>
  <v-app>
    <v-main class="pt-0 pb-2 pl-4 pr-4 bg-gray-50">
      <!-- Recent Courses - Original Position -->
      <RecentCourses />

      <!-- My Courses Section - Original Position -->
      <section>
        <h2 class="text-heading-4 font-semibold mb-6">My Courses</h2>

        <!-- Search Bar - Original Position -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          class="mt-4 w-full rounded-lg shadow-sm"
          :loading="isSearching"
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

        <!-- Course Items - Original Position -->
        <div class="space-y-4 mt-6">
          <CourseItem />
        </div>
      </section>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>

const searchQuery = ref<string>("");
const isSearching = ref(false);

const handleSearch = () => {
  isSearching.value = true;
  setTimeout(() => {
    isSearching.value = false;
  }, 500);
};
</script>

<style scoped>
.icon {
  font-size: 1.5rem;
}
</style>
