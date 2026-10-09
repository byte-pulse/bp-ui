import type { ProFormField, ProTableAction, ProTableColumn, ProTableRecord } from '@/components/pro'
import { createStatusEnum } from '@/components/pro'

/**
 * 用户管理页配置
 *
 * 页面本体只声明「配置」，渲染与通用逻辑全部内聚在 ProForm / ProTable 中，
 * 保证列表页不堆叠模板、配置集中可维护。
 */

/** 用户状态字典 */
export const userStatusEnum = createStatusEnum([
  { label: '启用', value: 1, color: 'green' },
  { label: '禁用', value: 0, color: 'red' },
])

/** 用户角色字典 */
export const userRoleEnum = createStatusEnum([
  { label: '系统管理员', value: 'admin', color: 'arcoblue' },
  { label: '运营人员', value: 'operator', color: 'green' },
  { label: '普通用户', value: 'user', color: 'gray' },
  { label: '访客', value: 'guest', color: 'orange' },
])

/**
 * 搜索区字段配置
 *
 * 单独声明以便精确控制搜索项、占位文案与栅格占比。
 */
export const userSearchSchema: ProFormField[] = [
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
    valueEnum: userStatusEnum,
    placeholder: '全部状态',
  },
]

/**
 * 表格列配置
 *
 * 约定：`valueType: 'index'` 为序号列；操作列由 `createUserActions` 生成的配置驱动，不在此声明。
 */
export const userColumns: ProTableColumn[] = [
  {
    dataIndex: 'index',
    title: '序号',
    valueType: 'index',
    width: 70,
    align: 'center',
    hideInSearch: true,
  },
  {
    dataIndex: 'username',
    title: '用户名',
    width: 140,
    copyable: true,
  },
  {
    dataIndex: 'nickname',
    title: '昵称',
    width: 140,
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
    valueEnum: userRoleEnum,
    width: 130,
  },
  {
    dataIndex: 'status',
    title: '状态',
    valueEnum: userStatusEnum,
    width: 100,
    align: 'center',
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
    width: 180,
  },
]

/* ------------------------------ 操作列 ------------------------------ */

/** 操作列按钮回调集合 */
export interface UserActionHandlers {
  /** 编辑 */
  onEdit: (record: ProTableRecord) => void
  /** 删除 */
  onDelete: (record: ProTableRecord) => void
}

/**
 * 生成用户列表的操作列配置
 *
 * 操作列由 ProTable 依据配置自动渲染，页面只负责提供业务回调，
 * 新增操作按钮时改这里即可，无需回到模板中堆叠标签。
 *
 * @param handlers 业务回调集合
 */
export const createUserActions = (handlers: UserActionHandlers): ProTableAction[] => [
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

/**
 * 新增 / 编辑表单字段配置
 *
 * 新增与编辑共用同一份 schema，由 `ProFormModal` 按行数据回填。
 */
export const userFormSchema: ProFormField[] = [
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
    valueEnum: userRoleEnum,
    defaultValue: 'user',
    placeholder: '请选择角色',
    rules: [{ required: true, message: '请选择角色' }],
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'radio',
    valueEnum: userStatusEnum,
    defaultValue: 1,
  },
]
