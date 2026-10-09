import type { PaginationProps, TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import type { ProRecord, ProRenderFn, ProValueEnum, ProValueType } from './field'
import type { ProFormField } from './form'

/** 表格数据项基础约束：字段由业务数据决定，统一使用动态记录类型 */
export type ProTableRecord = ProRecord

/**
 * 表格列配置（Schema）
 */
export interface ProTableColumn<T = ProTableRecord> {
  /** 字段名，同时作为列插槽名（`#column-{dataIndex}`） */
  dataIndex: string
  /** 列标题 */
  title: string
  /** 列值类型，决定默认渲染方式（字典 / 标签 / 图片 / 序号等） */
  valueType?: ProValueType | (string & {})
  /** 字典：用于把原始值映射为展示文本与标签颜色 */
  valueEnum?: ProValueEnum
  /** 列宽 */
  width?: number
  /** 最小列宽 */
  minWidth?: number
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 固定列 */
  fixed?: 'left' | 'right'
  /** 超长省略 */
  ellipsis?: boolean
  /** 超长省略时是否展示 tooltip */
  tooltip?: boolean
  /** 是否开启后端排序（会透传 sortField / sortOrder 给 request） */
  sorter?: boolean
  /** 筛选项（后端筛选，multiMultiple 控制是否多选） */
  filters?: { text: string; value: string | number }[]
  /** 筛选是否多选，默认 false */
  filterMultiple?: boolean
  /** 单元格自定义渲染（优先级高于 slot 与默认渲染器） */
  render?: ProRenderFn<T>
  /** 单元格插槽名（优先级低于 render，高于默认渲染器） */
  slot?: string
  /** 是否在表格中默认隐藏（仍可在列设置中开启） */
  hideInTable?: boolean
  /** 是否不参与搜索区渲染 */
  hideInSearch?: boolean
  /** 搜索区中该字段的栅格占比 */
  searchSpan?: number
  /** 覆盖搜索区自动生成的表单项配置 */
  searchFieldProps?: Partial<ProFormField<T>>
  /** 是否展示复制按钮（文本类型生效） */
  copyable?: boolean
  /** 透传给 Arco 列的额外属性 */
  columnProps?: Partial<TableColumnData>
}

/**
 * 操作列按钮配置
 *
 * 操作列由 ProTable 依据该配置自动生成，页面无需再手写 `#column-option` 插槽模板：
 * 按钮文案、形态、显隐规则全部集中在配置里，页面只提供点击回调。
 */
export interface ProTableAction<T = ProTableRecord> {
  /** 唯一标识（作为列表 key，也便于埋点区分） */
  key: string
  /** 按钮文案 */
  label: string
  /** 按钮类型，默认 text（表格内操作按钮推荐 text） */
  type?: 'text' | 'primary' | 'secondary' | 'dashed' | 'outline'
  /** 按钮状态色，危险操作使用 danger */
  status?: 'normal' | 'warning' | 'success' | 'danger'
  /** 按钮尺寸，默认 small */
  size?: 'mini' | 'small' | 'medium' | 'large'
  /** 图标名（IIcon 图标集名称） */
  icon?: string
  /** 是否禁用；传函数时按当前行数据判断 */
  disabled?: boolean | ((record: T) => boolean)
  /** 是否展示；传函数时按当前行数据判断，返回 false 时不渲染该按钮 */
  visible?: boolean | ((record: T) => boolean)
  /** 点击回调，入参为当前行数据 */
  onClick?: (record: T) => void | Promise<void>
}

/**
 * 操作列形态配置
 *
 * 仅描述列本身，按钮内容由 `actions` 决定。
 */
export interface ProTableActionColumn {
  /** 列标题，默认「操作」 */
  title?: string
  /** 列宽，默认 160 */
  width?: number
  /** 固定位置，默认 right；传 false 表示不固定 */
  fixed?: 'left' | 'right' | false
  /** 对齐方式，默认 center */
  align?: 'left' | 'center' | 'right'
}

/** 表格请求参数 */
export interface ProTableRequestParams {
  /** 当前页码（从 1 开始） */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'ascend' | 'descend'
  /** 其余为搜索区字段 */
  [key: string]: unknown
}

/** 后端返回的精简结果 */
export interface ProTableResult<T = ProTableRecord> {
  list: T[]
  total: number
}

/**
 * 表格数据源函数
 *
 * 兼容项目既有 `PageInfo<T>`，也兼容精简的 `{ list, total }`。
 */
export type ProTableRequest<T = ProTableRecord> = (
  params: ProTableRequestParams,
) => Promise<PageInfo<T> | ProTableResult<T>>

/** 搜索区配置 */
export interface ProTableSearchConfig<T = ProTableRecord> {
  /** 搜索字段 schema；不传时自动从 columns 推导 */
  schema?: ProFormField<T>[]
  /** 每行列数，默认 3 */
  cols?: number
  /** 是否支持展开 / 收起，默认 true */
  collapsible?: boolean
  /** 初始是否收起 */
  defaultCollapsed?: boolean
  /** 是否展示搜索区，默认 true */
  show?: boolean
}

/** 工具栏配置 */
export interface ProTableToolbarConfig {
  /** 工具栏标题 */
  title?: string
  /** 是否展示刷新按钮，默认 true */
  showRefresh?: boolean
  /** 是否展示全屏按钮，默认 true */
  showFullscreen?: boolean
  /** 是否展示列设置按钮，默认 true */
  showColumnSetting?: boolean
  /** 是否展示「其他功能」按钮（密度 / 边框 / 斑马纹），默认 true */
  showDisplaySetting?: boolean
}

/**
 * 分页水平位置
 *
 * - `start`：靠左
 * - `center`：居中
 * - `end`：靠右（默认）
 */
export type ProTablePaginationPosition = 'start' | 'center' | 'end'

/** 分页配置 */
export interface ProTablePaginationConfig extends Partial<PaginationProps> {
  /** 是否展示分页，默认 true */
  show?: boolean
  /**
   * 分页水平位置，默认 `end`（靠右）
   *
   * 分页始终固定于表格容器底部，该配置只决定其在底部区域内的水平对齐方式。
   */
  position?: ProTablePaginationPosition
}

/** 行选择配置（复用 Arco 定义） */
export type ProTableRowSelection = TableRowSelection
