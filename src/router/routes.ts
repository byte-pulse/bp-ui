// src/router/routes.ts
import type { AppRouteRecordRaw } from './types'

// 路由配置数组
export const baseRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: {
      hidden: false,
      enabled: true
    },
    children: [
      {
        path: '',
        component: () => import('@/views/home/Index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          enabled: true
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/Index.vue')
  }
]
