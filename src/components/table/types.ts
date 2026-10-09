import type { FormField } from '@/components/form/types'
import type { TableBorder, TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import type { VNodeChild } from 'vue'

/** 表格行数据 */
export type TableRecord = Record<string, unknown>

/** 单元格自定义渲染参数 */
export interface TableRenderParams {
  record: TableRecord
  column: TableColumnData
  rowIndex: number
}

/**
 * 表格列配置，在 Arco 列定义基础上做了「配置友好」的收窄
 */
export interface TableColumn extends Omit<TableColumnData, 'sortable' | 'render'> {
  /** 列字段名 */
  dataIndex: string
  /** 列标题 */
  title: string
  /** 是否开启排序（远程模式走后端排序，本地模式前端排序） */
  sortable?: boolean
  /** 自定义单元格渲染，优先级高于 slotName */
  render?: (params: TableRenderParams) => VNodeChild
}

/**
 * 头部搜索区配置，字段复用表单字段配置
 */
export interface TableSearchConfig {
  /** 搜索字段集合 */
  fields: FormField[]
  /** 每行列数，默认 4 */
  columns?: number
  /** 查询按钮文案，默认「查询」 */
  searchText?: string
  /** 重置按钮文案，默认「重置」 */
  resetText?: string
  /** 是否可折叠；不填时字段超过一行自动折叠 */
  collapsible?: boolean
  /** 折叠态是否默认收起，默认 true */
  defaultCollapsed?: boolean
}

/** 远程请求参数 */
export interface TableRequestParams {
  pageNum: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
  [key: string]: unknown
}

/** 远程请求响应 */
export interface TableResponse<T = TableRecord> {
  list: T[]
  total: number
}

/** 导出请求参数：当前搜索条件与排序（不含分页），以及选中的行主键 */
export interface TableExportParams {
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'ascend' | 'descend'
  /** 选中的行主键；有值时导出选中数据，为空则按搜索条件导出全部 */
  keys?: (string | number)[]
  [key: string]: unknown
}

/**
 * 导出配置，配置后工具栏右侧渲染导出按钮
 */
export interface TableExportConfig {
  /** 导出请求：接收查询条件与选中主键，由调用方完成后端导出与文件下载 */
  request: (params: TableExportParams) => Promise<void> | void
  /** 按钮文案，默认「导出」 */
  text?: string
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 工具栏内置功能开关，不填时全部开启
 */
export interface TableToolbarConfig {
  /** 是否显示「设置」下拉（密度 / 边框 / 斑马纹 / 列显隐），默认 true */
  settings?: boolean
  /** 是否显示刷新按钮，默认 true */
  refresh?: boolean
  /** 是否显示选中操作（查看选中 / 清空选择），开启行选择时生效，默认 true */
  selection?: boolean
}

/** 分页配置 */
export interface TablePagination {
  /** 每页条数，默认 15 */
  pageSize?: number
  /** 每页条数可选项，默认 [15, 30, 50] */
  pageSizeOptions?: number[]
  /** 是否显示总数，默认 true */
  showTotal?: boolean
  /** 是否显示每页条数切换器，默认 true */
  showPageSize?: boolean
  /** 是否显示快速跳转，默认 true */
  showJumper?: boolean
  /** 是否显示更多页码，默认 true */
  showMore?: boolean
}

/**
 * 表格整体配置
 */
export interface TableConfig {
  /** 列配置 */
  columns: TableColumn[]
  /** 行主键字段，默认 id */
  rowKey?: string
  /** 静态数据源，与 request 二选一 */
  data?: TableRecord[]
  /** 远程数据请求，与 data 二选一 */
  request?: (params: TableRequestParams) => Promise<TableResponse>
  /** 是否初始化自动加载，默认 true */
  immediate?: boolean
  /** 头部搜索区配置，不填则不渲染搜索区 */
  search?: TableSearchConfig
  /** 表格标题，默认「数据列表」 */
  title?: string
  /** 是否显示序号列，默认 false */
  showIndex?: boolean
  /** 序号列个性化配置，透传 Arco 列定义 */
  indexColumn?: Partial<TableColumnData>
  /** 行选择配置，传 true 时使用多选 */
  rowSelection?: boolean | TableRowSelection
  /** 是否显示边框，默认 true */
  bordered?: boolean | TableBorder
  /** 是否显示斑马纹，默认 true */
  stripe?: boolean
  /** 组件尺寸，默认 large（宽松） */
  size?: 'mini' | 'small' | 'medium' | 'large'
  /** 空数据文案，默认「暂无数据」 */
  emptyText?: string
  /** 表头是否吸顶，默认 true */
  stickyHeader?: boolean
  /** 滚动配置，横向固定列时可配置 x */
  scroll?: { x?: number; y?: number; minWidth?: number; maxWidth?: number }
  /** 分页配置，传 false 关闭分页 */
  pagination?: boolean | TablePagination
  /** 导出配置，配置后工具栏右侧渲染导出按钮（走后端接口导出） */
  export?: TableExportConfig
  /** 工具栏内置功能配置，传 false 隐藏全部内置按钮 */
  toolbar?: boolean | TableToolbarConfig
}

/**
 * Table 组件对外暴露的方法
 */
export interface TableExpose {
  /** 重新加载当前页 */
  reload: () => Promise<void>
  /** 使用当前搜索条件查询（回到第一页） */
  search: () => Promise<void>
  /** 重置搜索条件并重新加载 */
  reset: () => Promise<void>
  /** 获取当前选中行主键 */
  getSelectedKeys: () => (string | number)[]
  /** 清空选中 */
  clearSelection: () => void
  /** 获取当前搜索条件副本 */
  getSearchValues: () => Record<string, unknown>
}
