import type { PaginationProps } from '@arco-design/web-vue'
import type { ProValueEnum } from '../types/field'

/**
 * 默认分页配置
 *
 * 与项目既有 `PageInfo` 的字段命名（pageNum / pageSize）解耦，
 * 此处使用 Arco 分页组件的命名（current / pageSize）。
 */
export const defaultPagination: PaginationProps = {
  /** 默认每页条数 */
  pageSize: 10,
  /** 每页条数可选项 */
  pageSizeOptions: [10, 20, 50, 100],
  /** 展示总条数 */
  showTotal: true,
  /** 展示每页条数切换 */
  showPageSize: true,
}

/**
 * 布尔字典
 *
 * 使用数字 1 / 0 表达，便于与后端交互。
 */
export const booleanEnum: ProValueEnum = {
  1: { label: '是', value: 1, color: 'green' },
  0: { label: '否', value: 0, color: 'gray' },
}

/**
 * 创建状态字典
 *
 * @param items 状态项，支持自定义颜色
 */
export function createStatusEnum(
  items: Array<{ label: string; value: string | number; color?: string }>,
): ProValueEnum {
  return items.reduce<ProValueEnum>((acc, item) => {
    acc[item.value] = { label: item.label, value: item.value, color: item.color }
    return acc
  }, {})
}

/**
 * 通用启用 / 禁用字典
 */
export const enableStatusEnum: ProValueEnum = createStatusEnum([
  { label: '启用', value: 1, color: 'green' },
  { label: '禁用', value: 0, color: 'red' },
])
