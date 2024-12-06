<template>
  <v-row no-gutters align="center" class="p-6">
    <v-col cols="4" md="4" class="flex justify-center items-center pr-4">
      <CourseImage :course="course" />
    </v-col>

    <v-col cols="8" md="8">
      <div class="text-heading-3 font-weight-bold mb-2">
        {{ course?.course_name ?? "N/A" }}
      </div>

      <v-row class="d-flex align-center">
        <CourseProgress v-if="course" :course="course" />
        <CourseDetails
          :course="course"
        />
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { CourseDetailResponse } from "@/types/Course";

defineProps<{
  course: CourseDetailResponse | null;
}>();
</script>
