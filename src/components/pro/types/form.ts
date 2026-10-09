import type { FieldRule } from '@arco-design/web-vue'
import type { ProDynamic, ProFieldType, ProRecord, ProRenderFn, ProValueEnum, ProValueEnumItem } from './field'

/**
 * 表单字段配置（Schema）
 *
 * 一个字段对应一个 `a-form-item`，页面只需声明该数组即可完成表单渲染。
 */
export interface ProFormField<T = ProRecord> {
  /** 字段名，对应表单模型的 key，同时作为 `a-form-item` 的 field */
  fieldName: string
  /** 标签文本；为空时不渲染标签 */
  label?: string
  /** 字段组件类型，见 `ProValueType`；为空时兜底为 input */
  component?: ProFieldType
  /**
   * 透传给字段组件的属性
   * 支持函数形态用于字段联动（入参为当前表单值）
   */
  componentProps?: ProDynamic<T, ProRecord>
  /** 校验规则，直接透传给 Arco */
  rules?: FieldRule[]
  /** 选项：用于 select / radio / checkbox 等；支持函数联动 */
  options?: ProDynamic<T, ProValueEnumItem[]>
  /** 字典：会自动转换为 options 参与表单渲染 */
  valueEnum?: ProValueEnum
  /** 默认值，用于 ProForm 初始化模型 */
  defaultValue?: unknown
  /** 占位提示；不传时由组件默认提供 */
  placeholder?: string
  /** 标签旁的提示信息 */
  tooltip?: string
  /** 栅格占比（24 栅格制），缺省由 `layout.cols` 换算 */
  span?: number
  /** 栅格附加属性，透传给 `a-col` */
  colProps?: ProRecord
  /** 是否隐藏；支持函数联动 */
  hidden?: ProDynamic<T, boolean>
  /** 是否禁用；支持函数联动 */
  disabled?: ProDynamic<T, boolean>
  /** 具名插槽名（优先级高于 component，低于 render） */
  slot?: string
  /** 完全自定义渲染（最高优先级） */
  render?: ProRenderFn<T>
}

/**
 * 表单布局配置
 */
export interface ProFormLayout {
  /** 布局方式，默认 vertical */
  layout?: 'horizontal' | 'vertical' | 'inline'
  /** 每行列数，默认 1；用于自动换算每个字段的 span */
  cols?: number
  /** 标签对齐方式，默认 left（与项目「标题与输入框左对齐」的规范保持一致） */
  labelAlign?: 'left' | 'right'
  /** 标签列属性，透传给 `a-form` */
  labelColProps?: ProRecord
  /** 控件列属性，透传给 `a-form` */
  wrapperColProps?: ProRecord
  /** 栅格行间距 */
  rowGap?: number
}

/**
 * 表单操作区配置
 */
export interface ProFormActions {
  /** 是否展示操作区，默认 true */
  show?: boolean
  /** 是否展示提交按钮，默认 true */
  showSubmit?: boolean
  /** 是否展示重置按钮，默认 true */
  showReset?: boolean
  /** 提交按钮文案 */
  submitText?: string
  /** 重置按钮文案 */
  resetText?: string
  /** 操作区对齐方式，默认 right */
  align?: 'left' | 'center' | 'right'
  /** 完全自定义操作区渲染 */
  render?: ProRenderFn
}
