<template>
  <div id="login">
    <v-container className="fill-height">
      <v-app-bar
        class="flex justify-between items-center px-4 bg-on-primary shadow-md"
      >
        <div class="flex items-center space-x-4 logo-container" @click="goToHome">
          <v-icon icon="mdi-circle" size="large"></v-icon>
          <v-toolbar-title class="text-heading-4 text-secondary-variant logo-text">
            CODEMATE
          </v-toolbar-title>
        </div>
        <div class="ml-auto">
          <LanguageSelect />
        </div>
      </v-app-bar>

      <v-main>
        <router-view />
      </v-main>

      <v-footer app className="text-primary py-6 bg-on-primary">
        <v-container fluid className="flex flex-col items-center text-center">
          <div className="text-body-xs-1 mb-4">
            <p>&copy; 2024, Made with ❤️ by Group 6 for a better future</p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-body-xs-3 hover:text-secondary-variant">Marketplace</a>
            <a href="#" className="text-body-xs-3 hover:text-secondary-variant">Blog</a>
            <a href="#" className="text-body-xs-3 hover:text-secondary-variant">License</a>
          </div>
        </v-container>
      </v-footer>
    </v-container>
    <AutoLogin />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const goToHome = () => {
  router.push("/");
};
</script>

<style scoped>
.logo-container {
  cursor: pointer;
}

.logo-text {
  cursor: pointer;
}
</style>
