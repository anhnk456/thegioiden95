import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/SearchView.vue"),
    },
    {
      path: "/detail",
      name: "Detail",
      component: () => import("../views/DetailView.vue"),
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("../views/AdminView.vue"),
    },
    {
      path: "/add-category",
      name: "AddCategory",
      component: () => import("../views/AddCategory.vue"),
    },
    {
      path: "/add-img",
      name: "AddImg",
      component: () => import("../views/AddImg.vue"),
    },
    {
      path: "/add-category-parent",
      name: "AddCategoryParent",
      component: () => import("../views/AddCategoryParent.vue"),
    },
    {
      path: "/add-banner",
      name: "AddBanner",
      component: () => import("../views/AddBanner.vue"),
    },
    {
      path: "/add-priority",
      name: "AddPriority",
      component: () => import("../views/AddPriority.vue"),
    },
  ],
});

export default router;
