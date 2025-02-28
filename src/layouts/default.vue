<template>
  <v-app>
    <Sidebar v-model="drawer" @expand="handleExpand" />
    <Appbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const drawer = ref(true);
const sidebarExpanded = ref(false);
const handleExpand = (value: boolean) => {
  sidebarExpanded.value = value;
};
</script>
