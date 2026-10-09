/**
 * Pro 组件体系唯一出口
 *
 * 业务侧统一从此处引入，避免深层路径依赖：
 *
 * ```ts
 * import { ProTable, ProFormModal, useProTable, type ProTableColumn } from '@/components/pro'
 * ```
 *
 * 说明：组件本身已由 `unplugin-vue-components` 按文件名全局注册
 * （`ProForm` / `ProTable` / `ProFormModal` 可直接在模板中使用），
 * 此处导出主要用于类型声明与显式引入场景。
 */

/* ------------------------------ 组件 ------------------------------ */

export { default as ProForm } from './components/ProForm.vue'
export { default as ProFormItem } from './components/ProFormItem.vue'
export { default as ProFormModal } from './components/ProFormModal.vue'
export { default as ProTable } from './components/ProTable.vue'
export { default as ProTableCell } from './components/ProTableCell.vue'

/* ------------------------------ 组合式函数 ------------------------------ */

export * from './hooks/useProForm'
export * from './hooks/useProTable'

/* ------------------------------ 注册表 ------------------------------ */

export * from './registry/componentMap'

/* ------------------------------ 预设 ------------------------------ */

export * from './presets'

/* ------------------------------ 工具函数 ------------------------------ */

export * from './utils/resolve'

/* ------------------------------ 类型 ------------------------------ */

export type * from './types'
