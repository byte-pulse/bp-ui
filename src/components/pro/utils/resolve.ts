import type { ProDynamic, ProValueEnum, ProValueEnumItem } from '../types/field'

/**
 * 解析动态配置值
 *
 * 支持两种形态：
 * 1. 静态值：原样返回
 * 2. 联动函数：以当前表单值为入参调用，实现字段联动
 *
 * @param dynamic 静态值或联动函数
 * @param values  当前表单值
 */
export function resolveDynamic<T, R>(dynamic: ProDynamic<T, R> | undefined, values: T): R | undefined {
  if (typeof dynamic === 'function') {
    // 函数形态：以当前表单值为入参调用
    return (dynamic as (values: T) => R)(values)
  }
  return dynamic
}

/**
 * 归一化字典为统一的字典项数组
 *
 * 支持两种写法：
 * 1. 简写：`{ 1: '启用', 0: '禁用' }`
 * 2. 完整：`{ 1: { label: '启用', value: 1, color: 'green' } }`
 *
 * @param valueEnum 字典定义
 */
export function normalizeValueEnum(valueEnum: ProValueEnum | undefined): ProValueEnumItem[] {
  if (!valueEnum) {
    return []
  }
  return Object.entries(valueEnum).map(([key, item]) => {
    // 简写形态：value 为字符串（对象的 key）
    if (typeof item === 'string') {
      return { label: item, value: key }
    }
    // 完整形态：直接返回
    return item
  })
}

/**
 * 解析字典项：根据原始值在字典中查找对应的展示项
 *
 * @param valueEnum 字典定义
 * @param value     原始值
 */
export function resolveEnumItem(valueEnum: ProValueEnum | undefined, value: unknown): ProValueEnumItem | undefined {
  if (valueEnum === undefined || value === undefined || value === null || value === '') {
    return undefined
  }
  const item = valueEnum[value as string | number]
  if (item === undefined) {
    return undefined
  }
  // 简写形态：补充完整的 value 字段
  if (typeof item === 'string') {
    return { label: item, value: value as string | number | boolean }
  }
  return item
}

/**
 * 归一化分页结果
 *
 * 兼容项目既有 `PageInfo<T>`（含 list/total），
 * 也兼容精简的 `{ list, total }` 形态。
 *
 * @param result 请求结果
 */
export function normalizePageResult<T>(result: PageInfo<T> | { list: T[]; total: number }): {
  list: T[]
  total: number
} {
  if (!result) {
    return { list: [], total: 0 }
  }
  const list = (result as PageInfo<T>).list ?? (result as { list: T[] }).list
  const total = (result as PageInfo<T>).total ?? list?.length ?? 0
  return { list: list ?? [], total }
}
