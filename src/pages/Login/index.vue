<template>
  <div id="login">
    <v-container class="fill-height">
      <v-main class="pt-0">
        <div class="flex w-full flex-col lg:flex-row">
          <div class="flex-1 p-20 hidden md:block">
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
