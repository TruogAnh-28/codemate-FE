<template>
      <v-container>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="slide-x-reverse-transition"
          offset-y
        >
        <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="primary"
              class="language-btn"
            >
              {{ selectedLanguage }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="changeLanguage('en-US')">
              <v-list-item-content>
                <v-list-item-title>English (United States)</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="changeLanguage('vi-VN')">
              <v-list-item-content>
                <v-list-item-title>Tiếng Việt (Vietnam)</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
  </template>

  <script lang="ts" setup>

  const menu = ref(false)
  const selectedLanguage = ref('English (United States)')

  const changeLanguage = (lang: string) => {
    if (lang === 'en-US') {
      selectedLanguage.value = 'English (United States)'
    } else if (lang === 'vi-VN') {
      selectedLanguage.value = 'Tiếng Việt (Vietnam)'
    }
    menu.value = false
  }
  </script>

  <style scoped>
  .language-btn {
    text-transform: none;
  }
  </style>
