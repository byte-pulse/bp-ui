<script lang="ts" setup>
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { TableColumnData } from '@arco-design/web-vue'
import Sortable from 'sortablejs'
import type { ProRecord } from '../types/field'
import type { ProFormField, ProFormLayout } from '../types/form'
import type { ProTableInstance } from '../types/instance'
import type {
  ProTableAction,
  ProTableActionColumn,
  ProTableColumn,
  ProTablePaginationConfig,
  ProTablePaginationPosition,
  ProTableRecord,
  ProTableRequest,
  ProTableRequestParams,
  ProTableRowSelection,
  ProTableSearchConfig,
  ProTableToolbarConfig,
} from '../types/table'
import { defaultPagination } from '../presets'
import { normalizePageResult } from '../utils/resolve'
import ProForm from './ProForm.vue'
import ProTableActions from './ProTableActions.vue'
import ProTableCell from './ProTableCell.vue'

/**
 * 配置化表格组件
 *
 * 内聚「搜索区 + 工具栏 + 表格 + 分页 + 请求」五块通用能力，
 * 业务侧只需提供 `columns`（列配置）与 `request`（数据源函数），不参与任何通用逻辑。
 */
defineOptions({ name: 'ProTable' })

/** 表格尺寸可选值（用于持久化设置的运行时校验） */
const TABLE_SIZES = ['mini', 'small', 'medium', 'large'] as const

/** 表格尺寸 */
type TableSize = (typeof TABLE_SIZES)[number]

/** 操作列的列标识：仅用于内部渲染，不会出现在业务列集合与列设置中 */
const ACTION_COLUMN_KEY = 'pro-action-column'

/** 密度可选项（面板中以 tab 形式展示） */
const DENSITY_OPTIONS: { value: TableSize; label: string; desc: string }[] = [
  { value: 'mini', label: '紧凑', desc: '行高最小，适合一屏展示更多数据' },
  { value: 'small', label: '较紧', desc: '略微收紧行高，兼顾密度与可读性' },
  { value: 'medium', label: '默认', desc: '组件默认行高，日常表格推荐使用' },
  { value: 'large', label: '宽松', desc: '行高宽松，适合需要强调可读性的场景' },
]

/**
 * 搜索区折叠动画时长（ms）
 *
 * 必须与样式中 `.search-expand` 的过渡时长保持一致。
 */
const SEARCH_COLLAPSE_DURATION = 250

/**
 * 搜索区单个字段的最小可用宽度（px）
 *
 * 用于按容器宽度换算每行能放下几个字段，而不是写死屏幕断点：
 * 侧边栏收展、窗口缩放等宽度变化都能得到合理列数，
 * 宽屏一行放满 `search.cols` 个字段，变窄时依次降级，避免字段被挤扁。
 */
const SEARCH_FIELD_MIN_WIDTH = 300

/**
 * 表体高度的最大校正轮数
 *
 * `scroll.y` 生效后 Arco 才会把表头拆成独立节点，表头从这一刻才开始占位，
 * 因此首次测量会偏大；最多校正 3 轮，测量稳定即提前结束，避免无限重算。
 */
const MAX_MEASURE_ROUNDS = 3

/**
 * 表体最小可用高度（px）
 *
 * 与 Arco 的 `.arco-table-body { min-height: 40px }` 对齐：低于该值时表体已无法再压缩，
 * 此时不再限高（退化为不限高），避免算出 `scroll.y = 0` 这类会让表头反复拆装的抖动值。
 */
const BODY_MIN_HEIGHT = 40

/**
 * Arco 表格分页位置
 *
 * 完整取值为 `tl / top / tr / bl / bottom / br`，本组件只使用其中的底部形态。
 */
type TablePagePosition = 'bl' | 'bottom' | 'br'

/**
 * 分页位置到 Arco `page-position` 的映射
 *
 * Arco 表格用 `page-position` 同时表达「上下位置」与「水平对齐」，
 * 取值形如 `tl / top / tr / bl / bottom / br`；本组件只表达「底部 + 水平对齐」，
 * 因此统一取 `b` 前缀（bottom），把水平对齐差异映射成 `l / 空 / r`。
 * 未赋值时 Arco 默认 `br`（靠右）。
 */
const PAGE_POSITION_MAP: Record<ProTablePaginationPosition, TablePagePosition> = {
  /** 靠左 */
  start: 'bl',
  /** 居中 */
  center: 'bottom',
  /** 靠右 */
  end: 'br',
}

/**
 * `a-table` 的 scroll 配置结构
 *
 * Arco 未导出该类型（内联在组件 props 中），此处按官方定义复刻。
 */
type TableScroll = {
  /** 横向滚动阈值（列总宽超出时出现横向滚动条） */
  x?: string | number
  /** 纵向滚动阈值：表体最大高度，达到后表体内部滚动 */
  y?: string | number
  /** 最小宽度 */
  minWidth?: string | number
  /** 整个表格内容的最大高度 */
  maxHeight?: string | number
}

const props = withDefaults(
  defineProps<{
    /** 列配置数组 */
    columns: ProTableColumn[]
    /** 数据源函数（服务端分页模式） */
    request?: ProTableRequest
    /** 静态数据（不传 request 时生效） */
    data?: ProTableRecord[]
    /** 行唯一标识字段 */
    rowKey?: string
    /** 搜索区配置 */
    search?: ProTableSearchConfig
    /** 分页配置 */
    pagination?: ProTablePaginationConfig
    /** 工具栏配置 */
    toolbar?: ProTableToolbarConfig
    /** 行选择配置 */
    rowSelection?: ProTableRowSelection
    /**
     * 操作列按钮配置
     *
     * 配置非空时自动在表格尾部追加操作列，列本身不参与列设置与拖拽排序，
     * 始终固定在最右侧，避免被业务误隐藏。
     */
    actions?: ProTableAction[]
    /** 操作列形态配置（标题 / 列宽 / 固定位置 / 对齐） */
    actionColumn?: ProTableActionColumn
    /** 固定请求参数 */
    defaultParams?: Record<string, unknown>
    /** 是否挂载后立即请求，默认 true */
    immediate?: boolean
    /** 外部控制的 loading 态 */
    loading?: boolean
    /** 透传给 `a-table` 的额外属性 */
    tableProps?: Record<string, unknown>
    /**
     * 自适应高度
     *
     * 开启后表格占满父容器中「搜索区 + 工具栏」之外的全部剩余高度：
     * 表体内部滚动，表头与分页保持固定，避免整页滚动。
     *
     * 说明：需要页面根节点具备确定高度（如 `h-full`）才能生效；
     * 若父容器高度由内容撑开，则自动退化为不限高，行为与关闭时一致。
     */
    adaptiveHeight?: boolean
  }>(),
  {
    request: undefined,
    data: undefined,
    rowKey: 'id',
    search: () => ({ show: true, cols: 3, collapsible: true }),
    pagination: () => ({ show: true }),
    toolbar: () => ({ showRefresh: true, showFullscreen: true, showColumnSetting: true, showDisplaySetting: true }),
    rowSelection: undefined,
    actions: undefined,
    actionColumn: () => ({}),
    defaultParams: () => ({}),
    immediate: true,
    loading: false,
    tableProps: () => ({}),
    adaptiveHeight: true,
  },
)

const emit = defineEmits<{
  (e: 'load', result: unknown): void
  (e: 'requestError', error: unknown): void
  (e: 'paramsChange', params: ProTableRequestParams): void
  (e: 'selectionChange', rows: ProTableRecord[]): void
  (e: 'rowClick', record: ProTableRecord): void
}>()

const slots = useSlots()

/* ------------------------------ 内部状态 ------------------------------ */

/** 搜索区表单值 */
const searchForm = ref<ProRecord>({})
/** 已提交的搜索条件 */
const searchParams = ref<ProRecord>({})
/** 当前页码 */
const pageNum = ref(1)
/** 每页条数 */
const pageSize = ref(defaultPagination.pageSize ?? 10)
/** 排序状态 */
const sorter = ref<{ field: string; direction: 'ascend' | 'descend' }>()
/** 筛选状态 */
const filters = ref<Record<string, string[]>>({})
/** 表格数据 */
const dataSource = ref<ProTableRecord[]>([])
/** 总条数 */
const total = ref(0)
/** 内部 loading */
const innerLoading = ref(false)
/** 选中行 key */
const selectedKeys = ref<Array<string | number>>([])
/** 搜索区是否收起 */
const collapsed = ref(false)
/** 表格尺寸 */
const size = ref<TableSize>('medium')
/** 隐藏的列 key 集合 */
const hiddenColumnKeys = ref<string[]>([])
/** 列顺序（dataIndex 数组），支持在列设置中拖拽调整 */
const columnOrder = ref<string[]>([])
/** 是否展示表格边框 */
const bordered = ref(false)
/** 是否展示斑马纹 */
const stripe = ref(false)
/** 是否处于全屏（覆盖视口）状态 */
const maximized = ref(false)

/* ------------------------------ 自适应高度 ------------------------------ */

/** 搜索区容器（仅用于量取宽度，不参与尺寸监听） */
const searchWrapperRef = ref<HTMLElement>()

/** 表格区域容器（搜索区与工具栏之外的可伸缩区域） */
const tableWrapperRef = ref<HTMLElement>()

/** 表体最大高度（px）；为 undefined 表示不限高 */
const bodyHeight = ref<number>()

/**
 * 搜索区实际列数
 *
 * 以 `search.cols` 为上限，按容器宽度自适应：全屏三列，窄屏依次降为两列、一列。
 */
const effectiveSearchCols = ref(3)

/** 尺寸监听器，用于容器尺寸变化时重新计算表体高度 */
let resizeObserver: ResizeObserver | undefined

/** 重算调度句柄：同一帧内只重算一次 */
let measureFrame: number | undefined

/** 搜索区折叠动画进行中标记：动画期间不重算，避免表体高度反复跳动 */
let collapseAnimating = false

/** 业务侧透传的 `a-table` scroll 配置 */
const userScroll = computed<TableScroll>(() => (props.tableProps?.scroll as TableScroll | undefined) ?? {})

/**
 * 最终 scroll 配置
 *
 * 自适应高度时补充 `y`（表体最大高度），使表头与分页固定、仅表体滚动；
 * 未启用（或尚未测量）时原样透传业务侧配置。
 */
const tableScroll = computed<TableScroll | undefined>(() => {
  const merged: TableScroll = { ...userScroll.value }
  if (bodyHeight.value !== undefined) {
    merged.y = bodyHeight.value
  }
  return Object.keys(merged).length ? merged : undefined
})

/**
 * 元素的外框高度（含上下外边距）
 *
 * 使用 `offsetHeight` 而非 `getBoundingClientRect()`：前者与滚动位置无关，
 * 表格内容溢出容器时依然返回元素的真实高度。
 *
 * @param element 目标元素（可为空）
 * @returns 外框高度（px）；元素不存在时返回 0
 */
const outerHeight = (element: Element | null): number => {
  if (!(element instanceof HTMLElement)) {
    return 0
  }
  const style = window.getComputedStyle(element)
  const marginTop = Number.parseFloat(style.marginTop) || 0
  const marginBottom = Number.parseFloat(style.marginBottom) || 0
  return element.offsetHeight + marginTop + marginBottom
}

/**
 * 元素的纵向边框宽度之和
 *
 * 表格容器开启 `bordered` 时自带上下边框，需要从可用高度中扣除。
 *
 * @param element 目标元素（可为空）
 * @returns 纵向边框占用高度（px）；元素不存在时返回 0
 */
const verticalBorderWidth = (element: Element | null): number => {
  if (!(element instanceof HTMLElement)) {
    return 0
  }
  const style = window.getComputedStyle(element)
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0
  const borderBottom = Number.parseFloat(style.borderBottomWidth) || 0
  return borderTop + borderBottom
}

/**
 * 量取表体可用高度
 *
 * 不能用「分页顶部 − 表头底部」来量：表体内容超高时整张表格会溢出容器，
 * 分页自身也已被顶到容器之外，量到的是「溢出后的位置」，会形成自我参照的坏值，
 * 结果就是把分页永久挤出可视区。
 *
 * 因此改为「容器可用高度 − 表体之外的全部占位高度」：
 * 占位高度 = 表头外框高 + 分页外框高 + 表格容器纵向边框，三者都与滚动位置无关。
 *
 * @returns 表体可用高度（px）；容器尚未渲染或可用高度不足时返回 undefined
 */
const measureBodyHeight = (): number | undefined => {
  const wrapper = tableWrapperRef.value
  if (!wrapper) {
    return undefined
  }
  // 页面根节点缺少确定高度（如未声明 h-full）时容器高度为 0，此时退化为不限高
  if (wrapper.clientHeight <= 0) {
    return undefined
  }
  const header = wrapper.querySelector('.arco-table-header')
  const pagination = wrapper.querySelector('.arco-table-pagination')
  const container = wrapper.querySelector('.arco-table-container')
  // 表体之外的固定占位；表头在 `scroll.y` 生效后才拆分出来，缺失时按 0 计，随后会再校正一轮
  const reserved = outerHeight(header) + outerHeight(pagination) + verticalBorderWidth(container)
  // 向下取整：宁可少 1px 也不让表格总高超过容器，保证分页始终可见
  const available = Math.floor(wrapper.clientHeight - reserved)
  // 连表体的最小高度都放不下时不再限高，避免出现无意义的极小值导致表头反复拆装
  return available >= BODY_MIN_HEIGHT ? available : undefined
}

/**
 * 同步表体高度
 *
 * 逐轮测量并回写，直到测量值稳定或达到最大轮数：
 * 第 2 轮起表头已参与占位，扣除后表格总高恰好等于容器高度，分页不会被挤出。
 */
const syncBodyHeight = async (): Promise<void> => {
  if (!props.adaptiveHeight) {
    bodyHeight.value = undefined
    return
  }
  for (let round = 0; round < MAX_MEASURE_ROUNDS; round += 1) {
    const measured = measureBodyHeight()
    if (measured === undefined) {
      bodyHeight.value = undefined
      return
    }
    // 与上一轮结果一致即认为已稳定，避免反复触发渲染
    if (bodyHeight.value !== undefined && Math.abs(measured - bodyHeight.value) < 1) {
      return
    }
    bodyHeight.value = measured
    // 等待本次高度引起的渲染（表头拆分）完成后再测下一轮
    await nextTick()
  }
}

/**
 * 按容器宽度同步搜索区列数
 *
 * 以 `search.cols` 为上限：每行按「字段最小可用宽度」换算能放几个，不足一个则保底一列。
 */
const syncSearchCols = (): void => {
  const width = searchWrapperRef.value?.clientWidth ?? 0
  if (!width) {
    return
  }
  const fitCols = Math.floor(width / SEARCH_FIELD_MIN_WIDTH)
  const next = Math.max(1, Math.min(searchConfig.value.cols, fitCols))
  if (next !== effectiveSearchCols.value) {
    effectiveSearchCols.value = next
  }
}

/** 合并重算（下一帧执行，避免尺寸监听与回写互相触发） */
const scheduleSyncLayout = (): void => {
  if (measureFrame !== undefined) {
    return
  }
  measureFrame = window.requestAnimationFrame(() => {
    measureFrame = undefined
    // 折叠动画期间由 toggleCollapse 负责在动画结束后统一重算
    if (collapseAnimating) {
      return
    }
    syncSearchCols()
    void syncBodyHeight()
  })
}

/**
 * 监听表格区域尺寸变化
 *
 * 覆盖窗口缩放、侧边栏收起展开、密度切换等场景；搜索区宽度与表格区域一致，
 * 因此无需单独监听即可同步搜索区列数。
 */
const observeTableWrapper = (): void => {
  resizeObserver?.disconnect()
  const wrapper = tableWrapperRef.value
  if (!wrapper) {
    return
  }
  resizeObserver = new ResizeObserver(() => scheduleSyncLayout())
  resizeObserver.observe(wrapper)
}

/* ------------------------------ 配置解析 ------------------------------ */

/** 搜索区配置（补齐默认值） */
const searchConfig = computed(() => ({
  show: true,
  cols: 3,
  collapsible: true,
  defaultCollapsed: false,
  ...props.search,
}))

/** 工具栏配置（补齐默认值） */
const toolbarConfig = computed(() => ({
  showRefresh: true,
  showFullscreen: true,
  showColumnSetting: true,
  showDisplaySetting: true,
  ...props.toolbar,
}))

/** 合并后的 loading */
const mergedLoading = computed(() => props.loading || innerLoading.value)

/** 搜索区布局 */
const searchFormLayout = computed<ProFormLayout>(() => ({
  layout: 'horizontal',
  cols: effectiveSearchCols.value,
  labelAlign: 'left',
  labelColProps: { span: 6 },
  wrapperColProps: { span: 18 },
  rowGap: 12,
}))

/**
 * 搜索区字段 schema
 *
 * 未显式提供 `search.schema` 时，从 `columns` 自动推导。
 */
const searchSchema = computed<ProFormField[]>(() => {
  if (searchConfig.value.schema?.length) {
    return searchConfig.value.schema
  }
  return props.columns
    .filter((col) => !col.hideInSearch && col.valueType !== 'index' && col.valueType !== 'option')
    .map((col) => ({
      fieldName: col.dataIndex,
      label: col.title,
      component: col.valueType ?? 'input',
      valueEnum: col.valueEnum,
      span: col.searchSpan,
      ...col.searchFieldProps,
    }))
})

/**
 * 搜索区首行字段
 *
 * 与「其余字段」一起构成完整搜索区：首行常驻，其余字段折叠。
 * 拆分点按当前列数对齐到整行，因此搜索字段请避免使用自定义 `span` 跨行。
 */
const firstRowSearchSchema = computed(() => searchSchema.value.slice(0, effectiveSearchCols.value))

/** 搜索区其余字段（折叠区） */
const restSearchSchema = computed(() => searchSchema.value.slice(effectiveSearchCols.value))

/** 是否展示「展开 / 收起」：字段超出一行时才展示 */
const showCollapseSwitch = computed(
  () => searchConfig.value.collapsible && searchSchema.value.length > effectiveSearchCols.value,
)

/**
 * 构建搜索区初始值
 *
 * 搜索区由「首行」与「折叠区」两个表单实例共享同一个模型，其内部初始值逻辑不生效，
 * 因此由组件统一按 schema 中的 `defaultValue` 补齐，保证默认条件不丢失。
 */
const buildSearchDefaults = (): ProRecord => {
  const values: ProRecord = {}
  searchSchema.value.forEach((field) => {
    if (field.defaultValue !== undefined) {
      values[field.fieldName] = field.defaultValue
    }
  })
  return values
}

/**
 * 按自定义顺序排列后的列集合
 *
 * `columnOrder` 只记录 dataIndex 顺序，未记录的列（如后续新增的列）一律排到末尾，
 * 依赖 `Array.prototype.sort` 的稳定性保持配置里的声明顺序。
 */
const orderedColumns = computed(() => {
  const orderMap = new Map(columnOrder.value.map((key, index) => [key, index]))
  return [...props.columns].sort((left, right) => {
    const leftIndex = orderMap.get(left.dataIndex) ?? Number.MAX_SAFE_INTEGER
    const rightIndex = orderMap.get(right.dataIndex) ?? Number.MAX_SAFE_INTEGER
    return leftIndex - rightIndex
  })
})

/** 参与渲染的列：按自定义顺序排列，并过滤掉隐藏列 */
const visibleColumns = computed(() =>
  orderedColumns.value.filter((col) => !hiddenColumnKeys.value.includes(col.dataIndex)),
)

/** 列设置中已勾选的列 key */
const enabledColumnKeys = computed(() => visibleColumns.value.map((col) => col.dataIndex))

/* ------------------------------ 列构建 ------------------------------ */

/**
 * 构建 Arco 列配置
 *
 * 渲染优先级：`column.render` > 用户插槽 > 默认 `ProTableCell`。
 */
function buildArcoColumn(col: ProTableColumn): TableColumnData {
  const userSlotName = `column-${col.dataIndex}`
  const column: TableColumnData = {
    title: col.title,
    dataIndex: col.dataIndex,
    width: col.width,
    minWidth: col.minWidth,
    align: col.align,
    fixed: col.fixed,
    ellipsis: col.ellipsis,
    tooltip: col.tooltip,
    ...col.columnProps,
  }

  // 排序：透传给后端，交由 request 处理
  if (col.sorter) {
    column.sortable = {
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sortOrder: sorter.value?.field === col.dataIndex ? sorter.value.direction : '',
    }
  }

  // 筛选：客户端恒为 true，实际筛选交由后端
  if (col.filters?.length) {
    column.filterable = {
      filters: col.filters.map((item) => ({ text: item.text, value: String(item.value) })),
      filter: () => true,
      multiple: col.filterMultiple ?? false,
      filteredValue: filters.value[col.dataIndex],
    }
  }

  if (col.render) {
    // 1. 自定义渲染：由 Arco 直接调用
    const renderFn = col.render
    column.render = ({ record, rowIndex }) =>
      renderFn({ record, value: record[col.dataIndex], index: rowIndex, column: col })
  } else if (col.slot || slots[userSlotName]) {
    // 2. 用户插槽：标记 slotName，由模板中的具名插槽渲染
    column.slotName = col.slot ?? userSlotName
  } else {
    // 3. 默认渲染：统一走 ProTableCell
    column.render = ({ record, rowIndex }) =>
      h(ProTableCell, {
        column: col,
        record,
        rowIndex,
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      })
  }

  return column
}

/**
 * 操作列
 *
 * 由 `actions` 配置驱动自动生成：列本身不参与列设置与拖拽排序，
 * 始终追加在最后一列并固定右侧，避免业务误隐藏后无法操作数据。
 */
const actionColumn = computed<TableColumnData | undefined>(() => {
  const actions = props.actions
  if (!actions?.length) {
    return undefined
  }
  const config = props.actionColumn ?? {}
  return {
    title: config.title ?? '操作',
    dataIndex: ACTION_COLUMN_KEY,
    width: config.width ?? 160,
    align: config.align ?? 'center',
    fixed: config.fixed === false ? undefined : (config.fixed ?? 'right'),
    // 按钮组渲染统一交给 ProTableActions，页面只提供 actions 配置
    render: ({ record }) => h(ProTableActions, { actions, record }),
  }
})

/** Arco 列配置（业务列 + 操作列） */
const arcoColumns = computed<TableColumnData[]>(() => {
  const columns = visibleColumns.value.map((col) => buildArcoColumn(col))
  if (actionColumn.value) {
    columns.push(actionColumn.value)
  }
  return columns
})

/** 需要以插槽渲染的列 */
const slotColumns = computed(() =>
  visibleColumns.value
    .filter((col) => !col.render && Boolean(col.slot || slots[`column-${col.dataIndex}`]))
    .map((col) => ({ slotName: col.slot ?? `column-${col.dataIndex}`, column: col })),
)

/** 分页水平位置（配置项，默认靠右） */
const paginationPosition = computed<ProTablePaginationPosition>(() => props.pagination?.position ?? 'end')

/** 透传给 Arco 表格的 `page-position`：固定为「底部 + 水平对齐」 */
const arcoPagePosition = computed(() => PAGE_POSITION_MAP[paginationPosition.value])

/** 分页配置（`show === false` 时不渲染分页） */
const arcoPagination = computed(() => {
  const merged: Record<string, unknown> = { ...defaultPagination, ...props.pagination }
  if (merged.show === false) {
    return false
  }
  // show / position 为本组件的自有配置，不能透传给 Arco 的分页组件
  delete merged.show
  delete merged.position
  return {
    ...merged,
    total: total.value,
    current: pageNum.value,
    pageSize: pageSize.value,
  }
})

/** 行选择配置 */
const rowSelectionConfig = computed(() =>
  props.rowSelection ? { ...props.rowSelection, selectedRowKeys: selectedKeys.value } : undefined,
)

/* ------------------------------ 请求逻辑 ------------------------------ */

/** 过滤空值参数，避免向后端传递无意义字段 */
const cleanParams = (source: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  Object.entries(source).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    if (Array.isArray(value) && value.length === 0) {
      return
    }
    result[key] = value
  })
  return result
}

/** 组装请求参数 */
const buildParams = (): ProTableRequestParams => {
  const params: Record<string, unknown> = {
    ...cleanParams(props.defaultParams),
    ...cleanParams(searchParams.value),
    ...cleanParams(filters.value),
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  }
  if (sorter.value) {
    params.sortField = sorter.value.field
    params.sortOrder = sorter.value.direction
  }
  return params as ProTableRequestParams
}

/** 拉取数据：唯一的取数出口 */
const fetchData = async (): Promise<void> => {
  if (!props.request) {
    return
  }
  innerLoading.value = true
  const params = buildParams()
  emit('paramsChange', params)
  try {
    const result = await props.request(params)
    const normalized = normalizePageResult(result)
    dataSource.value = normalized.list
    total.value = normalized.total
    emit('load', result)
  } catch (error) {
    // 保留旧数据，仅向外抛出异常
    emit('requestError', error)
  } finally {
    innerLoading.value = false
    // 数据量变化会影响分页高度（页数增多可能换行），因此重新量取表体高度
    await nextTick()
    await syncBodyHeight()
  }
}

/** 以当前条件刷新（保持页码） */
const refresh = async (): Promise<void> => {
  await fetchData()
}

/** 重新加载，可附加参数并回到第一页 */
const reload = async (params?: Partial<ProTableRequestParams>): Promise<void> => {
  if (params) {
    searchParams.value = { ...searchParams.value, ...params }
    searchForm.value = { ...searchForm.value, ...params }
  }
  pageNum.value = 1
  await fetchData()
}

/** 重置搜索条件并回到第一页 */
const reset = async (): Promise<void> => {
  searchForm.value = buildSearchDefaults()
  searchParams.value = {}
  sorter.value = undefined
  filters.value = {}
  selectedKeys.value = []
  pageNum.value = 1
  await fetchData()
}

/** 获取当前请求参数 */
const getParams = (): ProTableRequestParams => buildParams()

/** 获取选中行数据 */
const getSelectedRows = (): ProTableRecord[] =>
  dataSource.value.filter((row) => selectedKeys.value.includes(row[props.rowKey] as string | number))

/** 清空选中 */
const clearSelection = (): void => {
  selectedKeys.value = []
}

/* ------------------------------ 事件处理 ------------------------------ */

/** 搜索区表单值变更 */
const handleSearchFormChange = (values: ProRecord): void => {
  searchForm.value = values
}

/** 执行查询 */
const handleSearch = async (): Promise<void> => {
  searchParams.value = { ...searchForm.value }
  pageNum.value = 1
  await fetchData()
}

/** 重置查询 */
const handleSearchReset = async (): Promise<void> => {
  await reset()
}

/** 切换搜索区展开状态 */
const toggleCollapse = (): void => {
  collapsed.value = !collapsed.value
  // 过渡期间高度持续变化，暂停尺寸监听，待动画结束后统一重算表体高度
  collapseAnimating = true
  window.setTimeout(() => {
    collapseAnimating = false
    void syncBodyHeight()
  }, SEARCH_COLLAPSE_DURATION)
}

/** 页码变化 */
const handlePageChange = async (page: number): Promise<void> => {
  pageNum.value = page
  await fetchData()
}

/** 每页条数变化 */
const handlePageSizeChange = async (sizeValue: number): Promise<void> => {
  pageSize.value = sizeValue
  pageNum.value = 1
  await fetchData()
}

/** 排序变化 */
const handleSorterChange = async (dataIndex: string, direction: string): Promise<void> => {
  if (direction === 'ascend' || direction === 'descend') {
    sorter.value = { field: dataIndex, direction }
  } else {
    sorter.value = undefined
  }
  pageNum.value = 1
  await fetchData()
}

/** 筛选变化 */
const handleFilterChange = async (dataIndex: string, filteredValues: string[]): Promise<void> => {
  if (filteredValues.length) {
    filters.value = { ...filters.value, [dataIndex]: filteredValues }
  } else {
    const next = { ...filters.value }
    delete next[dataIndex]
    filters.value = next
  }
  pageNum.value = 1
  await fetchData()
}

/** 行选择变化 */
const handleSelectionChange = (rowKeys: Array<string | number>): void => {
  selectedKeys.value = rowKeys
  emit('selectionChange', getSelectedRows())
}

/** 行点击 */
const handleRowClick = (record: ProTableRecord): void => {
  emit('rowClick', record)
}

/* ------------------------------ 列设置 ------------------------------ */

/**
 * 列设置持久化结构
 *
 * 顺序与显隐分开存放：显隐是「业务偏好」，顺序是「阅读习惯」，两者独立演化，
 * 合在一起存储容易在列配置变更时互相污染。
 */
interface ProTableSetting {
  /** 隐藏的列 key 集合 */
  hiddenKeys: string[]
  /** 列顺序（dataIndex 数组） */
  order: string[]
  /** 表格尺寸（密度） */
  size: TableSize
  /** 是否展示表格边框 */
  bordered: boolean
  /** 是否展示斑马纹 */
  stripe: boolean
}

/** 设置项本地存储 key（以列集合指纹区分不同表格，互不干扰） */
const settingStorageKey = computed(() => `pro-table:setting:${props.columns.map((col) => col.dataIndex).join(',')}`)

/** 配置声明的列顺序 */
const defaultColumnOrder = computed(() => props.columns.map((col) => col.dataIndex))

/** 默认隐藏的列（由 hideInTable 声明） */
const defaultHiddenKeys = computed(() => props.columns.filter((col) => col.hideInTable).map((col) => col.dataIndex))

/** 设置项的出厂默认值 */
const createDefaultSetting = (): ProTableSetting => ({
  hiddenKeys: [...defaultHiddenKeys.value],
  order: [...defaultColumnOrder.value],
  size: 'medium',
  bordered: false,
  stripe: false,
})

/**
 * 应用设置
 *
 * 对持久化数据做双向校验：既过滤掉已删除的列 key，也补齐新增的列，
 * 避免列配置调整后本地缓存把新列「吃掉」。
 *
 * @param setting 待应用的设置
 */
const applySetting = (setting: ProTableSetting): void => {
  const validKeys = new Set(defaultColumnOrder.value)
  hiddenColumnKeys.value = setting.hiddenKeys.filter((key) => validKeys.has(key))
  const recordedOrder = setting.order.filter((key) => validKeys.has(key))
  columnOrder.value = [...recordedOrder, ...defaultColumnOrder.value.filter((key) => !recordedOrder.includes(key))]
  size.value = TABLE_SIZES.includes(setting.size) ? setting.size : 'medium'
  bordered.value = setting.bordered
  stripe.value = setting.stripe
}

/** 读取本地设置（无缓存或缓存损坏时回落到出厂默认值） */
const loadSetting = (): void => {
  const fallback = createDefaultSetting()
  try {
    const raw = localStorage.getItem(settingStorageKey.value)
    applySetting(raw ? { ...fallback, ...(JSON.parse(raw) as Partial<ProTableSetting>) } : fallback)
  } catch {
    applySetting(fallback)
  }
}

/** 持久化设置 */
const saveSetting = (): void => {
  const setting: ProTableSetting = {
    hiddenKeys: hiddenColumnKeys.value,
    order: columnOrder.value,
    size: size.value,
    bordered: bordered.value,
    stripe: stripe.value,
  }
  localStorage.setItem(settingStorageKey.value, JSON.stringify(setting))
}

/**
 * 列显隐切换
 *
 * @param key     列 key
 * @param checked 勾选状态（单个复选框只会是布尔值，联合类型来自组件签名）
 */
const handleColumnToggle = (key: string, checked: boolean | (string | number | boolean)[]): void => {
  const visible = Array.isArray(checked) ? checked.length > 0 : checked
  const next = new Set(hiddenColumnKeys.value)
  if (visible) {
    next.delete(key)
  } else {
    next.add(key)
  }
  hiddenColumnKeys.value = [...next]
  saveSetting()
}

/** 全部展示 */
const enableAllColumns = (): void => {
  hiddenColumnKeys.value = []
  saveSetting()
}

/** 重置列设置（顺序与显隐一并回到配置声明状态） */
const resetColumns = (): void => {
  hiddenColumnKeys.value = [...defaultHiddenKeys.value]
  columnOrder.value = [...defaultColumnOrder.value]
  saveSetting()
}

/* ------------------------------ 列设置：拖拽排序 ------------------------------ */

/** 列设置面板的列列表容器（sortablejs 挂载点） */
const columnListRef = ref<HTMLElement>()

/** sortablejs 实例类型 */
type SortableInstance = ReturnType<typeof Sortable.create>

/** sortablejs 实例 */
let sortableInstance: SortableInstance | undefined

/** 销毁拖拽实例 */
const destroyColumnSortable = (): void => {
  sortableInstance?.destroy()
  sortableInstance = undefined
}

/**
 * 初始化拖拽排序
 *
 * 面板内容为懒渲染，必须在列表挂载后再创建实例；`onEnd` 按 DOM 实际顺序回写，
 * 因此拖拽结果与视觉顺序永远一致。
 *
 * 关键配置说明：
 * - `handle`：只允许手柄触发，避免误拖动整行；
 * - `forceFallback`：改用「元素跟随鼠标」的拖拽实现，而非浏览器原生 DnD，
 *   既避免了原生拖拽时只能看到半透明截图的问题，也让拖拽在各种环境下表现一致。
 */
const initColumnSortable = (): void => {
  const list = columnListRef.value
  if (!list) {
    return
  }
  destroyColumnSortable()
  sortableInstance = Sortable.create(list, {
    animation: 150,
    handle: '.pro-table-setting__handle',
    forceFallback: true,
    fallbackClass: 'pro-table-setting__item--fallback',
    ghostClass: 'pro-table-setting__item--ghost',
    chosenClass: 'pro-table-setting__item--chosen',
    onEnd: () => {
      const keys = Array.from(list.children)
        .map((item) => (item as HTMLElement).dataset.key)
        .filter((key): key is string => Boolean(key))
      if (keys.length) {
        columnOrder.value = keys
        saveSetting()
      }
    },
  })
}

/**
 * 监听列列表挂载
 *
 * 用模板 ref 而非弹出层事件来初始化：无论内容是首次展开还是被重新挂载，
 * 只要 DOM 就绪就会自动接上拖拽能力，避免依赖弹出层渲染时序。
 */
watch(
  columnListRef,
  (element) => {
    if (element) {
      initColumnSortable()
    } else {
      destroyColumnSortable()
    }
  },
  { flush: 'post' },
)

/* ------------------------------ 显示设置 ------------------------------ */

/** 最终是否展示边框：业务显式传入的 `tableProps.bordered` 优先 */
const mergedBordered = computed(() => (props.tableProps?.bordered as boolean | undefined) ?? bordered.value)

/** 最终是否展示斑马纹：业务显式传入的 `tableProps.stripe` 优先 */
const mergedStripe = computed(() => (props.tableProps?.stripe as boolean | undefined) ?? stripe.value)

/**
 * 密度切换（面板中以 tab 形式展示）
 *
 * @param value 尺寸值
 */
const handleDensityChange = (value: string | number): void => {
  if (TABLE_SIZES.includes(value as TableSize)) {
    size.value = value as TableSize
    saveSetting()
  }
}

/**
 * 边框显示开关
 *
 * @param value 开关状态
 */
const handleBorderedChange = (value: string | number | boolean): void => {
  bordered.value = Boolean(value)
  saveSetting()
}

/**
 * 斑马纹显示开关
 *
 * @param value 开关状态
 */
const handleStripeChange = (value: string | number | boolean): void => {
  stripe.value = Boolean(value)
  saveSetting()
}

/* ------------------------------ 全屏 ------------------------------ */

/**
 * 切换全屏
 *
 * 未调用原生 Fullscreen API：搜索区下拉、表头筛选等弹出层默认挂载在 body，
 * 原生全屏会把这些节点裁切到视口之外导致不可见。这里改用固定定位覆盖视口，
 * 弹出层依旧挂在 body 上，因此可以正常展示。
 */
const toggleMaximized = async (): Promise<void> => {
  maximized.value = !maximized.value
  // 容器尺寸变化后重新量取表体高度
  await nextTick()
  await syncBodyHeight()
}

/**
 * 全局按键处理：Esc 退出全屏
 *
 * @param event 键盘事件
 */
const handleGlobalKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && maximized.value) {
    void toggleMaximized()
  }
}

/* ------------------------------ 生命周期 ------------------------------ */

onMounted(async () => {
  // 初始化搜索区与表格设置（列顺序 + 显隐 + 密度 + 边框 + 斑马纹）
  collapsed.value = searchConfig.value.defaultCollapsed
  searchForm.value = buildSearchDefaults()
  loadSetting()

  // 初始化布局尺寸：等待首轮渲染后再测量列数与容器可用空间
  await nextTick()
  syncSearchCols()
  observeTableWrapper()
  await syncBodyHeight()

  // Esc 退出全屏
  window.addEventListener('keydown', handleGlobalKeydown)

  if (props.request) {
    if (props.immediate) {
      await fetchData()
    }
  } else {
    // 静态数据模式
    dataSource.value = props.data ?? []
    total.value = dataSource.value.length
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = undefined
  window.removeEventListener('keydown', handleGlobalKeydown)
  destroyColumnSortable()
  if (measureFrame !== undefined) {
    window.cancelAnimationFrame(measureFrame)
    measureFrame = undefined
  }
})

// 自适应开关变化时重新测量
watch(
  () => props.adaptiveHeight,
  () => void syncBodyHeight(),
)

// 列数配置变化时重新同步搜索区列数
watch(
  () => searchConfig.value.cols,
  () => syncSearchCols(),
)

// 字段变化时重新同步搜索区列数（字段数量会影响是否需要折叠）
watch(
  () => searchSchema.value.length,
  () => syncSearchCols(),
)

// 静态数据模式下同步外部数据
watch(
  () => props.data,
  (value) => {
    if (props.request) {
      return
    }
    dataSource.value = value ?? []
    total.value = dataSource.value.length
  },
)

defineExpose<ProTableInstance>({
  refresh,
  reload,
  reset,
  getParams,
  getSelectedRows,
  clearSelection,
})
</script>

<template>
  <div class="pro-table flex h-full min-h-0 w-full flex-col" :class="{ 'is-maximized': maximized }">
    <!-- 搜索区 -->
    <div v-if="searchConfig.show && searchSchema.length" ref="searchWrapperRef" class="shrink-0 pb-2">
      <!-- 首行字段：常驻展示 -->
      <ProForm
        :schema="firstRowSearchSchema"
        :model-value="searchForm"
        :layout="searchFormLayout"
        :actions="{ show: false }"
        @update:model-value="handleSearchFormChange"
      />
      <!-- 其余字段：折叠区，通过行高过渡实现展开 / 收起动画 -->
      <div
        v-if="restSearchSchema.length"
        class="search-expand"
        :class="{ 'is-collapsed': collapsed }"
        :inert="collapsed || undefined"
      >
        <div class="search-expand-inner">
          <ProForm
            :schema="restSearchSchema"
            :model-value="searchForm"
            :layout="searchFormLayout"
            :actions="{ show: false }"
            @update:model-value="handleSearchFormChange"
          />
        </div>
      </div>
      <div class="flex items-center justify-end gap-3 pb-2">
        <a-button size="small" @click="handleSearchReset">重置</a-button>
        <a-button size="small" type="primary" @click="handleSearch">查询</a-button>
        <a-link v-if="showCollapseSwitch" @click="toggleCollapse">
          {{ collapsed ? '展开' : '收起' }}
          <template #icon>
            <IIcon :icon="collapsed ? 'ant-design:down-outlined' : 'ant-design:up-outlined'" />
          </template>
        </a-link>
      </div>
      <a-divider :margin="2" />
    </div>

    <!-- 工具栏 -->
    <div class="mb-3 flex shrink-0 items-center justify-between">
      <div class="flex items-center gap-3">
        <span v-if="toolbarConfig.title" class="text-base font-bold text-(--color-text-1)">
          {{ toolbarConfig.title }}
        </span>
        <slot name="toolbar-actions" />
      </div>
      <div class="flex items-center gap-3">
        <slot name="toolbar-extra" />

        <!-- 刷新 -->
        <a-tooltip v-if="toolbarConfig.showRefresh" content="刷新">
          <a-button @click="refresh">
            <template #icon>
              <IIcon icon="ant-design:reload-outlined" />
            </template>
          </a-button>
        </a-tooltip>

        <!-- 全屏：覆盖视口展示，Esc 退出 -->
        <a-tooltip v-if="toolbarConfig.showFullscreen" :content="maximized ? '退出全屏（Esc）' : '全屏'">
          <a-button @click="toggleMaximized">
            <template #icon>
              <IIcon :icon="maximized ? 'ant-design:fullscreen-exit-outlined' : 'ant-design:fullscreen-outlined'" />
            </template>
          </a-button>
        </a-tooltip>

        <!--
          列设置：勾选显隐 + 拖拽排序

          使用 Popover 而非 Dropdown：Dropdown 的内容会被包进
          `.arco-dropdown-list-wrapper`（max-height: 200px），面板高度受限会被裁剪；
          Popover 是富内容容器，无高度上限，且内部点击不会触发 outside 关闭。
        -->
        <a-tooltip v-if="toolbarConfig.showColumnSetting" content="列设置">
          <a-popover trigger="click" position="br" :content-style="{ padding: '0' }">
            <a-button>
              <template #icon>
                <IIcon icon="ant-design:setting-outlined" />
              </template>
            </a-button>
            <template #content>
              <div class="pro-table-setting">
                <div class="pro-table-setting__header">
                  <span class="pro-table-setting__title">列设置</span>
                  <span class="pro-table-setting__count">
                    {{ enabledColumnKeys.length }}/{{ orderedColumns.length }}
                  </span>
                </div>
                <p class="pro-table-setting__tip">拖动左侧手柄可调整列的展示顺序</p>
                <!-- 拖拽容器：sortablejs 按 data-key 回写列顺序 -->
                <div ref="columnListRef" class="pro-table-setting__list">
                  <div
                    v-for="col in orderedColumns"
                    :key="col.dataIndex"
                    class="pro-table-setting__item"
                    :data-key="col.dataIndex"
                  >
                    <span class="pro-table-setting__handle">
                      <IIcon icon="ant-design:drag-outlined" />
                    </span>
                    <a-checkbox
                      class="pro-table-setting__checkbox"
                      :model-value="enabledColumnKeys.includes(col.dataIndex)"
                      @change="handleColumnToggle(col.dataIndex, $event)"
                    >
                      {{ col.title }}
                    </a-checkbox>
                  </div>
                </div>
                <div class="pro-table-setting__footer">
                  <a-link @click="enableAllColumns">全选</a-link>
                  <a-link @click="resetColumns">重置</a-link>
                </div>
              </div>
            </template>
          </a-popover>
        </a-tooltip>

        <!-- 其他功能：密度（tab）+ 边框 / 斑马纹开关，按分组上下排列 -->
        <a-tooltip v-if="toolbarConfig.showDisplaySetting" content="其他功能">
          <a-popover trigger="click" position="br" :content-style="{ padding: '0' }">
            <a-button>
              <template #icon>
                <IIcon icon="ant-design:more-outlined" />
              </template>
            </a-button>
            <template #content>
              <div class="pro-table-display">
                <div class="pro-table-display__header">
                  <span class="pro-table-display__title">其他功能</span>
                </div>

                <!-- 分组一：表格密度 -->
                <div class="pro-table-display__group">
                  <div class="pro-table-display__group-title">表格密度</div>
                  <a-tabs :model-value="size" type="capsule" size="small" @change="handleDensityChange">
                    <a-tab-pane v-for="option in DENSITY_OPTIONS" :key="option.value" :title="option.label">
                      {{ option.desc }}
                    </a-tab-pane>
                  </a-tabs>
                </div>

                <!-- 分组二：显示开关 -->
                <div class="pro-table-display__group">
                  <div class="pro-table-display__group-title">显示设置</div>
                  <div class="pro-table-display__row">
                    <span class="pro-table-display__row-label">显示边框</span>
                    <a-switch :model-value="mergedBordered" size="small" @change="handleBorderedChange" />
                  </div>
                  <div class="pro-table-display__row">
                    <span class="pro-table-display__row-label">斑马纹</span>
                    <a-switch :model-value="mergedStripe" size="small" @change="handleStripeChange" />
                  </div>
                </div>
              </div>
            </template>
          </a-popover>
        </a-tooltip>
      </div>
    </div>

    <!-- 表格：占满剩余高度，分页固定底部，表体内部滚动 -->
    <div ref="tableWrapperRef" class="pro-table__table min-h-0 flex-1">
      <a-table
        v-bind="tableProps"
        :columns="arcoColumns"
        :data="dataSource"
        :loading="mergedLoading"
        :row-key="rowKey"
        :size="size"
        :bordered="mergedBordered"
        :stripe="mergedStripe"
        :scroll="tableScroll"
        :pagination="arcoPagination"
        :page-position="arcoPagePosition"
        :row-selection="rowSelectionConfig"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @sorter-change="handleSorterChange"
        @filter-change="handleFilterChange"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <!-- 单元格插槽（按列声明或页面提供的具名插槽） -->
        <template v-for="item in slotColumns" :key="item.slotName" #[item.slotName]="scope">
          <slot :name="item.slotName" v-bind="scope">
            <ProTableCell
              :column="item.column"
              :record="scope.record"
              :row-index="scope.rowIndex"
              :page-num="pageNum"
              :page-size="pageSize"
            />
          </slot>
        </template>
        <!-- 空数据 -->
        <template v-if="slots.empty" #empty>
          <slot name="empty" />
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/**
 * 搜索区折叠容器
 *
 * 使用 `grid-template-rows` 的 0fr → 1fr 过渡实现高度动画：
 * 相比 `max-height`，行高过渡不依赖具体高度数值，展开 / 收起都不会出现跳变或延迟。
 */
.search-expand {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.25s ease;
}

.search-expand.is-collapsed {
  grid-template-rows: 0fr;
}

.search-expand-inner {
  min-height: 0;
  overflow: hidden;
}

/**
 * 全屏态
 *
 * 采用固定定位覆盖视口，而非原生 Fullscreen API：
 * 搜索区下拉、表头筛选等弹出层默认挂载在 body，原生全屏会把它们裁切到视口之外。
 */
.pro-table.is-maximized {
  position: fixed;
  inset: 0;
  z-index: 900;
  padding: 16px;
  background-color: var(--color-bg-2);
  overflow: hidden;
  overscroll-behavior: contain;
}

/* ------------------------------ 分页固定底部 ------------------------------ */

/**
 * 表格纵向弹性布局
 *
 * Arco 表格的 DOM 为「.arco-table → .arco-spin → [表格容器, 分页]」，
 * 需要逐层把高度链打通，分页才能固定在容器底部、表格区域自适应剩余高度。
 * （`.arco-table` 只在 `scroll.y` 为字符串时自带高度，本组件传入的是像素数值，故显式补 100%。）
 */
.pro-table__table :deep(.arco-table) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pro-table__table :deep(.arco-spin) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

/* 表格容器占满分页之外的剩余高度，表体在容器内部滚动 */
.pro-table__table :deep(.arco-table-container) {
  flex: 1;
  min-height: 0;
}

/* 表体跟随容器撑满，避免数据较少时与分页之间出现空白断带 */
.pro-table__table :deep(.arco-table-body) {
  flex: 1;
}

/* 分页固定在底部：不参与伸缩，高度由自身内容决定 */
.pro-table__table :deep(.arco-table-pagination) {
  flex-shrink: 0;
}

/* ------------------------------ 列设置面板 ------------------------------ */

.pro-table-setting {
  width: 264px;
  padding: 8px 0 4px;
}

.pro-table-setting__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 6px;
}

.pro-table-setting__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pro-table-setting__count {
  font-size: 12px;
  color: var(--color-text-3);
}

.pro-table-setting__tip {
  margin: 0 0 6px;
  padding: 0 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text-3);
}

.pro-table-setting__list {
  max-height: 260px;
  padding: 0 6px;
  overflow: auto;
}

.pro-table-setting__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  border-radius: 4px;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;
}

.pro-table-setting__item:hover {
  background-color: var(--color-fill-2);
}

/* 拖拽占位与浮起态：与普通列表项保持同一套视觉语言 */
.pro-table-setting__item--ghost {
  background-color: var(--color-primary-light-1);
  opacity: 0.6;
}

.pro-table-setting__item--chosen {
  background-color: var(--color-fill-2);
}

/* 跟随鼠标拖拽的浮动项：抬高层级并加投影，明确「正在被拖动」 */
.pro-table-setting__item--fallback {
  z-index: 1000;
  background-color: var(--color-bg-2);
  box-shadow: 0 4px 16px rgb(0 0 0 / 18%);
  opacity: 0.95;
}

.pro-table-setting__handle {
  display: inline-flex;
  flex: 0 0 auto;
  cursor: move;
  color: var(--color-text-3);
  transition: color 0.15s ease;
}

.pro-table-setting__item:hover .pro-table-setting__handle {
  color: var(--color-text-2);
}

.pro-table-setting__checkbox {
  flex: 1;
  min-width: 0;
}

/* 列标题过长时省略，避免撑破固定宽度面板 */
.pro-table-setting__checkbox :deep(.arco-checkbox-text) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pro-table-setting__footer {
  display: flex;
  justify-content: space-between;
  margin: 6px 12px 0;
  padding-top: 8px;
  border-top: 1px solid var(--color-border-1);
}

/* ------------------------------ 其他功能面板 ------------------------------ */

.pro-table-display {
  width: 284px;
  padding: 8px 0 4px;
}

.pro-table-display__header {
  padding: 0 12px 6px;
}

.pro-table-display__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pro-table-display__group {
  padding: 0 12px;
}

/* 分组之间以分隔线区隔，形成「密度 / 显示设置」上下两个独立区块 */
.pro-table-display__group + .pro-table-display__group {
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-1);
}

.pro-table-display__group-title {
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--color-text-3);
}

/* 密度 tab 的内容区承载选项说明，压缩留白避免弹出层过高 */
.pro-table-display :deep(.arco-tabs-content) {
  padding: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text-3);
}

.pro-table-display__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.pro-table-display__row-label {
  font-size: 13px;
  color: var(--color-text-1);
}
</style>
