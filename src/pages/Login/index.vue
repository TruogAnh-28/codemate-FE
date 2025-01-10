<template>
  <div id="login">
    <v-container className="fill-height">
      <v-app-bar
        class="flex justify-between items-center px-4 bg-white shadow-md"
      >
        <div class="flex items-center space-x-4">
          <v-icon icon="mdi-circle" size="large"></v-icon>
          <v-toolbar-title class="text-heading-4 text-secondary-variant"
            >CODEMATE</v-toolbar-title
          >
        </div>
        <div class="ml-auto">
          <LanguageSelect />
        </div>
      </v-app-bar>

      <v-main className="pt-0">
        <div class="flex w-full">
          <div class="flex-1 p-20">
            <h2 class="text-heading-4 font-semibold mb-4">
              Unlock your potential
            </h2>
            <p>
              Log in to continue your journey towards academic excellence with
              our dedicated support!
            </p>
            <loginAssets />
          </div>

          <div class="flex-1 p-4">
            <LoginForm />
          </div>
        </div>
      </v-main>

      <v-footer app className="text-primary py-6 bg-white">
        <v-container fluid className="flex flex-col items-center text-center">
          <div className="text-body-xs-1 mb-4">
            <p>&copy; 2024, Made with ❤️ by Group 6 for a better future</p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-body-xs-3 hover:text-secondary-variant"
              >Marketplace</a
            >
            <a href="#" className="text-body-xs-3 hover:text-secondary-variant"
              >Blog</a
            >
            <a href="#" className="text-body-xs-3 hover:text-secondary-variant"
              >License</a
            >
          </div>
        </v-container>
      </v-footer>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import loginAssets from "@/assets/login/loginAssets.vue";
</script>

<style>
/* #login {
  background: url(../../assets/background.jpg) ;
} */
</style>
