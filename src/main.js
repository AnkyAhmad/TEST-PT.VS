import { createApp } from "vue";
import "./styles/style.css";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/Vuetify";
import VueApexCharts from "vue3-apexcharts";

createApp(App).use(router).use(vuetify).use(VueApexCharts).mount("#app");
