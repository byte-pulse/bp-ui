import type { Component, VNodeChild } from 'vue'
import type { ProFormField } from './form'
import type { ProTableColumn } from './table'

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 动态记录类型（行数据 / 表单模型）
 *
 * schema 驱动场景下，字段由运行时配置决定，无法静态穷举，
 * 因此统一以宽松索引签名表达。这是本体系内唯一允许出现 `any` 的位置，
 * 业务代码请勿直接书写 `any`，统一使用 `ProRecord`。
 */
export type ProRecord = Record<string, any>

/** 动态字段值：具体类型由 schema 配置在运行时决定 */
export type ProFieldValue = any
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * 动态配置值
 *
 * 支持两种形态：
 * 1. 静态值：直接传入
 * 2. 联动函数：基于当前表单值（表单场景）计算，用于字段联动
 *
 * @example
 * ```ts
 * const disabled: ProDynamic<FormModel, boolean> = (values) => values.type === 'readonly'
 * ```
 */
export type ProDynamic<T, R> = R | ((values: T) => R)

/**
 * 通用自定义渲染函数
 *
 * 表单字段（field.render）与表格单元格（column.render）共用同一套上下文。
 * 返回值直接交给 Vue 渲染，支持 VNode / 字符串 / 数字。
 */
export type ProRenderFn<T = ProRecord> = (ctx: ProRenderContext<T>) => VNodeChild

/**
 * 自定义渲染上下文
 */
export interface ProRenderContext<T = ProRecord> {
  /** 表格场景：当前行数据；表单场景：当前表单值 */
  record: T
  /** 当前字段 / 单元格的值 */
  value: ProFieldValue
  /** 表格行下标（表单场景恒为 -1） */
  index: number
  /** 表格列配置（仅表格场景存在） */
  column?: ProTableColumn<T>
  /** 表单字段配置（仅表单场景存在） */
  field?: ProFormField<T>
}

/**
 * 内置值类型
 *
 * 同时作为「表单字段组件类型」与「表格列值类型」使用，
 * 由 `registry/defaultFields.ts` 统一映射到具体组件。
 */
export type ProValueType =
  | 'text'
  | 'input'
  | 'textarea'
  | 'password'
  | 'digit'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'dateRange'
  | 'time'
  | 'treeSelect'
  | 'cascader'
  | 'upload'
  | 'rate'
  | 'slider'
  /** 表格专用：序号列 */
  | 'index'
  /** 表格专用：操作列（本身不渲染内容，依赖 slot / render） */
  | 'option'

/**
 * 字典项
 */
export interface ProValueEnumItem {
  /** 展示文本 */
  label: string
  /** 实际值 */
  value: string | number | boolean
  /** 表格 tag 颜色，如 'green' | 'red' | '#00b42a' */
  color?: string
  /** 是否禁用（表单场景生效） */
  disabled?: boolean
}

/**
 * 字典定义
 *
 * 支持两种写法：
 * 1. 简写：`{ 1: '启用', 0: '禁用' }`
 * 2. 完整：`{ 1: { label: '启用', value: 1, color: 'green' } }`
 */
export type ProValueEnum = Record<string | number, ProValueEnumItem | string>

/**
 * 字段组件类型标识
 *
 * 允许内置类型，也允许任意自定义字符串（配合 `registerField` 扩展）。
 */
export type ProFieldType = ProValueType | (string & {})

/**
 * 可注册的字段组件
 */
export type ProFieldComponent = Component
