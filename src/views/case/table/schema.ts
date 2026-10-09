import type {
  ProFormField,
  ProTableAction,
  ProTableColumn,
  ProTablePaginationConfig,
  ProTableRecord,
} from '@/components/pro'
import { createStatusEnum } from '@/components/pro'

/**
 * 通用列表页模板配置
 *
 * 本文件是列表页的「唯一配置入口」：搜索区、表格列、新增/编辑表单全部在此声明，
 * 页面组件（TableExample.vue）不出现任何字段级细节，便于复制到新业务页直接改配置。
 *
 * 说明：示例自带字典以便整体复制；实际项目中同一实体的字典应集中维护，避免多处定义。
 */

/* ------------------------------ 字典 ------------------------------ */

/** 用户状态字典 */
export const statusEnum = createStatusEnum([
  { label: '启用', value: 1, color: 'green' },
  { label: '禁用', value: 0, color: 'red' },
])

/** 用户角色字典 */
export const roleEnum = createStatusEnum([
  { label: '系统管理员', value: 'admin', color: 'arcoblue' },
  { label: '运营人员', value: 'operator', color: 'green' },
  { label: '普通用户', value: 'user', color: 'gray' },
  { label: '访客', value: 'guest', color: 'orange' },
])

/* ------------------------------ 搜索区 ------------------------------ */

/**
 * 搜索区字段配置
 *
 * 若省略 `search.schema`，ProTable 会自动以「列即搜索项」的方式从 `columns` 推导；
 * 此处显式声明，以便补充「关键词」这类跨字段条件并精确控制形态。
 */
export const searchSchema: ProFormField[] = [
  {
    fieldName: 'keyword',
    label: '关键词',
    component: 'input',
    placeholder: '用户名 / 昵称 / 邮箱',
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'select',
    valueEnum: statusEnum,
    placeholder: '全部状态',
  },
  {
    fieldName: 'createTimeRange',
    label: '创建时间',
    component: 'dateRange',
    componentProps: { valueFormat: 'YYYY-MM-DD' },
  },
  {
    fieldName: 'phone',
    label: '手机号',
    component: 'input',
    placeholder: '请输入手机号',
  },
]

/* ------------------------------ 表格列 ------------------------------ */

/**
 * 表格列配置
 *
 * 约定：
 * - `valueType: 'index'` 为跨页连续序号列；
 * - 声明 `valueEnum` 的列默认渲染为字典标签；
 * - 声明 `sorter` 的列开启后端排序（透传 sortField / sortOrder）；
 * - 声明 `filters` 的列开启表头筛选（后端筛选，与搜索区互不干扰）；
 * - 操作列不在此声明，由 `createTableActions` 生成的配置交给 ProTable 自动追加。
 */
export const columns: ProTableColumn[] = [
  {
    dataIndex: 'index',
    title: '序号',
    valueType: 'index',
    width: 70,
    align: 'center',
    fixed: 'left',
    hideInSearch: true,
  },
  {
    dataIndex: 'username',
    title: '用户名',
    width: 140,
    copyable: true,
    fixed: 'left',
  },
  {
    dataIndex: 'nickname',
    title: '昵称',
    width: 130,
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    minWidth: 220,
    ellipsis: true,
    tooltip: true,
  },
  {
    dataIndex: 'phone',
    title: '手机号',
    width: 150,
  },
  {
    dataIndex: 'role',
    title: '角色',
    width: 140,
    valueType: 'select',
    valueEnum: roleEnum,
    filters: [
      { text: '系统管理员', value: 'admin' },
      { text: '运营人员', value: 'operator' },
      { text: '普通用户', value: 'user' },
      { text: '访客', value: 'guest' },
    ],
  },
  {
    dataIndex: 'status',
    title: '状态',
    width: 100,
    align: 'center',
    valueType: 'select',
    valueEnum: statusEnum,
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
    width: 180,
    sorter: true,
  },
]

/* ------------------------------ 分页 ------------------------------ */

/**
 * 分页配置
 *
 * 分页始终固定于表格底部，这里只决定其水平对齐方式：
 * `start` 靠左 / `center` 居中 / `end` 靠右（默认，可省略）。
 */
export const pagination: ProTablePaginationConfig = {
  position: 'end',
}

/* ------------------------------ 操作列 ------------------------------ */

/** 操作列按钮回调集合 */
export interface TableActionHandlers {
  /** 编辑 */
  onEdit: (record: ProTableRecord) => void
  /** 删除 */
  onDelete: (record: ProTableRecord) => void
}

/**
 * 生成操作列按钮配置
 *
 * 操作列由 ProTable 依据本配置自动生成，页面不再是「一堆按钮标签」：
 * 文案、形态、状态色、显隐规则集中在此维护，页面只提供业务回调。
 * 后续要加「详情 / 重置密码」等按钮，在此追加一项即可，页面无需改动。
 *
 * @param handlers 业务回调集合
 */
export const createTableActions = (handlers: TableActionHandlers): ProTableAction[] => [
  {
    key: 'edit',
    label: '编辑',
    onClick: handlers.onEdit,
  },
  {
    key: 'delete',
    label: '删除',
    status: 'danger',
    onClick: handlers.onDelete,
  },
]

/* ------------------------------ 表单 ------------------------------ */

/**
 * 新增 / 编辑表单字段配置
 *
 * 新增与编辑共用同一份 schema，由 `ProFormModal` 按行数据回填。
 */
export const formSchema: ProFormField[] = [
  {
    fieldName: 'username',
    label: '用户名',
    component: 'input',
    placeholder: '请输入用户名',
    rules: [{ required: true, message: '请输入用户名' }],
  },
  {
    fieldName: 'nickname',
    label: '昵称',
    component: 'input',
    placeholder: '请输入昵称',
    rules: [{ required: true, message: '请输入昵称' }],
  },
  {
    fieldName: 'email',
    label: '邮箱',
    component: 'input',
    placeholder: '请输入邮箱',
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '邮箱格式不正确' },
    ],
  },
  {
    fieldName: 'phone',
    label: '手机号',
    component: 'input',
    placeholder: '请输入手机号',
    rules: [{ match: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
  },
  {
    fieldName: 'role',
    label: '角色',
    component: 'select',
    valueEnum: roleEnum,
    defaultValue: 'user',
    placeholder: '请选择角色',
    rules: [{ required: true, message: '请选择角色' }],
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'radio',
    valueEnum: statusEnum,
    defaultValue: 1,
  },
]
