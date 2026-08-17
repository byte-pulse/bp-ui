// src/utils/iconUtils.ts
import { h, type VNode } from 'vue'
import { NIcon } from 'naive-ui'

import * as ionicons5 from '@vicons/ionicons5'
import * as antd from '@vicons/antd'

// 运行时支持的 icon 库
const iconMaps: Record<string, Record<string, Component>> = {
  ionicons5: ionicons5 as Record<string, Component>,
  antd: antd as Record<string, Component>,
}

/**
 * icon 字符串格式: lib/iconName
 * 示例: ionicons5/AppsOutline
 */
export function renderIconUtil(icon?: string | unknown): () => VNode {
  if (!icon) {
    icon = 'ionicons5/Apps'
  }

  if (typeof icon !== 'string') {
    return () =>
      h(NIcon, null, {
        default: () => h(iconMaps['ionicons5']?.['Apps'] as Component),
      })
  }

  let [lib, iconName] = icon.split('/')
  if (!lib || !iconName) {
    lib = 'ionicons5'
    iconName = 'Apps'
  }

  const iconComp = iconMaps[lib]?.[iconName]

  if (!iconComp) {
    return () =>
      h(NIcon, null, {
        default: () => h(iconMaps['antd']?.['Apps'] as Component),
      })
  }

  return () => h(NIcon, null, { default: () => h(iconComp) })
}

/**
 * icon 字符串格式: lib/iconName
 * 示例: ionicons5/AppsOutline
 * 不使用 NIcon 包裹
 */
export function renderIconUtilNoNIcon(icon?: string | unknown): () => VNode {
  if (!icon) {
    icon = 'ionicons5/Apps'
  }

  if (typeof icon !== 'string') {
    return () => h(iconMaps['ionicons5']?.['Apps'] as Component)
  }

  let [lib, iconName] = icon.split('/')
  if (!lib || !iconName) {
    lib = 'ionicons5'
    iconName = 'Apps'
  }

  const iconComp = iconMaps[lib]?.[iconName]
  if (!iconComp) {
    return () => h(iconMaps['ionicons5']?.['Apps'] as Component)
  }

  return () => h(iconComp)
}
