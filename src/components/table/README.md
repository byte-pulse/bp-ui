# ITable 配置化表格

通过一份配置对象（`TableConfig`）描述完整的数据表格：列定义、搜索区、数据源、行选择、分页、导出、工具栏全部由配置驱动，无需手写 `a-table` 与分页逻辑。

## 目录

- [特性](#特性)
- [快速开始](#快速开始)
- [ITable Props & 事件](#itable-props-事件)
- [TableConfig 配置](#tableconfig-配置)
- [TableColumn 列](#tablecolumn-列)
- [搜索区 TableSearchConfig](#搜索区-tablesearchconfig)
- [本地模式与远程模式](#本地模式与远程模式)
- [导出 TableExportConfig](#导出-tableexportconfig)
- [工具栏 TableToolbarConfig](#工具栏-tabletoolbarconfig)
- [分页 TablePagination](#分页-tablepagination)
- [插槽](#插槽)
- [实例方法](#实例方法)
- [外观偏好持久化](#外观偏好持久化)
- [行为说明](#行为说明)

## 特性

- **配置驱动**：列、搜索、数据源、分页统一写在配置里
- **两种数据模式**：本地 `data`（前端排序 + 分页）或远程 `request`（接口驱动）
- **搜索区复用表单**：搜索字段即 `FormField`，超过一行自动折叠
- **内置工具栏**：密度 / 边框 / 斑马纹 / 列显隐设置、刷新、选中操作、导出
- **完整行选择能力**：多选、序号列、选中项变化回调、选中主键获取
- **外观偏好持久化**：用户的密度 / 边框 / 斑马纹 / 每页条数设置刷新后仍生效

## 快速开始

`ITable` 已通过 `unplugin-vue-components` 全局自动注册（扫描 `src/components/**`），模板中直接使用 `<ITable>` 即可，**无需 import**。类型需从 `@/components/table/types` 显式引入。

```vue
<script lang="ts" setup>
import type { FormField } from '@/components/form/types'
import type { TableColumn, TableConfig, TableExpose, TableRequestParams, TableResponse } from '@/components/table/types'
import { getTableList } from '@/api/table'

const tableRef = ref<TableExpose>()

const columns: TableColumn[] = [
  { dataIndex: 'name', title: '姓名', width: 120 },
  { dataIndex: 'age', title: '年龄', width: 90, sortable: true },
  { dataIndex: 'status', title: '状态', slotName: 'status' },
]

const searchFields: FormField[] = [
  { field: 'keyword', label: '关键字', type: 'input' },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
]

const fetchTable = (params: TableRequestParams): Promise<TableResponse> => getTableList(params)

const config: TableConfig = {
  columns,
  rowKey: 'id',
  title: '用户列表',
  request: fetchTable,
  search: { fields: searchFields, columns: 4 },
  showIndex: true,
  rowSelection: true,
  pagination: { pageSize: 15 },
}
</script>

<template>
  <div class="h-full min-h-0">
    <ITable ref="tableRef" :config="config">
      <template #status="{ record }">
        <a-tag :color="record.status === 1 ? 'green' : 'gray'">
          {{ record.status === 1 ? '启用' : '禁用' }}
        </a-tag>
      </template>
    </ITable>
  </div>
</template>
```

> 页面根节点建议使用 `<div class="h-full min-h-0">`，表格需要确定的纵向边界才能让表体内部滚动、横向滚动条固定在底部。

## ITable Props & 事件

| 属性     | 类型          | 默认值 | 说明                   |
| -------- | ------------- | ------ | ---------------------- |
| `config` | `TableConfig` | —      | **必填**，表格配置对象 |

| 事件              | 参数                           | 说明             |
| ----------------- | ------------------------------ | ---------------- |
| `selectionChange` | `(keys: (string \| number)[])` | 选中项变化时触发 |

## TableConfig 配置

| 字段           | 类型                                       | 默认值       | 说明                                                        |
| -------------- | ------------------------------------------ | ------------ | ----------------------------------------------------------- |
| `columns`      | `TableColumn[]`                            | —            | **必填**，列配置                                            |
| `rowKey`       | `string`                                   | `'id'`       | 行主键字段                                                  |
| `data`         | `TableRecord[]`                            | —            | 静态数据源，与 `request` 二选一                             |
| `request`      | `(params) => Promise<TableResponse>`       | —            | 远程数据请求，与 `data` 二选一                              |
| `immediate`    | `boolean`                                  | `true`       | 是否初始化自动加载                                          |
| `search`       | `TableSearchConfig`                        | —            | 头部搜索区配置，不填则不渲染搜索区                          |
| `title`        | `string`                                   | `'数据列表'` | 表格标题                                                    |
| `showIndex`    | `boolean`                                  | `false`      | 是否显示序号列                                              |
| `indexColumn`  | `Partial<TableColumnData>`                 | —            | 序号列个性化配置，透传 Arco 列定义（`render` 会被组件覆盖） |
| `rowSelection` | `boolean \| TableRowSelection`             | —            | 行选择配置，传 `true` 时使用 `checkbox` 多选                |
| `bordered`     | `boolean \| TableBorder`                   | `true`       | 是否显示边框                                                |
| `stripe`       | `boolean`                                  | `true`       | 是否显示斑马纹                                              |
| `size`         | `'mini' \| 'small' \| 'medium' \| 'large'` | `'large'`    | 组件尺寸（宽松）                                            |
| `emptyText`    | `string`                                   | `'暂无数据'` | 空数据文案                                                  |
| `stickyHeader` | `boolean`                                  | `true`       | 表头是否吸顶                                                |
| `scroll`       | `{ x?, y?, minWidth?, maxWidth? }`         | —            | 滚动配置，横向固定列时配置 `x`                              |
| `pagination`   | `boolean \| TablePagination`               | —            | 分页配置，传 `false` 关闭分页；不填时按默认开启             |
| `export`       | `TableExportConfig`                        | —            | 导出配置，配置后工具栏右侧渲染导出按钮                      |
| `toolbar`      | `boolean \| TableToolbarConfig`            | —            | 工具栏内置功能配置，传 `false` 隐藏全部内置按钮             |

> `bordered` / `stripe` / `size` / 每页条数会被用户的工具栏「设置」偏好覆盖，详见[外观偏好持久化](#外观偏好持久化)。

## TableColumn 列

在 Arco `TableColumnData` 基础上做了「配置友好」的收窄，其余字段（`width` / `align` / `fixed` / `ellipsis` / `tooltip` / `slotName` 等）原样透传。

| 字段        | 类型                                        | 说明                                                 |
| ----------- | ------------------------------------------- | ---------------------------------------------------- |
| `dataIndex` | `string`                                    | **必填**，列字段名                                   |
| `title`     | `string`                                    | **必填**，列标题                                     |
| `sortable`  | `boolean`                                   | 是否开启排序（远程模式走后端排序，本地模式前端排序） |
| `render`    | `(params: TableRenderParams) => VNodeChild` | 自定义单元格渲染，**优先级高于 `slotName`**          |

`TableRenderParams`：

| 字段       | 类型              | 说明                |
| ---------- | ----------------- | ------------------- |
| `record`   | `TableRecord`     | 当前行数据          |
| `column`   | `TableColumnData` | 当前列定义          |
| `rowIndex` | `number`          | 行索引（从 0 开始） |

自定义渲染示例（`render` 与插槽二选一即可）：

```ts
import { Progress } from '@arco-design/web-vue'

const columns: TableColumn[] = [
  {
    dataIndex: 'score',
    title: '评分',
    sortable: true,
    render: ({ record }) => h(Progress, { percent: Number(record.score) / 100, size: 'small' }),
  },
  // 或使用具名插槽（slotName 与 <template #xxx> 对应）
  { dataIndex: 'status', title: '状态', slotName: 'status' },
]
```

## 搜索区 TableSearchConfig

搜索字段直接复用[表单字段配置](file:///d:/project/byte%20pulse/bp-ui/src/components/form/README.md#formfield-字段)（`FormField`），因此输入、选择、日期、开关等控件与校验规则写法完全一致。

| 字段               | 类型          | 默认值   | 说明                                     |
| ------------------ | ------------- | -------- | ---------------------------------------- |
| `fields`           | `FormField[]` | —        | **必填**，搜索字段集合                   |
| `columns`          | `number`      | `4`      | 每行列数                                 |
| `searchText`       | `string`      | `'查询'` | 查询按钮文案                             |
| `resetText`        | `string`      | `'重置'` | 重置按钮文案                             |
| `collapsible`      | `boolean`     | —        | 是否可折叠；不填时字段数超过一行自动折叠 |
| `defaultCollapsed` | `boolean`     | `true`   | 折叠态是否默认收起                       |

- 搜索字段的栅格占位：字段 `span` > 按 `columns` 均分（`Math.floor(24 / columns)`）。
- 字段的 `defaultValue` 会作为搜索条件初始值；点击「重置」时恢复为默认值并重新加载。

```ts
const searchFields: FormField[] = [
  { field: 'keyword', label: '关键字', type: 'input', props: { placeholder: '姓名 / 邮箱' } },
  { field: 'dept', label: '部门', type: 'select', options: DEPT_OPTIONS },
  { field: 'joinDate', label: '入职日期', type: 'date', props: { valueFormat: 'YYYY-MM-DD' } },
]
```

## 本地模式与远程模式

`data` 与 `request` 二选一：

- **本地模式**（`data`）：组件在前端完成排序与分页。搜索条件不会自动过滤数据，如需过滤请在传入 `data` 前自行处理。
- **远程模式**（`request`）：组件把查询条件、分页、排序参数交给 `request`，由接口返回 `{ list, total }`。

```ts
// 远程请求参数
interface TableRequestParams {
  pageNum: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
  [key: string]: unknown // 展开的搜索条件
}

// 远程请求响应
interface TableResponse<T = TableRecord> {
  list: T[]
  total: number
}
```

排序、翻页、切换每页条数都会自动重新调用 `request`；切换排序或每页条数时会回到第 1 页。若 `immediate: false`，组件加载后不会自动请求，可由外部调用 `reload()` 触发。

## 导出 TableExportConfig

配置后工具栏右侧渲染导出按钮。组件只负责带上当前查询条件与选中主键，实际导出与文件下载由 `request` 完成。

| 字段       | 类型                                                   | 默认值   | 说明               |
| ---------- | ------------------------------------------------------ | -------- | ------------------ |
| `request`  | `(params: TableExportParams) => Promise<void> \| void` | —        | **必填**，导出请求 |
| `text`     | `string`                                               | `'导出'` | 按钮文案           |
| `disabled` | `boolean`                                              | —        | 是否禁用           |

`TableExportParams` = 当前搜索条件 + `sortField` / `sortOrder`（不含分页）+ `keys`。`keys` 有值时表示导出选中数据，为空则按搜索条件导出全部。

```ts
const handleExport = async (params: TableExportParams) => {
  await exportTableList(params) // api 层触发文件下载
  $message.success(params.keys?.length ? `已导出选中的 ${params.keys.length} 条` : '导出成功')
}

const config: TableConfig = {
  // ...
  export: { text: '导出', request: handleExport },
}
```

## 工具栏 TableToolbarConfig

内置工具栏默认全部开启，`toolbar: false` 隐藏全部内置按钮，传对象则按字段覆盖。

| 字段        | 类型      | 默认值 | 说明                                              |
| ----------- | --------- | ------ | ------------------------------------------------- |
| `settings`  | `boolean` | `true` | 设置下拉（密度 / 边框 / 斑马纹 / 列显隐）         |
| `refresh`   | `boolean` | `true` | 刷新按钮                                          |
| `selection` | `boolean` | `true` | 选中操作（查看选中 / 清空选择），开启行选择时生效 |

```ts
const config: TableConfig = {
  // ...
  toolbar: { settings: true, refresh: true, selection: false },
}
```

## 分页 TablePagination

`pagination` 传 `false` 关闭分页；传对象开启并按对象覆盖默认值；不填时按默认开启。

| 字段              | 类型       | 默认值         | 说明                   |
| ----------------- | ---------- | -------------- | ---------------------- |
| `pageSize`        | `number`   | `15`           | 每页条数               |
| `pageSizeOptions` | `number[]` | `[15, 30, 50]` | 每页条数可选项         |
| `showTotal`       | `boolean`  | `true`         | 是否显示总数           |
| `showPageSize`    | `boolean`  | `true`         | 是否显示每页条数切换器 |
| `showJumper`      | `boolean`  | `true`         | 是否显示快速跳转       |
| `showMore`        | `boolean`  | `true`         | 是否显示更多页码       |

> 每页条数优先取用户的持久化偏好，其次取此处 `pageSize`，最后回落到 `15`。

## 插槽

| 插槽名          | 参数                           | 说明                                                            |
| --------------- | ------------------------------ | --------------------------------------------------------------- |
| `toolbar`       | —                              | 工具栏左侧，标题之后，用于补充业务标签 / 按钮                   |
| `toolbar-right` | —                              | 工具栏右侧，内置按钮之后，用于补充业务按钮（自动补分隔线）      |
| 列插槽          | `{ record, column, rowIndex }` | 以列的 `slotName` 为插槽名自定义单元格，需在列上设置 `slotName` |

```vue
<ITable :config="config">
  <template #toolbar>
    <a-tag color="arcoblue">配置驱动</a-tag>
  </template>

  <template #status="{ record }">
    <a-tag :color="record.status === 1 ? 'green' : 'gray'">{{ record.status === 1 ? '启用' : '禁用' }}</a-tag>
  </template>

  <template #action="{ record }">
    <a-space :size="4">
      <a-link @click="handleView(record)">查看</a-link>
      <a-link status="danger" @click="handleDelete(record)">删除</a-link>
    </a-space>
  </template>
</ITable>
```

## 实例方法

通过 `ref` 获取组件实例（类型 `TableExpose`）：

```ts
const tableRef = ref<TableExpose>()

await tableRef.value?.reload() // 重新加载当前页
await tableRef.value?.search() // 使用当前搜索条件查询（回到第 1 页）
await tableRef.value?.reset() // 重置搜索条件并重新加载
tableRef.value?.getSelectedKeys() // 获取当前选中行主键
tableRef.value?.clearSelection() // 清空选中
tableRef.value?.getSearchValues() // 获取当前搜索条件副本
```

| 方法              | 类型                            | 说明                                |
| ----------------- | ------------------------------- | ----------------------------------- |
| `reload`          | `() => Promise<void>`           | 重新加载当前页                      |
| `search`          | `() => Promise<void>`           | 使用当前搜索条件查询（回到第 1 页） |
| `reset`           | `() => Promise<void>`           | 重置搜索条件并重新加载              |
| `getSelectedKeys` | `() => (string \| number)[]`    | 获取当前选中行主键                  |
| `clearSelection`  | `() => void`                    | 清空选中                            |
| `getSearchValues` | `() => Record<string, unknown>` | 获取当前搜索条件副本                |

## 外观偏好持久化

用户在工具栏「设置」中的调整（密度 / 边框 / 斑马纹）与每页条数会写入 `useTableStore` 并持久化到 `localStorage`，全站共享、刷新后仍生效。取值优先级为：

**用户持久化偏好 > 表格配置 > 组件内置默认值（宽松 / 边框 / 斑马纹 / 15 条）**

因此多个页面同时使用 `ITable` 时，用户在任一页面调整的外观会应用到所有表格。

## 行为说明

- **序号列**：`showIndex` 时序号始终由组件按当前页与每页条数计算（`(pageNum - 1) * pageSize + rowIndex + 1`），`indexColumn.render` 会被覆盖；当存在 `fixed: 'left'` 的列时，序号列随之左固定。
- **列显隐**：工具栏「设置」中的列显示开关按 `dataIndex` 控制，不改变列顺序。
- **选中项回调**：选中项变化时同步触发 `selectionChange` 事件，便于外部展示已选数量（示例见 `TableExample.vue`）。
- **加载状态**：远程请求期间表格处于 `loading` 态；本地模式无异步加载。
- **搜索区折叠**：字段数超过一行且未显式关闭 `collapsible` 时，默认只显示首行并出现「展开 / 收起」按钮。
