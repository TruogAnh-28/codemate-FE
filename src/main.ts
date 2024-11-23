/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

//import settings.scss from styles
import "@/global.css";
import ApiService from "./common/api.service";
import { createPinia } from 'pinia';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

ApiService.init();

const app = createApp(App);

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

registerPlugins(app);

app.mount("#app");
