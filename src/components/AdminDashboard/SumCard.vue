<template>
    <v-card class="h-full transition-shadow hover:shadow-lg">
        <v-card-title class="text-left flex items-center">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            <span class="text-heading-4">Total {{ props.title }}</span>
            <p class="text-heading-2">{{ props.content }}</p>
        </v-card-title>
        <v-img
            :width="300"
            aspect-ratio="1/1"
            cover
            :src="props.src"
            ></v-img>
    </v-card>
</template>
<script setup lang="ts">
const props = defineProps<{
title: String,
content: String,
src: String,
}>();
</script>