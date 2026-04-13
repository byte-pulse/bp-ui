import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/dashboard',
      component: () => import('@/layout/Layout.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/workbench/Dashboard.vue'),
        },
        {
          path: '/workspace',
          name: 'workspace',
          component: () => import('@/views/workbench/Workspace.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue'),
    },
  ],
})

// 前置守卫
router.beforeEach((to, _from) => {
  $loadingBar.start()
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

// 后置守卫
router.afterEach((to, _) => {
  if (to.path === '/404' || to.path === '/403') {
    $loadingBar.error()
    return
  }
  $loadingBar.finish()
})

export default router
