import { createRouter, createWebHistory } from 'vue-router'
import { baseRoutes } from './routes'
import type { RouteMeta } from './types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes]
})

// 前置守卫
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
  // 判断是否启用
  const enabled = (to.meta as RouteMeta).enabled
  if (enabled === false && to.path !== '/404') {
    return '/404'
  }

  const metaPerm = to.meta.permissions as string[]
  if (metaPerm) {
    const hasAuth = metaPerm.every((p) => authStore.permission.includes(p))

    if (!hasAuth) {
      return '/403'
    }
  }
  // 处理 / 的重定向
  if (to.name === 'parent') {
    const parent = router.getRoutes().find((r) => r.name === 'parent')
    if (parent && parent.children.length > 0) {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i]

        if (child?.name === '404' || child?.name === '403') {
          continue
        }
        const target = child?.path.startsWith('/')
          ? child.path
          : `${parent.path.replace(/\/$/, '')}/${child?.path}`

        return target
      }
    }
  }
  return true
})

// 后置守卫
router.afterEach((to, _) => {
  if (to.path === '/404' || to.path === '/403') {
    $loadingBar.error()
    return
  }
  $loadingBar.finish()
})

export function initRouter() {
  const authStore = useAuthStore()
  if (authStore?.token) {
    // 添加动态路由
    // router.addRoute('parent')
  }
}

// 路由准备
router.isReady().then(() => {
  initRouter()
})

export default router
