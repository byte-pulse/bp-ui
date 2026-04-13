import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/components/layout/Layout.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue'),
    },
  ],
})

router.beforeEach((to, _from) => {
  const path = to.path
  if (path === '/login') {
    return true
  }
  const authStore = useAuthStore()
  if (authStore.token) {
    return true
  } else {
    return '/login'
  }
})

export default router
