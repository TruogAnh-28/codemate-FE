<template>
  <v-app-bar :elevation="0">
    <!-- <template v-slot:prepend>
       <v-text-field
      :loading="loading"
      append-inner-icon="mdi-magnify"
      density="compact"
      label="Search templates"
      variant="solo"
      hide-details
      single-line
      class="search-bar"
      @click:append-inner="onClick"
      max-width="50%"
    ></v-text-field>

    </template> -->
<!--
    <v-text-field
      :loading="loading"
      append-inner-icon="mdi-magnify"
      density="compact"
      label="Search"
      variant="solo"
      hide-details
      single-line
      class="search-bar"
      @click:append-inner="onClick"
      max-width="50%"
    ></v-text-field> -->

    <template v-slot:append>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-bell-outline"></v-btn>
      <v-btn icon="mdi-email-box"></v-btn>
      <v-list-item
                prepend-avatar="@/assets/codemate.png"
                subtitle="nat_nhom6dacn"
                title="NAT"
      ></v-list-item>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
  export default {
    name: "Appbar",
  };
</script>
<style scoped>
.search-bar {
  margin-left: 2rem;
}
</style>
