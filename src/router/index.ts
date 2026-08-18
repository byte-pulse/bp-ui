import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getRouteTree } from '@/api/menu'

// 导入所有视图组件
const modules = import.meta.glob('@/views/**/*.vue')

// 基础路由
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/exception/NotFound.vue'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/exception/ForbiddenPage.vue'),
  },
]

// 是否加载完成
let isLoaded = false

let allRoutes: RouteRecordRaw[] = []

// 获取动态生成的路由
export async function getDynamicRoutes() {
  if (isLoaded) {
    return
  }
  isLoaded = true
  try {
    const menus = await getRouteTree()
    const routes = generateRoutes(menus)
    allRoutes = [...routes, ...baseRoutes]
    // 动态添加路由
    allRoutes.forEach((route) => {
      router.addRoute('layout', route)
    })
  } catch (err) {
    console.error('Failed to load dynamic routes:', err)
  }
}

// 扁平化生成路由
function generateRoutes(menus: Menu[], parentPath = ''): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  menus.forEach((menu) => {
    // 拼完整路径
    const fullPath = parentPath ? `${parentPath}/${menu.routeName}` : `/${menu.routeName}`

    // 只要是页面（有 component）就生成路由
    if (menu.component) {
      result.push({
        path: fullPath,
        name: menu.routeName,
        component: modules[`/src/views/${menu.component}.vue`],
        meta: {
          ...menu,
          children: undefined,
        },
      } as RouteRecordRaw)
    }

    // 继续递归 children（但不嵌套）
    if (menu.children?.length) {
      result.push(...generateRoutes(menu.children, fullPath))
    }
  })

  return result
}
// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layout/Layout.vue'),
      children: baseRoutes,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'ereryPath',
      redirect: '/404',
    },
  ],
})

// 前置守卫
router.beforeEach(async (to, _) => {
  $loadingBar.start()
  const path = to.path

  if (!isLoaded) {
    await getDynamicRoutes()
    // 如果访问的是 /，跳第一个动态路由
    if (path === '/') {
      const firstRoute = allRoutes[0]
      if (firstRoute) {
        return { name: firstRoute.name, replace: true }
      }
    }
    return { ...to, replace: true }
  }

  if (path === '/login') {
    return true
  }

  const authStore = useAuthStore() // 已加载后再兜底一次
  if (to.path === '/') {
    const firstRoute = allRoutes[0]
    if (firstRoute) {
      return { name: firstRoute.name, replace: true }
    }
  }

  if (authStore.token) {
    return true
  } else {
    return { name: 'login' }
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
