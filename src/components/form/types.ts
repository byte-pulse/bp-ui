import type { FieldRule } from '@arco-design/web-vue'

/**
 * 支持的字段控件类型
 */
export type FormFieldType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'date-range'
  | 'time'
  | 'slider'
  | 'rate'

/**
 * 单选项，用于 select / radio / checkbox
 */
export interface FormFieldOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

/**
 * 单个字段配置
 */
export interface FormField {
  /** 字段名，对应表单数据的 key */
  field: string
  /** 标签文本 */
  label: string
  /** 控件类型 */
  type: FormFieldType
  /** 占位提示，未设置时按类型自动生成 */
  placeholder?: string
  /** 栅格占位（24 栅格制），设置后优先于列数计算，可用于让字段独占一行 */
  span?: number
  /** 默认值 */
  defaultValue?: unknown
  /** 选项（select / radio / checkbox 使用） */
  options?: FormFieldOption[]
  /** 校验规则，支持单条或多条 */
  rules?: FieldRule | FieldRule[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否隐藏（不渲染该字段，但其值仍保留在表单数据中） */
  hidden?: boolean
  /** 标签旁提示文案 */
  tooltip?: string
  /** 透传给具体控件的额外属性，如 { maxLength: 20 } */
  props?: Record<string, unknown>
}

/**
 * 分组配置，一个分组内的字段共享同一套列数
 */
export interface FormGroup {
  /** 分组标题，不填则不渲染分割线 */
  title?: string
  /** 分组内列数，会覆盖全局列数 */
  columns?: number
  /** 分组字段集合 */
  fields: FormField[]
}

/**
 * 表单整体配置
 */
export interface FormConfig {
  /** 全局列数：1 = 单列、2 = 两列、3 = 三列，默认 1 */
  columns?: number
  /** 标签布局，默认 vertical */
  layout?: 'vertical' | 'horizontal'
  /** 标签对齐方式，默认 right */
  labelAlign?: 'left' | 'right'
  /** 组件尺寸，默认 medium */
  size?: 'mini' | 'small' | 'medium' | 'large'
  /** 分组集合 */
  groups: FormGroup[]
}

/**
 * Form 组件对外暴露的方法
 */
export interface FormExpose {
  /** 校验表单，返回是否通过 */
  validate: () => Promise<boolean>
  /** 重置为初始值 */
  reset: () => void
  /** 清除校验状态 */
  clearValidate: () => void
  /** 获取当前表单数据副本 */
  getValues: () => Record<string, unknown>
}
