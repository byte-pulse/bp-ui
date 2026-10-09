import { h } from 'vue'
import { Tag } from '@arco-design/web-vue'
import type { ProFormField, ProRecord, ProValueEnumItem } from '@/components/pro'
import { createStatusEnum } from '@/components/pro'

/**
 * 表单组件能力展示配置
 *
 * 与列表页一致：页面不写字段模板，全部能力通过 schema 声明驱动。
 * 本文件按「能力区块」拆分 schema，便于页面逐块展示。
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

/** 用户类型字典 */
export const userTypeEnum = createStatusEnum([
  { label: '个人账号', value: 'personal', color: 'arcoblue' },
  { label: '企业账号', value: 'enterprise', color: 'purple' },
  { label: '其他', value: 'other', color: 'gray' },
])

/** 省份字典 */
export const provinceEnum = createStatusEnum([
  { label: '浙江省', value: 'zj' },
  { label: '江苏省', value: 'js' },
])

/** 省份 -> 城市（演示 options 函数联动） */
const CITY_MAP: Record<string, ProValueEnumItem[]> = {
  zj: [
    { label: '杭州市', value: 'hangzhou' },
    { label: '宁波市', value: 'ningbo' },
  ],
  js: [
    { label: '南京市', value: 'nanjing' },
    { label: '苏州市', value: 'suzhou' },
  ],
}

/** 权限字典（多选场景） */
const permissionEnum: ProValueEnumItem[] = [
  { label: '查看', value: 'read' },
  { label: '编辑', value: 'write' },
  { label: '删除', value: 'delete' },
]

/* ------------------------------ 一、基础表单 ------------------------------ */

/**
 * 基础表单
 *
 * 演示：两列栅格、必填 / 长度 / 格式校验、下拉与单选字典、整行文本域、底部操作区。
 */
export const baseSchema: ProFormField[] = [
  {
    fieldName: 'username',
    label: '用户名',
    component: 'input',
    placeholder: '请输入用户名',
    tooltip: '4-16 位字符，注册后不可修改',
    rules: [
      { required: true, message: '请输入用户名' },
      { minLength: 4, message: '用户名至少 4 位字符' },
      { maxLength: 16, message: '用户名最多 16 位字符' },
    ],
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
  {
    fieldName: 'remark',
    label: '备注',
    component: 'textarea',
    placeholder: '请输入备注信息',
    span: 24,
  },
]

/* ------------------------------ 二、字段类型全览 ------------------------------ */

/** 部门树数据（演示 treeSelect） */
const DEPT_TREE = [
  {
    key: '1',
    title: '总部',
    children: [
      { key: '1-1', title: '研发中心' },
      { key: '1-2', title: '产品中心' },
    ],
  },
  {
    key: '2',
    title: '分公司',
    children: [{ key: '2-1', title: '华东大区' }],
  },
]

/** 省市区级联数据（演示 cascader） */
const REGION_OPTIONS = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      { value: 'hangzhou', label: '杭州市' },
      { value: 'ningbo', label: '宁波市' },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [{ value: 'nanjing', label: '南京市' }],
  },
]

/**
 * 内置字段类型全览
 *
 * 覆盖注册表内置的全部控件（由 `field.component` 决定渲染组件），
 * 三列布局，便于快速查阅每种 valueType 的最终形态。
 */
export const fieldTypeSchema: ProFormField[] = [
  { fieldName: 'fText', label: '单行文本 text', component: 'text', placeholder: 'text 为 input 的别名' },
  { fieldName: 'fTextarea', label: '多行文本 textarea', component: 'textarea' },
  { fieldName: 'fPassword', label: '密码 password', component: 'password' },
  { fieldName: 'fDigit', label: '数字 digit', component: 'digit', componentProps: { min: 0, max: 100 } },
  { fieldName: 'fSelect', label: '下拉选择 select', component: 'select', valueEnum: roleEnum },
  { fieldName: 'fRadio', label: '单选 radio', component: 'radio', valueEnum: statusEnum, defaultValue: 1 },
  {
    fieldName: 'fCheckbox',
    label: '多选 checkbox',
    component: 'checkbox',
    options: permissionEnum,
    defaultValue: ['read'],
  },
  { fieldName: 'fSwitch', label: '开关 switch', component: 'switch', defaultValue: true },
  {
    fieldName: 'fDate',
    label: '日期 date',
    component: 'date',
    componentProps: { valueFormat: 'YYYY-MM-DD' },
  },
  {
    fieldName: 'fDateRange',
    label: '日期区间 dateRange',
    component: 'dateRange',
    componentProps: { valueFormat: 'YYYY-MM-DD' },
  },
  { fieldName: 'fTime', label: '时间 time', component: 'time', componentProps: { format: 'HH:mm' } },
  {
    fieldName: 'fTreeSelect',
    label: '树选择 treeSelect',
    component: 'treeSelect',
    componentProps: { data: DEPT_TREE },
  },
  {
    fieldName: 'fCascader',
    label: '级联选择 cascader',
    component: 'cascader',
    componentProps: { options: REGION_OPTIONS },
  },
  { fieldName: 'fSlider', label: '滑块 slider', component: 'slider', componentProps: { min: 0, max: 100 } },
  { fieldName: 'fRate', label: '评分 rate', component: 'rate', componentProps: { count: 5, allowHalf: true } },
]

/* ------------------------------ 三、字段联动 ------------------------------ */

/**
 * 联动表单
 *
 * 演示四种联动能力，全部由 schema 的函数形态声明，页面无需编写 watch：
 * 1. `hidden`   —— 用户类型为「企业账号」时才显示企业名称；
 * 2. `options`  —— 城市选项随省份变化；
 * 3. `disabled` —— 企业账号不可编辑年龄；
 * 4. 组合联动   —— 用户类型为「其他」时才显示角色说明。
 */
export const linkageSchema: ProFormField[] = [
  {
    fieldName: 'userType',
    label: '用户类型',
    component: 'select',
    valueEnum: userTypeEnum,
    defaultValue: 'personal',
    rules: [{ required: true, message: '请选择用户类型' }],
  },
  {
    fieldName: 'companyName',
    label: '企业名称',
    component: 'input',
    placeholder: '请输入企业名称',
    hidden: (values) => values.userType !== 'enterprise',
    rules: [{ required: true, message: '请输入企业名称' }],
  },
  {
    fieldName: 'province',
    label: '所在省份',
    component: 'select',
    valueEnum: provinceEnum,
    defaultValue: 'zj',
  },
  {
    fieldName: 'city',
    label: '所在城市',
    component: 'select',
    placeholder: '请先选择省份',
    options: (values) => CITY_MAP[values.province as string] ?? [],
  },
  {
    fieldName: 'age',
    label: '年龄',
    component: 'digit',
    componentProps: { min: 0, max: 120 },
    disabled: (values) => values.userType === 'enterprise',
    placeholder: '企业账号不可编辑',
  },
  {
    fieldName: 'roleDesc',
    label: '角色说明',
    component: 'input',
    placeholder: '请描述你的角色',
    span: 24,
    hidden: (values) => values.userType !== 'other',
  },
]

/* ------------------------------ 四、自定义渲染 ------------------------------ */

/**
 * 自定义渲染表单
 *
 * 1. `render` —— 函数式渲染，完全接管控件输出（此处按用户类型渲染不同颜色的标签）；
 * 2. `slot`   —— 交给页面插槽渲染，适合需要复用页面上下文（如权限判断）的展示型内容。
 */
export const customRenderSchema: ProFormField[] = [
  {
    fieldName: 'userType',
    label: '用户类型',
    component: 'select',
    valueEnum: userTypeEnum,
    defaultValue: 'personal',
  },
  {
    fieldName: 'inviteCode',
    label: '邀请码',
    component: 'input',
    placeholder: '请输入邀请码',
    tooltip: '个人账号专属，用于邀请新用户',
  },
  {
    fieldName: 'level',
    label: '会员等级（render 渲染）',
    render: ({ record }) =>
      h(Tag, { color: record.userType === 'enterprise' ? 'purple' : 'arcoblue' }, () =>
        record.userType === 'enterprise' ? '企业版' : '个人版',
      ),
  },
  {
    fieldName: 'openTip',
    label: '开通提示（slot 渲染）',
    slot: 'openTip',
  },
]

/* ------------------------------ 五、只读态 ------------------------------ */

/** 只读态初始值 */
export const readonlyValues: ProRecord = {
  username: 'bp_admin',
  nickname: '超级管理员',
  email: 'admin@bp-admin.com',
  phone: '13800000000',
  role: 'admin',
  status: 1,
  remark: '系统内置账号，用于展示整体禁用态。',
}
