# ProForm / ProTable 配置化组件体系建设方案

## 一、背景与目标（Context）

当前项目 `bp-admin-ui` 已完成布局骨架（侧边栏 / 头部 / 多标签页 / 动态路由 / 主题），但**业务层缺失可复用的表单与表格基建**：

- `src/components/form/Form.vue` 是空壳（`<div class="w-full h-full"></div>`），但 `FormExample.vue` 已按 `<Form :formItems="formItems" />` 调用 —— 组件实际不工作。
- 新增一个列表页/表单页时，需要手写大量 `a-form-item` / `a-table-column` 模板，配置散落在页面里，**重复、难维护、不可复用**。

**目标**：基于现有 Arco Design，构建一套 **Schema 驱动的配置化表单/表格体系**（命名 `ProForm` / `ProTable`）。页面只声明「配置（schema）+ 数据源（request）」，渲染逻辑与通用能力全部内聚到组件库中。

**设计原则（对齐大厂规范）**：

1. **关注点分离**：类型 / 注册表 / 渲染器 / 组合式函数 / 预设 分层存放，单文件单一职责。
2. **通用能力公用**：请求、分页、校验、列设置、二次确认删除等通用逻辑只写一次。
3. **可扩展**：字段组件走「注册表」模式，业务侧可注册自定义组件，无需改组件库源码。
4. **类型安全**：全程泛型 + 显式类型，不留 `any` 逃逸。
5. **逃生舱**：任何字段/列都支持 `slot` 与 `render` 完全自定义渲染。

---

## 二、目录结构

全部收敛到 `src/components/pro/`（避开放进 `src/utils/**`，防止 AutoImport 把 `useProTable` 等通用名注入全局引发冲突）。

```
src/components/pro/
├── index.ts                       # 唯一对外出口：组件 / hooks / 类型 / registerField
├── types/
│   ├── field.ts                   # ProValueType / ProValueEnum / ProDynamic / ProRenderFn
│   ├── form.ts                    # ProFormField / ProFormLayout / ProFormActions
│   ├── table.ts                   # ProTableColumn / ProTableRequest / 搜索与工具栏配置
│   ├── instance.ts                # ProFormInstance / ProTableInstance（expose 类型）
│   └── index.ts                   # 类型统一 re-export
├── registry/
│   ├── componentMap.ts            # Map<string, Component> + registerField / getField
│   └── defaultFields.ts           # 内置 valueType → 组件映射（唯一注册默认处）
├── components/
│   ├── ProForm.vue                # a-form 壳 + 栅格 + actions + 校验编排
│   ├── ProFormItem.vue            # 单字段渲染：render → slot → registry 三分发
│   ├── ProTable.vue               # 搜索区 + 工具栏 + a-table + 分页 + request
│   ├── ProTableCell.vue           # 单元格渲染（valueEnum / tag / render / copy）
│   ├── ProFormModal.vue           # 弹窗表单预设（open / submit / success）
│   └── fields/                    # 字段渲染器，统一 ProField* 前缀
│       ├── ProFieldInput.vue      ProFieldTextarea.vue   ProFieldPassword.vue
│       ├── ProFieldDigit.vue      ProFieldSelect.vue     ProFieldSwitch.vue
│       ├── ProFieldRadio.vue      ProFieldCheckbox.vue
│       └── ProFieldDate.vue       ProFieldDateRange.vue
├── hooks/
│   ├── useProForm.ts              # 表单状态 + 提交节流 + 校验失败定位
│   └── useProTable.ts             # 表格实例 + 查询参数 + 通用删除刷新
├── presets/
│   └── index.ts                   # defaultPagination / booleanEnum / createStatusEnum
└── utils/
    └── resolve.ts                 # resolveDynamic / normalizeValueEnum / normalizeResult
```

**命名约束（必须遵守）**：`Components` 插件扫描 `./src/components/**`，任何 `.vue` 都会**以文件名注册为全局组件**，因此：

- 字段渲染器一律 `ProField*` 前缀，禁止出现 `Input.vue` / `Select.vue` 这类通用名。
- 逻辑类文件（hooks / utils / registry）为 `.ts`，不会被组件扫描命中。
- 无需修改 `vite.config.ts` 的 `dirs`（`./src/components/**` 已覆盖）。

---

## 三、核心类型设计

```ts
// types/field.ts
import type { VNode, Component } from 'vue'
import type { FieldRule } from '@arco-design/web-vue'

/** 动态配置：静态值，或基于当前表单值的联动函数 */
export type ProDynamic<T, R> = R | ((values: T) => R)

/** 完全自定义渲染 */
export type ProRenderFn<T = Record<string, any>> = (ctx: {
  record: T
  value: any
  index: number
  column?: ProTableColumn<T>
}) => VNode | string | number

/** 内置值类型（同时作为字段组件与列类型） */
export type ProValueType =
  | 'text' | 'input' | 'textarea' | 'password' | 'digit'
  | 'select' | 'radio' | 'checkbox' | 'switch'
  | 'date' | 'dateRange' | 'time'
  | 'treeSelect' | 'cascader' | 'upload' | 'rate' | 'slider'
  | 'index' | 'option' // 表格专用：序号列 / 操作列

/** 字典项：支持对象或 string 简写 */
export interface ProValueEnumItem {
  label: string
  value: string | number | boolean
  color?: string      // 表格 tag 颜色
  disabled?: boolean
}
export type ProValueEnum = Record<string | number, ProValueEnumItem | string>

/** 注册表 key：内置类型或任意自定义字符串 */
export type ProFieldType = ProValueType | (string & {})
```

```ts
// types/form.ts
export interface ProFormField<T = Record<string, any>> {
  fieldName: string
  label?: string
  component?: ProFieldType
  componentProps?: ProDynamic<T, Record<string, any>> // 函数式联动
  rules?: FieldRule[]
  options?: ProDynamic<T, ProValueEnumItem[]>
  valueEnum?: ProValueEnum
  defaultValue?: unknown
  placeholder?: string
  tooltip?: string
  span?: number                     // 24 栅格；缺省由 layout.cols 换算
  hidden?: ProDynamic<T, boolean>
  disabled?: ProDynamic<T, boolean>
  slot?: string                     // 具名插槽（优先级 > component）
  render?: ProRenderFn<T>           // 最高优先级
  colProps?: Record<string, any>
}

export interface ProFormLayout {
  layout?: 'horizontal' | 'vertical' | 'inline'
  cols?: number                     // 每行列数，默认 1 → span = 24 / cols
  labelColProps?: Record<string, any>
  wrapperColProps?: Record<string, any>
  rowGap?: number
}

export interface ProFormActions {
  showSubmit?: boolean
  showReset?: boolean
  submitText?: string
  resetText?: string
  render?: ProRenderFn
}
```

```ts
// types/table.ts
export interface ProTableColumn<T = Record<string, any>> {
  dataIndex: string
  title: string
  valueType?: ProValueType
  valueEnum?: ProValueEnum
  width?: number | string
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  ellipsis?: boolean
  render?: ProRenderFn<T>
  slot?: string                     // 单元格插槽：自动映射为 #column-{dataIndex}
  sorter?: boolean                  // 后端排序：透传 sortField / sortOrder
  filters?: { text: string; value: string | number }[]
  hideInTable?: boolean             // 列设置默认隐藏
  hideInSearch?: boolean            // 不参与搜索区
  searchSpan?: number
  searchFieldProps?: Partial<ProFormField<T>> // 覆盖搜索区自动生成的表单项
  copyable?: boolean
}

export interface ProTableRequestParams {
  pageNum: number
  pageSize: number
  [key: string]: unknown
}

/** 数据源：兼容既有 PageInfo<T>，也兼容精简的 { list, total } */
export type ProTableRequest<T> = (
  params: ProTableRequestParams,
) => Promise<PageInfo<T> | { list: T[]; total: number }>

export interface ProTableSearchConfig {
  schema: ProFormField[]
  cols?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface ProTableToolbarConfig {
  title?: string
  showRefresh?: boolean
  showColumnSetting?: boolean
  showDensity?: boolean
}
```

---

## 四、组件 API

### ProForm

| 项 | 内容 |
|---|---|
| props | `schema`、`layout`、`actions`、`initialValues`、`loading`、`modelValue`（可选，默认内部维护） |
| emits | `update:modelValue`、`submit(values)`、`reset`、`change(field, value, allValues)`、`valuesChange(allValues)` |
| expose | `formRef`、`validate()`、`validateField(field)`、`resetFields(fields?)`、`setFieldValue`、`setValues`、`getValues`、`clearValidate`、`scrollToField` |
| slots | `#field-{fieldName}`、`#actions`、schema 中 `slot` 声明的具名插槽 |

### ProTable

| 项 | 内容 |
|---|---|
| props | `columns`、`request`、`data`、`rowKey`、`search`、`pagination`、`toolbar`、`rowSelection`、`defaultParams`、`immediate`、`loading`、`tableProps`（透传 a-table） |
| emits | `load(result)`、`requestError(err)`、`paramsChange(params)`、`selectionChange(rows)`、`rowClick(record)` |
| expose | `reload(params?, resetPage?)`、`refresh()`、`reset()`、`getParams()`、`getSelectedRows()`、`clearSelection()`、`getSearchForm()` |
| slots | `#toolbar-actions`、`#toolbar-extra`、`#column-{dataIndex}`、`#empty` |

### hooks（可选增强，组件单独用也完整可用）

- `useProForm`：只做状态与流程编排（模型初始化、提交 pending、提交节流、校验失败聚焦），返回 `{ formRef, values, loading, validate, submit, reset, setFieldValue }`。
- `useProTable`：返回 `{ tableRef, params, reload, reset, handleDelete }`，其中 `handleDelete` 封装「二次确认 + 请求 + 刷新」通用模式。

---

## 五、关键机制

### 1. 字段组件注册表（可扩展）

```ts
// registry/componentMap.ts
const fieldRegistry = new Map<string, Component>()

/** 注册或覆盖字段组件；业务侧可 registerField('richText', RichText) 扩展 */
export function registerField(type: string, component: Component) {
  fieldRegistry.set(type, component)
}
export function getField(type?: string): Component | undefined {
  return type ? fieldRegistry.get(type) : undefined
}
```

`ProFormItem` 的解析优先级统一收敛为：`render` → `slot` → `registry[component]` → `ProFieldInput` 兜底。

### 2. v-model 与字段级联动

- `ProForm` 用 `defineModel<T>()`（Vue 3.5）承接双向绑定；`a-form :model` + `a-form-item :field` 复用 Arco 校验能力。
- 子控件由 `ProFormItem` 手动绑定 `:model-value` / `@update:model-value`（Arco FormItem 不自动代理 v-model）。
- 联动统一用 `computed(() => resolveDynamic(field.componentProps, model.value))`，`hidden / disabled / options` 同理 —— 依赖响应式 `model`，任一字段变化自动重算，无需手写 watch。
- `componentProps` 合并顺序：注册表默认 props → `field.componentProps` → `searchFieldProps`（搜索区覆盖）。

### 3. ProTable 内聚逻辑（零业务耦合）

- 内部状态仅四类：`searchParams`、`tableParams`（分页 + 排序 + 筛选）、`dataSource`、`loading`。
- 唯一取数出口 `fetchData()`：`loading=true` → `await request({ ...searchParams, ...tableParams })` → `normalizeResult` 归一 → `loading=false`；异常触发 `requestError` 且**保留旧数据不清空**。
- 搜索区复用 `ProForm`：从 `columns` 自动推导（`hideInSearch !== true` 且非 `index/option`），合并 `searchFieldProps`。
- 工具栏内建刷新 / 列设置 / 密度；列设置状态存 `localStorage`，key 含列指纹避免串列。

### 4. 分页与 request 约定

- 入参恒定：`{ pageNum, pageSize, ...search, ...(sortField && { sortField, sortOrder }), ...filters }`。
- 出参兼容 `PageInfo<T>`（项目既有形态，`fetchAxios` 已剥离到 `data.data`）或 `{ list, total }`；`normalizeResult` 统一读取。
- 关闭分页时仍传 `pageNum/pageSize`，便于后端接口复用。

---

## 六、页面最终形态（列表页 ≤ 30 行）

```vue
<!-- src/views/system/user/UserList.vue -->
<script setup lang="ts">
import { getUserPage, saveUser, deleteUser } from '@/api/user'
import { userColumns, userSearchSchema, userFormSchema } from './schema'

const tableRef = ref<ProTableInstance<UserItem>>()
const modalRef = ref<ProFormModalInstance>()
</script>

<template>
  <ProTable
    ref="tableRef"
    row-key="id"
    :columns="userColumns"
    :search="{ schema: userSearchSchema }"
    :request="getUserPage"
    :toolbar="{ title: '用户管理' }"
    :row-selection="{ type: 'checkbox' }"
  >
    <template #toolbar-actions>
      <a-button type="primary" @click="modalRef?.open()">新增</a-button>
    </template>
    <template #column-option="{ record }">
      <a-button type="text" @click="modalRef?.open(record)">编辑</a-button>
      <a-button type="text" status="danger" @click="handleDelete(record)">删除</a-button>
    </template>
  </ProTable>

  <ProFormModal ref="modalRef" :schema="userFormSchema" :submit="saveUser" @success="tableRef?.refresh()" />
</template>
```

配置外置（页面零堆叠）：

```ts
// src/views/system/user/schema.ts
export const userSearchSchema: ProFormField[] = [
  { fieldName: 'keyword', label: '关键词', component: 'input', span: 6 },
  { fieldName: 'status', label: '状态', component: 'select', valueEnum: userStatusEnum, span: 6 },
]

export const userFormSchema: ProFormField<UserItem>[] = [
  { fieldName: 'username', label: '用户名', component: 'input', rules: [{ required: true }] },
  { fieldName: 'email', label: '邮箱', component: 'input', rules: [{ type: 'email' }] },
  { fieldName: 'status', label: '状态', component: 'radio', valueEnum: userStatusEnum, defaultValue: 1 },
]
```

---

## 七、与现有代码的衔接

1. **旧 `src/components/form/Form.vue`**：改造为薄适配层，内部渲染 `ProForm`，把 `formItems`（`{fieldName, component, label}`）映射为 `schema`，使 `FormExample.vue` **零改动**继续可用；加 `@deprecated` 注释，新页面统一走 `ProForm`。
2. **mock**：新增 `mock/user/user.ts`（`MockMethod[]`），提供 `GET /api/user/page`、`POST /api/user/save`、`DELETE /api/user/delete`，返回 `{ code:200, data: PageInfo<UserItem> }`。`VITE_APP_USE_MOCK=true` 已开启，url 带 `/api` 前缀即可生效，无需改 vite。
3. **`vite.config.ts`**：无需改动（`./src/components/**` 已覆盖 `pro` 目录）。
4. **http.ts**：直接复用 `fetchAxios`，其响应拦截器已剥离 `data.data`，`request` 可直接 `return fetchAxios.get<PageInfo<T>>(...)`。
5. **类型**：复用 `types/api.d.ts` 中全局 `PageInfo<T>`、`ParamsType`。

---

## 八、分阶段实施与验证

| 阶段 | 内容 | 验证方式 |
|---|---|---|
| P0 | `types/` 全量类型 + `utils/resolve.ts` | `npm run type-check` 通过，无 `any` 逃逸 |
| P1 | `registry/` + `ProField*` 基础字段组件 + `ProFormItem` | 最小 schema 页面可交互 |
| P2 | `ProForm.vue` + `presets/` + `useProForm` | 栅格 / 校验 / actions / slot 手测；`FormExample` 免改动回归 |
| P3 | 旧 `Form.vue` 适配层改造 | mock 中「组件 / 表单」菜单打开验证 |
| P4 | `ProTable.vue` + `ProTableCell` + 工具栏 + `useProTable` | 静态数据 / request 两种模式手测 |
| P5 | `ProFormModal.vue` + `index.ts` 出口 + 用户管理示例页 + mock | 全链路增删改查；`npm run lint`、`npm run build` 双绿 |

**统一验证命令**：`npm run type-check`、`npm run lint`、`npm run dev`（经动态菜单进入 mock 页面预览）。

---

## 九、默认决策（如无异议按此执行）

1. 命名采用 `ProForm` / `ProTable` / `ProFormModal`，字段渲染器统一 `ProField*` 前缀。
2. 组件与 hooks **同时提供**，hooks 为可选增强，不强制。
3. 保留旧 `Form.vue` 作为兼容适配层（`@deprecated`），不直接删除，避免破坏现有示例。
4. 交付含一个「用户管理」示例页 + 对应 mock，用于演示与回归。