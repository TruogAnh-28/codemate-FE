<template>
  <v-card
    class="transform transition-all duration-300 hover:scale-105"
    max-width="300"
    elevation="2"
    rounded="lg"
  >
    <div class="flex justify-center py-6">
      <v-img
        :src="props.imgSrc"
        height="80"
        width="80"
        contain
        class="rounded-lg"
        :alt="props.imgAlt"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="blue-lighten-3"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </div>

    <v-card-item>
      <v-card-title class="text-on-surface text-heading-4 text-center">
        {{ props.title }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="pb-6">
      <p class="text-gray-500 text-center text-body-small-regular leading-relaxed">
        {{ props.text }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps({
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
});
</script>
<style scoped>
.v-card-title{
  white-space: normal;
}
</style>
