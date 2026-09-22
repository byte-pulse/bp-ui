// src/router/types.ts
import type { RouteRecordRaw } from 'vue-router'

/**
 * 定义路由元信息类型
 * requiresAuth, permissions, roles 三者是与关系
 */
export interface RouteMeta {
  enabled?: boolean // 启用
  hidden?: boolean // 隐藏
  title?: string // 标题
  icon?: string // 图标
  requiresAuth?: boolean // 是否需要登陆
  permissions?: string[] // 权限
  roles?: string[] // 角色
}

// 扩展的路由记录类型
export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}
