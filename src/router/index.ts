import { createRouter, createWebHistory } from 'vue-router'
import { baseRoutes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes]
})

router.beforeEach((to, _) => {
  const authStore = useAuthStore()
  const token = authStore.token
  if (!token && to.path !== '/login') {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    }
  }
  // ...
  // 返回 false 以取消导航
  return true
})

export default router
