import { createRouter, createWebHistory } from 'vue-router';
import CashierView from '../views/CashierView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'cashier',
      component: CashierView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/banners',
      name: 'banners',
      component: () => import('../views/BannerAdminView.vue')
    }
  ]
});

export default router;
