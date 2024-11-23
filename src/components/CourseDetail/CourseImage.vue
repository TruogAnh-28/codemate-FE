<template>
  <v-img
    :src="getAvatarCourseUrl(courseInfo?.image ?? '')"
    :alt="courseInfo?.name"
    class="w-full h-full"
  >
    <template v-slot:error>
      <v-img
        height="400px"
        width="500px"
        src="../../assets/default-course-avt.svg"
      ></v-img>
    </template>
  </v-img>
</template>

<script lang="ts" setup>
import { getAvatarCourseUrl } from "@/utils/functions/functions";
defineProps<{
  courseInfo: {
    image: string;
    name: string;
  } | null;
}>();
</script>
