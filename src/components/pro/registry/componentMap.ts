import type { Component } from 'vue'

/**
 * 字段组件注册表
 *
 * 以 `Map` 维护「字段类型 -> Vue 组件」的映射，业务侧可通过 `registerField`
 * 注册自定义组件，从而在不改动组件库源码的前提下扩展字段能力。
 */
const fieldRegistry = new Map<string, Component>()

/**
 * 注册（或覆盖）单个字段组件
 *
 * @param type      字段类型标识，如 'input'、'richText'
 * @param component Vue 组件
 */
export function registerField(type: string, component: Component): void {
  fieldRegistry.set(type, component)
}

/**
 * 批量注册字段组件
 *
 * @param fields 字段类型与组件的映射对象
 */
export function registerFields(fields: Record<string, Component>): void {
  Object.entries(fields).forEach(([type, component]) => {
    registerField(type, component)
  })
}

/**
 * 获取字段组件
 *
 * @param type 字段类型标识
 * @returns 命中则返回组件，未命中返回 undefined（由调用方兜底）
 */
export function getField(type?: string): Component | undefined {
  return type ? fieldRegistry.get(type) : undefined
}

/**
 * 判断字段类型是否已注册
 *
 * @param type 字段类型标识
 */
export function hasField(type: string): boolean {
  return fieldRegistry.has(type)
}
