import "./assets/main.css";

import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import { fetch as fetchCategoryParent } from "./store/categoryParent";

const app = createApp(App);

fetchCategoryParent();

app.use(router);
app.use(Antd);

app.mount("#app");
