import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "@/api/auth";
import HomeView from "../views/HomeView.vue";
import OrdersView from '@/views/OrdersView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("../views/ForgotPasswordView.vue"),
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
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/add-category",
      name: "AddCategory",
      component: () => import("../views/AddCategory.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/add-img",
      name: "AddImg",
      component: () => import("../views/AddImg.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/add-category-parent",
      name: "AddCategoryParent",
      component: () => import("../views/AddCategoryParent.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/add-banner",
      name: "AddBanner",
      component: () => import("../views/AddBanner.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/add-priority",
      name: "AddPriority",
      component: () => import("../views/AddPriority.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true }
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const currentUser = getCurrentUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // Nếu đang vào trang login và đã đăng nhập
  if (to.path === '/login' && currentUser) {
    // Nếu có trang trước đó và không phải là /login thì quay lại trang đó
    if (from.fullPath && from.fullPath !== '/login') {
      next(from.fullPath);
    } else {
      // Nếu không có thì về trang chủ
      next('/');
    }
    return;
  }

  // Nếu route yêu cầu xác thực
  if (requiresAuth) {
    if (!currentUser) {
      // Chưa đăng nhập, chuyển đến trang login
      next('/login');
      return;
    }

    // Nếu route yêu cầu quyền admin
    if (requiresAdmin && !currentUser.roles?.includes('ROLE_ADMIN')) {
      // Không có quyền admin, chuyển về trang chủ
      // next('/'); // Tạm thời comment dòng này để debug
      console.error('Không có quyền admin!');
      return;
    }
  }

  // Cho phép truy cập
  next();
});

export default router;
