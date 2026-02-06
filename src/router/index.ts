import { createRouter, createWebHistory } from 'vue-router'
import { baseRoutes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes]
})

router.beforeEach((to, _) => {
  $loadingBar.start()
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
  const metaPerm = to.meta.permissions as string[]
  if (metaPerm) {
    const hasAuth = metaPerm.every((p) => authStore.permission.includes(p))

    if (!hasAuth) {
      return '/403'
    }
  }
  return true
})

router.afterEach((to, _) => {
  if (to.path === '/404' || to.path === '/403') {
    $loadingBar.error()
    return
  }
  $loadingBar.finish()
})

export default router
