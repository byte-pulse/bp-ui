import type { FormInstance } from '@arco-design/web-vue'
import type { ProRecord } from './field'
import type { ProTableRecord, ProTableRequestParams } from './table'

/**
 * ProForm 暴露给外部的实例方法
 *
 * 通过组件 `ref` 获取，用于在业务侧编排表单行为。
 */
export interface ProFormInstance<T = ProRecord> {
  /** Arco 原始表单实例，需要更细粒度能力时可直接使用 */
  formRef: FormInstance | undefined
  /** 校验全部字段，通过返回 true */
  validate: () => Promise<boolean>
  /** 校验指定字段，通过返回 true */
  validateField: (field: string | string[]) => Promise<boolean>
  /** 重置字段（不传则重置全部） */
  resetFields: (fields?: string | string[]) => void
  /** 清除校验状态 */
  clearValidate: (fields?: string | string[]) => void
  /** 设置单个字段值 */
  setFieldValue: (field: string, value: unknown) => void
  /** 批量设置字段值 */
  setValues: (values: Partial<T>) => void
  /** 获取当前表单值 */
  getValues: () => T
  /** 滚动到指定字段 */
  scrollToField: (field: string) => void
}

/**
 * ProTable 暴露给外部的实例方法
 */
export interface ProTableInstance<T = ProTableRecord> {
  /** 以当前参数重新加载（保持页码） */
  refresh: () => Promise<void>
  /** 重新加载，可附加参数并回到第一页 */
  reload: (params?: Partial<ProTableRequestParams>) => Promise<void>
  /** 重置搜索条件并回到第一页 */
  reset: () => Promise<void>
  /** 获取当前请求参数 */
  getParams: () => ProTableRequestParams
  /** 获取选中行数据 */
  getSelectedRows: () => T[]
  /** 清空选中 */
  clearSelection: () => void
}

/**
 * ProFormModal 暴露给外部的实例方法
 */
export interface ProFormModalInstance<T = ProRecord> {
  /** 打开弹窗：不传数据为新增，传入数据为编辑 */
  open: (record?: Partial<T>) => void
  /** 关闭弹窗 */
  close: () => void
}
