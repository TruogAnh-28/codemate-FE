<template>
      <v-navigation-drawer
        expand-on-hover
        rail
      >
        <v-list>
          <v-list-item
            prepend-avatar="@/assets/codemate.png"
            title="CODEMATE"
         
          ></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" :to="'/dashboard'" router></v-list-item>
          <v-list-item prepend-icon="mdi-school" title="Course" value="course" :to="'/courselist'" router></v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>
<script setup lang="ts">

</script>
