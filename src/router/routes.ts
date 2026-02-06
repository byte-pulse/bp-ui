import type { AppRouteRecordRaw } from './types'

// 路由配置数组
export const baseRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'parent',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: {
      hidden: false,
      enabled: true
    },
    children: [
      {
        path: '/404',
        name: '404',
        component: () => import('@/components/exception/NotFound.vue'),
        meta: {
          title: '404',
          hidden: true
        }
      },
      {
        path: '/403',
        name: '403',
        component: () => import('@/components/exception/Forbidden.vue'),
        meta: {
          title: '403',
          hidden: true
        }
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/Index.vue'),
        meta: {
          title: '首页',
          icon: 'antd/HomeOutlined'
        }
      },
      {
        path: '/home/happy',
        name: 'happy',
        component: () => import('@/views/happy/Index.vue'),
        meta: {
          title: '开心一下',
          parentName: 'home',
          icon: 'ionicons5/AccessibilityOutline'
        }
      },
      {
        path: '/icon',
        name: 'icon',
        component: () => import('@/views/icon/Index.vue'),
        meta: {
          title: '图标库',
          icon: 'antd/ItalicOutlined',
          parentName: 'home'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'name',
    component: () => import('@/views/login/Index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'ereryPath',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]
