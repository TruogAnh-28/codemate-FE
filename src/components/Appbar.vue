<template>
  <v-app-bar class="custom-app-bar" app fixed :elevation="0" color="secondary variant">
    <v-spacer></v-spacer>
    <v-btn icon="mdi-bell-outline"></v-btn>
    <v-btn icon="mdi-email-box"></v-btn>
    <v-list-item
      prepend-avatar="@/assets/codemate.png"
      title="NAT"
    ></v-list-item>
  </v-app-bar>
</template>

<script lang="ts">
export default {};
</script>

<style scoped>
.custom-app-bar {
  position: fixed !important;
  top: 0 !important;
  
}
</style>
