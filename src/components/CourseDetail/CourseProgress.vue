<template>
  <v-col cols="12" md="6" class="text-center">
    <div
      class="text-heading-3 font-weight-bold mb-1 text-error"
      v-if="course.course_percentage_complete !== ''"
    >
      {{ course.course_percentage_complete }}%
    </div>
    <div class="text-heading-3 font-weight-bold mb-1 text-error" v-else>0%</div>
    <v-chip
      :color="renderStatusLabel(course.course_status ?? 'N/A')"
      outlined
      small
      class="text-body-small-1"
    >
      <v-icon left size="18" class="mr-2">mdi-check-circle</v-icon>
      {{ course.course_status ?? "N/A" }}
    </v-chip>
  </v-col>
</template>

<script lang="ts" setup>
import { CourseDetailResponse } from "@/types/Course";
import { renderStatusLabel } from "@/utils/functions/render";

defineProps<{
  course: CourseDetailResponse;
}>();
</script>
