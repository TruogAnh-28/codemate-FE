<template>
      <v-navigation-drawer
        expand-on-hover
        rail
        class="bg-background dark:bg-background text-text-primary dark:text-text-primary"
      >
        <v-list>
          <v-list-item
            prepend-avatar="@/assets/codemate.png"
            title="CODEMATE"
            class="text-xl font-bold mb-2 text-text-primary dark:text-text-primary"
          ></v-list-item>
        </v-list>
        <v-divider class="border-border dark:border-border"></v-divider>
        <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        value="dashboard"
        :to="'/dashboard'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant
               text-text-primary dark:text-text-primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-school"
        title="Course"
        value="course"
        :to="'/courselist'"
        router
        class="hover:bg-secondary-variant dark:hover:bg-secondary-variant
               text-text-primary dark:text-text-primary"
      ></v-list-item>
    </v-list>
      </v-navigation-drawer>
</template>
