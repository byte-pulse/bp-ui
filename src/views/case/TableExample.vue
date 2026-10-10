<script lang="ts" setup>
import type { FormField } from '@/components/form/types'
import type {
  TableColumn,
  TableConfig,
  TableExportParams,
  TableRecord,
  TableRequestParams,
  TableResponse,
} from '@/components/table/types'
import { exportTableList, getTableList } from '@/api/table'
import { Progress } from '@arco-design/web-vue'

defineOptions({ name: 'TableExample' })

const selectedCount = ref(0)

// 序号列个性化配置：演示 indexColumn
const DEPT_OPTIONS = ['研发部', '产品部', '设计部', '市场部', '运营部', '财务部'].map((item) => ({
  label: item,
  value: item,
}))

// 头部搜索字段：复用表单字段配置，超过一行自动折叠
const searchFields: FormField[] = [
  { field: 'keyword', label: '关键字', type: 'input', props: { placeholder: '姓名 / 邮箱' } },
  { field: 'dept', label: '部门', type: 'select', options: DEPT_OPTIONS },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
  { field: 'minScore', label: '最低评分', type: 'number', props: { min: 0, max: 100 } },
  { field: 'joinDateStart', label: '入职开始', type: 'date', props: { valueFormat: 'YYYY-MM-DD' } },
  { field: 'joinDateEnd', label: '入职结束', type: 'date', props: { valueFormat: 'YYYY-MM-DD' } },
]

// 评分列：用 render 函数渲染进度条，展示「自定义渲染」能力
const renderScore = ({ record }: { record: TableRecord }) => {
  const score = Number(record.score)
  const color = score >= 90 ? '#00b42a' : score >= 75 ? '#165dff' : '#ff7d00'
  return h(Progress, { percent: score / 100, size: 'small', color, showText: true })
}

// 列配置：固定列 / 省略提示 / 排序 / 自定义渲染 / 插槽列
const columns: TableColumn[] = [
  {
    dataIndex: 'name',
    title: '姓名',
    width: 120,
    fixed: 'left',
    ellipsis: true,
    tooltip: true,
    sortable: true,
  },
  {
    dataIndex: 'gender',
    title: '性别',
    width: 90,
    align: 'center',
    render: ({ record }) => (record.gender === 'male' ? '男' : '女'),
  },
  { dataIndex: 'age', title: '年龄', width: 90, align: 'center', sortable: true },
  { dataIndex: 'dept', title: '部门', width: 120 },
  { dataIndex: 'score', title: '评分', width: 200, sortable: true, render: renderScore },
  { dataIndex: 'status', title: '状态', width: 100, align: 'center', slotName: 'status' },
  { dataIndex: 'email', title: '邮箱', width: 220, ellipsis: true, tooltip: true },
  { dataIndex: 'phone', title: '手机号', width: 140 },
  { dataIndex: 'joinDate', title: '入职日期', width: 140, sortable: true },
  { dataIndex: 'action', title: '操作', width: 140, fixed: 'right', slotName: 'action' },
]

// 远程请求：把配置参数交给 api 层，mock 负责过滤 / 排序 / 分页
const fetchTable = (params: TableRequestParams): Promise<TableResponse> => getTableList(params)

// 导出：有勾选则带上主键只导出选中，否则按当前查询条件导出全部；文件由 api 层触发下载
const handleExport = async (params: TableExportParams) => {
  await exportTableList(params)
  const count = params.keys?.length
  $message.success(count ? `已导出选中的 ${count} 条` : '导出成功')
}

// 表格整体配置：全部通过配置对象描述，工具栏内置功能由组件自行渲染
const config: TableConfig = {
  columns,
  rowKey: 'id',
  title: '用户列表',
  request: fetchTable,
  immediate: true,
  search: {
    fields: searchFields,
    columns: 4,
  },
  showIndex: true,
  indexColumn: { width: 60 },
  rowSelection: { type: 'checkbox' },
  scroll: { x: 1400 },
  pagination: {
    pageSize: 15,
    pageSizeOptions: [15, 30, 50],
  },
  // 后端导出：组件只负责带上当前查询条件，文件由接口返回
  export: {
    text: '导出',
    request: handleExport,
  },
}

const handleSelectionChange = (keys: (string | number)[]) => {
  selectedCount.value = keys.length
}

const handleView = (record: TableRecord) => $message.info(`查看：${String(record.name)}`)
const handleDelete = (record: TableRecord) => $message.warning(`删除：${String(record.name)}`)
</script>

<template>
  <div class="h-full min-h-0">
    <ITable :config="config" @selection-change="handleSelectionChange">
      <!-- 工具栏左侧插槽：仅作业务补充，内置按钮由组件提供 -->
      <template #toolbar>
        <a-tag color="arcoblue">配置驱动</a-tag>
        <a-tag v-if="selectedCount" color="green">已选 {{ selectedCount }}</a-tag>
        <a-button>新增</a-button>
      </template>

      <!-- 状态列插槽 -->
      <template #status="{ record }">
        <a-tag :color="record.status === 1 ? 'green' : 'gray'">
          {{ record.status === 1 ? '启用' : '禁用' }}
        </a-tag>
      </template>

      <!-- 操作列插槽 -->
      <template #action="{ record }">
        <a-space :size="4">
          <a-link @click="handleView(record)">查看</a-link>
          <a-link status="danger" @click="handleDelete(record)">删除</a-link>
        </a-space>
      </template>
    </ITable>
  </div>
</template>

<style lang="scss" scoped></style>
