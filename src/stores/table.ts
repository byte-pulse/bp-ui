import type { TableBorder } from '@arco-design/web-vue'
import { defineStore } from 'pinia'

/**
 * 表格外观偏好：全局共享并持久化到 localStorage，
 * 用户在工具栏「设置」中的调整刷新后仍然生效。
 * 字段为空表示用户尚未调整，由 Table 组件回落到表格配置或内置默认值。
 */
export const useTableStore = defineStore(
  'table',
  () => {
    // 组件密度，默认宽松
    const size = ref<'mini' | 'small' | 'medium' | 'large'>()
    // 是否显示边框，默认开启
    const bordered = ref<boolean | TableBorder>()
    // 是否显示斑马纹，默认开启
    const stripe = ref<boolean>()
    // 每页条数，默认 15
    const pageSize = ref<number>()

    return { size, bordered, stripe, pageSize }
  },
  {
    persist: true,
  },
)
