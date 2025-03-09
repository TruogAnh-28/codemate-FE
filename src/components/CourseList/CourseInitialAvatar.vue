<template>
  <v-sheet
    :style="{ backgroundColor: courseColor }"
    class="course-avatar d-flex align-center justify-center rounded-lg fill-height"
  >
    <span 
      class="text-center font-weight-bold text-white px-4"
      :class="textSizeClass"
    >
      {{ formatCourseName }}
    </span>
  </v-sheet>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  courseName: string;
}>();

const formatCourseName = computed(() => {
  return props.courseName.trim();
});

const textSizeClass = computed(() => {
  const length = props.courseName.length;
  if (length <= 20) return 'text-h4';
  if (length <= 30) return 'text-h5';
  if (length <= 40) return 'text-h6';
  return 'text-subtitle-1';
});

function stringToHexColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += value.toString(16).padStart(2, '0');
  }
  
  return color;
}

const courseColor = computed(() => {
  return stringToHexColor(props.courseName);
});
</script>

<style scoped>
.course-avatar {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

span {
  word-break: break-word;
  line-height: 1.2;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>