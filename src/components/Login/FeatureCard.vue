<template>
  <v-card
    class="transform transition-all duration-300 hover:scale-105"
    max-width="350"
    elevation="8"
    rounded="xl"
  >
    <v-card-item class="bg-gradient-to-r from-primary to-secondary">
      <template v-slot:prepend>
        <v-icon :icon="props.iconTitle" color="white" class="mr-2"></v-icon>
      </template>
      <v-card-title class="text-white text-lg font-semibold">
        {{ props.title }}
      </v-card-title>
    </v-card-item>

    <v-img :src="props.imgSrc" height="250" cover class="bg-gray-100" :alt="props.imgAlt">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="indigo"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-text class="py-4">
      <p class="text-gray-700 text-center leading-relaxed">
        {{ props.text }}
      </p>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
const props = defineProps({
  iconTitle: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  imgSrc: {
    type: String,
    required: true,
  },
  imgAlt: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})
</script>
