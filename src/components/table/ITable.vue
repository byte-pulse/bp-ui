<script lang="ts" setup>
import type { FormField as FormFieldConfig } from '@/components/form/types'
import type { FormInstance, TableBorder, TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import type {
  TableConfig,
  TableExpose,
  TableExportParams,
  TablePagination,
  TableRecord,
  TableRequestParams,
  TableResponse,
  TableToolbarConfig,
} from './types'

defineOptions({ name: 'BpTable' })

const props = defineProps<{ config: TableConfig }>()

const emit = defineEmits<{ selectionChange: [keys: (string | number)[]] }>()

const slots = useSlots()
// 仅在外部提供了右侧工具栏插槽时，才在导出按钮后补分隔线，避免出现尾部空分割线
const hasToolbarRightSlot = computed(() => Boolean(slots['toolbar-right']))

// 表格外观偏好（持久化）：密度 / 边框 / 斑马纹 / 每页条数
const tableStore = useTableStore()

/* ---------------------------- 头部搜索区 ---------------------------- */
const searchFormRef = ref<FormInstance>()
const searchModel = ref<Record<string, unknown>>({})
const collapsed = ref(true)

const searchConfig = computed(() => props.config.search)
const showSearch = computed(() => (searchConfig.value?.fields.length ?? 0) > 0)
const searchColumns = computed(() => searchConfig.value?.columns ?? 4)
// 字段超过一行时可折叠，也可由配置强制指定
const collapsible = computed(
  () => searchConfig.value?.collapsible ?? (searchConfig.value?.fields.length ?? 0) > searchColumns.value,
)
const visibleSearchFields = computed<FormFieldConfig[]>(() => {
  const fields = searchConfig.value?.fields ?? []
  if (!collapsible.value || !collapsed.value) return fields
  return fields.slice(0, searchColumns.value)
})
// 搜索字段栅格占位：字段自定义 > 按列数均分
const searchColSpan = (field: FormFieldConfig) => field.span ?? Math.max(1, Math.floor(24 / searchColumns.value))

// 用配置里的默认值初始化搜索条件
const initSearchModel = () => {
  const defaults: Record<string, unknown> = {}
  searchConfig.value?.fields.forEach((field) => {
    if (field.defaultValue !== undefined) defaults[field.field] = field.defaultValue
  })
  searchModel.value = { ...defaults, ...searchModel.value }
}
collapsed.value = searchConfig.value?.defaultCollapsed ?? true
initSearchModel()

/* ------------------------------ 数据区 ------------------------------ */
const loading = ref(false)
const dataSource = ref<TableRecord[]>([])
const current = ref(1)
const total = ref(0)
const selectedKeys = ref<(string | number)[]>([])
const sortField = ref<string>()
const sortOrder = ref<'ascend' | 'descend'>()

// 选中项变化时向外抛出，便于外部展示已选数量等
watch(selectedKeys, (keys) => emit('selectionChange', [...keys]))

const rowKey = computed(() => props.config.rowKey ?? 'id')

// 分页配置：false 关闭分页，true / 对象开启并按对象覆盖默认值
const paginationConfig = computed<TablePagination | null>(() => {
  const config = props.config.pagination
  if (config === false) return null
  return typeof config === 'object' ? config : {}
})
const showPagination = computed(() => paginationConfig.value !== null)
// 每页条数优先取持久化偏好，其次取配置，默认 15
const pageSize = computed({
  get: () =>
    tableStore.pageSize ??
    (typeof props.config.pagination === 'object' ? (props.config.pagination.pageSize ?? 15) : 15),
  set: (value: number) => {
    tableStore.pageSize = value
  },
})
const pageSizeOptions = computed(() => paginationConfig.value?.pageSizeOptions ?? [15, 30, 50])

// 行选择配置：true 时退化为多选
const rowSelectionConfig = computed<TableRowSelection | undefined>(() => {
  const config = props.config.rowSelection
  if (!config) return undefined
  return typeof config === 'object' ? config : { type: 'checkbox' }
})

/* --------------------------- 外观与内置工具栏 --------------------------- */
// 外观优先取持久化的用户偏好，其次取表格配置，最后回落到内置默认值（宽松 / 边框 / 斑马纹）
const size = computed({
  get: () => tableStore.size ?? props.config.size ?? 'large',
  set: (value: 'mini' | 'small' | 'medium' | 'large') => {
    tableStore.size = value
  },
})
const bordered = computed<boolean | TableBorder>({
  get: () => tableStore.bordered ?? props.config.bordered ?? true,
  set: (value) => {
    tableStore.bordered = value
  },
})
const stripe = computed({
  get: () => tableStore.stripe ?? props.config.stripe ?? true,
  set: (value: boolean) => {
    tableStore.stripe = value
  },
})
const columnVisible = ref<Record<string, boolean>>(
  Object.fromEntries(props.config.columns.map((column) => [column.dataIndex, true])),
)

// a-checkbox 只接受布尔值，这里把边框开关收敛为布尔读写
const borderedToggle = computed({
  get: () => bordered.value === true,
  set: (value: boolean) => {
    bordered.value = value
  },
})

// 工具栏内置功能开关：toolbar 传 false 全部隐藏，传对象则按字段覆盖默认（全开）
const toolbarOptions = computed<TableToolbarConfig>(() =>
  typeof props.config.toolbar === 'object' && props.config.toolbar !== null ? props.config.toolbar : {},
)
const toolbarEnabled = computed(() => props.config.toolbar !== false)
const showSettings = computed(() => toolbarEnabled.value && (toolbarOptions.value.settings ?? true))
const showRefresh = computed(() => toolbarEnabled.value && (toolbarOptions.value.refresh ?? true))
const showSelectionTools = computed(
  () => toolbarEnabled.value && (toolbarOptions.value.selection ?? true) && Boolean(rowSelectionConfig.value),
)

// 组装 Arco 列配置：补充序号列、排序状态，并把简化配置映射为 Arco 需要的结构
const tableColumns = computed<TableColumnData[]>(() => {
  const columns: TableColumnData[] = []
  // 存在左侧固定列时序号列一并左固定，避免「中间列固定、序号列滚动」的割裂
  const hasLeftFixed = props.config.columns.some((column) => column.fixed === 'left')
  if (props.config.showIndex) {
    columns.push({
      title: '序号',
      width: 70,
      align: 'center',
      fixed: hasLeftFixed ? 'left' : undefined,
      ...props.config.indexColumn,
      // 序号始终由组件计算，避免被 indexColumn.render 覆盖
      render: (data) => (current.value - 1) * pageSize.value + data.rowIndex + 1,
    })
  }
  props.config.columns
    .filter((column) => columnVisible.value[column.dataIndex] !== false)
    .forEach((column) => {
      columns.push({
        ...column,
        sortable: column.sortable
          ? {
              sortDirections: ['ascend', 'descend'],
              sortOrder: sortField.value === column.dataIndex ? (sortOrder.value ?? '') : '',
            }
          : undefined,
      })
    })
  return columns
})

// 需要透传给外部插槽的自定义列
const slotColumnNames = computed(() =>
  props.config.columns.filter((column) => column.slotName && !column.render).map((column) => column.slotName as string),
)

const compareValue = (prev: unknown, next: unknown) => {
  if (typeof prev === 'number' && typeof next === 'number') return prev - next
  return String(prev ?? '').localeCompare(String(next ?? ''))
}

const buildQuery = (): TableExportParams => {
  const params: TableExportParams = { ...searchModel.value }
  if (sortField.value && sortOrder.value) {
    params.sortField = sortField.value
    params.sortOrder = sortOrder.value
  }
  return params
}

const buildParams = (): TableRequestParams => ({
  pageNum: current.value,
  pageSize: pageSize.value,
  ...buildQuery(),
})

// 本地数据模式：前端排序 + 前端分页
const loadLocal = () => {
  const rows = [...(props.config.data ?? [])]
  if (sortField.value && sortOrder.value) {
    const field = sortField.value
    const direction = sortOrder.value === 'ascend' ? 1 : -1
    rows.sort((a, b) => compareValue(a[field], b[field]) * direction)
  }
  total.value = rows.length
  dataSource.value = showPagination.value
    ? rows.slice((current.value - 1) * pageSize.value, current.value * pageSize.value)
    : rows
}

const loadData = async () => {
  if (!props.config.request) {
    loadLocal()
    return
  }
  loading.value = true
  try {
    const result: TableResponse = await props.config.request(buildParams())
    dataSource.value = result.list ?? []
    total.value = result.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleSorterChange = (dataIndex: string, direction: string) => {
  if (direction === 'ascend' || direction === 'descend') {
    sortField.value = dataIndex
    sortOrder.value = direction
  } else {
    sortField.value = undefined
    sortOrder.value = undefined
  }
  current.value = 1
  void loadData()
}

const handlePageChange = (page: number) => {
  current.value = page
  void loadData()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  current.value = 1
  void loadData()
}

/* ------------------------------ 导出区 ------------------------------ */
const exportConfig = computed(() => props.config.export)
const exporting = ref(false)

// 是否存在任意内置工具栏按钮，用于决定与右侧插槽之间的分隔线
const hasBuiltinToolbar = computed(() =>
  Boolean(exportConfig.value || showSettings.value || showSelectionTools.value || showRefresh.value),
)

// 携带当前搜索条件走后端导出接口：有勾选则导出选中主键，否则按条件导出全部
const handleExport = async () => {
  if (!exportConfig.value) return
  exporting.value = true
  try {
    await exportConfig.value.request({
      ...buildQuery(),
      keys: selectedKeys.value.length ? [...selectedKeys.value] : undefined,
    })
  } finally {
    exporting.value = false
  }
}

/* --------------------------- 对外暴露的方法 --------------------------- */
const reload = async () => {
  await loadData()
}

const search = async () => {
  current.value = 1
  await loadData()
}

const reset = async () => {
  const next: Record<string, unknown> = {}
  searchConfig.value?.fields.forEach((field) => {
    next[field.field] = field.defaultValue
  })
  searchModel.value = next
  searchFormRef.value?.clearValidate()
  current.value = 1
  await loadData()
}

const getSelectedKeys = () => [...selectedKeys.value]
const clearSelection = () => {
  selectedKeys.value = []
}
const getSearchValues = () => ({ ...searchModel.value })

// 内置选择操作：查看已选主键 / 清空选择
const viewSelectedKeys = () => {
  const keys = selectedKeys.value
  $message.info(keys.length ? `已选择 ${keys.length} 项：${keys.join('、')}` : '未选择任何数据')
}
const clearSelectedKeys = () => {
  clearSelection()
  $message.success('已清空选择')
}

defineExpose<TableExpose>({ reload, search, reset, getSelectedKeys, clearSelection, getSearchValues })

onMounted(() => {
  if (props.config.immediate ?? true) void loadData()
})
</script>

<template>
  <div class="flex h-full min-h-0 flex-col gap-3">
    <!-- 头部搜索区 -->
    <a-card v-if="showSearch" :bordered="false" class="shrink-0 rounded-lg" :body-style="{ paddingBottom: '8px' }">
      <a-form
        ref="searchFormRef"
        :model="searchModel"
        layout="horizontal"
        label-align="right"
        :auto-label-width="true"
        size="medium"
      >
        <a-row :gutter="[16, 0]">
          <a-col v-for="field in visibleSearchFields" :key="field.field" :xs="24" :sm="12" :md="searchColSpan(field)">
            <IFormField v-model="searchModel[field.field]" :item="field" />
          </a-col>
        </a-row>
      </a-form>
      <div class="flex items-center justify-end gap-2">
        <a-button type="primary" @click="search">
          <template #icon><IIcon icon="ant-design:search-outlined" /></template>
          {{ searchConfig?.searchText ?? '查询' }}
        </a-button>
        <a-button @click="reset">
          <template #icon><IIcon icon="ant-design:reload-outlined" /></template>
          {{ searchConfig?.resetText ?? '重置' }}
        </a-button>
        <a-button v-if="collapsible" type="text" @click="collapsed = !collapsed">
          <template #icon>
            <IIcon :icon="collapsed ? 'ant-design:down-outlined' : 'ant-design:up-outlined'" />
          </template>
          {{ collapsed ? '展开' : '收起' }}
        </a-button>
      </div>
    </a-card>

    <!-- 表格区 -->
    <a-card
      :bordered="false"
      class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg"
      :body-style="{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: 0 }"
    >
      <div class="flex h-full min-h-0 flex-col">
        <!-- 工具栏 -->
        <div class="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div class="flex items-center gap-2">
            <span class="text-base font-medium text-(--color-text-1)">{{ config.title ?? '数据列表' }}</span>
            <slot name="toolbar" />
          </div>
          <div class="flex items-center gap-2">
            <!-- 内置导出按钮 -->
            <a-button
              v-if="exportConfig"
              size="small"
              :loading="exporting"
              :disabled="exportConfig.disabled"
              @click="handleExport"
            >
              <template #icon><IIcon icon="ant-design:download-outlined" /></template>
              {{ exportConfig.text ?? '导出' }}
            </a-button>

            <!-- 内置设置：密度 / 边框 / 斑马纹 / 列显隐 -->
            <a-tooltip v-if="showSettings" content="表格设置">
              <a-dropdown trigger="click" position="br">
                <a-button size="small">
                  <template #icon><IIcon icon="ant-design:setting-outlined" /></template>
                </a-button>
                <template #content>
                  <div class="w-60 p-1">
                    <div class="mb-2 text-xs text-(--color-text-3)">密度</div>
                    <a-radio-group v-model="size" type="button" size="small" class="mb-3">
                      <a-radio value="small">紧凑</a-radio>
                      <a-radio value="medium">默认</a-radio>
                      <a-radio value="large">宽松</a-radio>
                    </a-radio-group>
                    <div class="flex flex-col gap-1">
                      <a-checkbox v-model="borderedToggle">显示边框</a-checkbox>
                      <a-checkbox v-model="stripe">斑马纹</a-checkbox>
                    </div>
                    <a-divider :margin="8" />
                    <div class="mb-2 text-xs text-(--color-text-3)">列显示</div>
                    <div class="flex flex-col gap-1">
                      <a-checkbox
                        v-for="column in config.columns"
                        :key="column.dataIndex"
                        v-model="columnVisible[column.dataIndex]"
                      >
                        {{ column.title }}
                      </a-checkbox>
                    </div>
                  </div>
                </template>
              </a-dropdown>
            </a-tooltip>

            <!-- 内置选择操作：查看选中 / 清空选择 -->
            <template v-if="showSelectionTools">
              <a-tooltip content="查看选中">
                <a-button size="small" @click="viewSelectedKeys">
                  <template #icon><IIcon icon="ant-design:eye-outlined" /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip content="清空选择">
                <a-button size="small" @click="clearSelectedKeys">
                  <template #icon><IIcon icon="ant-design:clear-outlined" /></template>
                </a-button>
              </a-tooltip>
            </template>

            <!-- 内置刷新 -->
            <a-tooltip v-if="showRefresh" content="刷新">
              <a-button size="small" type="primary" @click="reload">
                <template #icon><IIcon icon="ant-design:reload-outlined" /></template>
              </a-button>
            </a-tooltip>

            <!-- 业务补充：右侧工具栏插槽 -->
            <template v-if="hasToolbarRightSlot">
              <a-divider v-if="hasBuiltinToolbar" :margin="0" direction="vertical" />
              <slot name="toolbar-right" />
            </template>
          </div>
        </div>

        <!-- 表格主体：外层只限定高度，纵向滚动交给表格内部，横向滚动条才会固定在可视区底部 -->
        <div class="min-h-0 flex-1 overflow-hidden">
          <a-table
            v-model:selected-keys="selectedKeys"
            :columns="tableColumns"
            :data="dataSource"
            :loading="loading"
            :row-key="rowKey"
            :bordered="bordered"
            :stripe="stripe"
            :size="size"
            :sticky-header="config.stickyHeader ?? true"
            :scroll="config.scroll"
            :row-selection="rowSelectionConfig"
            :pagination="false"
            @sorter-change="handleSorterChange"
          >
            <template #empty>
              <a-empty :description="config.emptyText ?? '暂无数据'" />
            </template>
            <template v-for="name in slotColumnNames" :key="name" #[name]="scope">
              <slot :name="name" v-bind="scope" />
            </template>
          </a-table>
        </div>

        <!-- 分页区 -->
        <div
          v-if="showPagination"
          class="flex shrink-0 items-center justify-end border-t border-(--color-border-2) px-4 py-3"
        >
          <a-pagination
            :total="total"
            :current="current"
            :page-size="pageSize"
            :show-total="paginationConfig?.showTotal ?? true"
            :show-more="paginationConfig?.showMore ?? true"
            :show-page-size="paginationConfig?.showPageSize ?? true"
            :show-jumper="paginationConfig?.showJumper ?? true"
            :page-size-options="pageSizeOptions"
            @change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>
/* 让 Arco 表格撑满外层高度边界，由表格内部承担纵向滚动；
   否则表体随行数无限增高，横向滚动条会被长列表顶到最底部 */
:deep(.arco-table),
:deep(.arco-spin),
:deep(.arco-table-container) {
  height: 100%;
}

/* 表体外层占满纵向 flex 的剩余高度，配合 .arco-table-body 的内联 max-height: 100% 触发内部滚动 */
:deep(.arco-table-content > .arco-scrollbar:not(.arco-table-header-sticky)) {
  flex: 1;
  min-height: 0;
}

/* 数据不足一屏时也让表体占满，保证横向滚动条位置稳定 */
:deep(.arco-table-content > .arco-scrollbar:not(.arco-table-header-sticky) > .arco-table-body) {
  height: 100%;
}

/* 表体滚动条常驻可见，避免默认透明、需要悬停才显示 */
:deep(.arco-table-content > .arco-scrollbar:not(.arco-table-header-sticky) .arco-scrollbar-thumb) {
  opacity: 0.8;
}
</style>
