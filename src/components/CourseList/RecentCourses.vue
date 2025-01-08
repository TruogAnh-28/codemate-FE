<template>
  <section class="mb-8">
    <h2 class="text-heading-4 font-semibold">Recent Courses:</h2>
    <div class="flex space-x-4 mt-4">
      <!-- Cards component -->
      <Cards :response="courses"/>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { CoursesListResponse } from '@/types/Course';
defineProps<{
  courses: CoursesListResponse[];
}>();
</script>
