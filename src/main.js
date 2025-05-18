import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from 'pinia';
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import { fetch as fetchCategoryParent } from "./store/categoryParent";

const app = createApp(App);
const pinia = createPinia();

fetchCategoryParent();

app.use(router);
app.use(Antd);
app.use(pinia);

app.mount("#app");
