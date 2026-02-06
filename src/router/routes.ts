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
        path: '404',
        component: () => import('@/components/exception/NotFound.vue'),
        meta: {
          title: '404',
          hidden: true
        }
      },
      {
        path: '403',
        component: () => import('@/components/exception/Forbidden.vue'),
        meta: {
          title: '403',
          hidden: true
        }
      },
      {
        path: '',
        component: () => import('@/views/home/Index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'happy',
        component: () => import('@/views/happy/Index.vue'),
        meta: {
          title: 'happy',
          permissions: ['happy']
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/Index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]
