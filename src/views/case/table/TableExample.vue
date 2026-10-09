<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Modal } from '@arco-design/web-vue'
import { batchDeleteUsers, deleteUser, getUserPage, saveUser } from '@/api/user'
import { useProTable, type ProFormModalInstance, type ProRecord } from '@/components/pro'
import { columns, createTableActions, formSchema, pagination, searchSchema } from './schema'

/**
 * 通用列表页模板
 *
 * 页面只承担「编排」职责，通用能力全部内聚在组件与 hooks 中：
 * - 查询 / 分页 / 排序 / 筛选 / 列设置 / 密度 → ProTable 内建；
 * - 单条删除二次确认 → useProTable().handleDelete；
 * - 新增 / 编辑弹窗（校验 + 异步提交 + 反馈）→ ProFormModal 内建；
 * - 字段与列的细节 → ./schema.ts。
 *
 * 复制本文件 + schema.ts 到新业务目录，替换 `columns` / `searchSchema` / `formSchema`
 * 与请求函数，即可得到一个功能完整的企业级列表页。
 */

/** 表格实例 + 单条删除通用流程 */
const { tableRef, handleDelete } = useProTable()

/** 弹窗表单实例 */
const modalRef = ref<ProFormModalInstance>()

/** 当前选中行（由 ProTable 的 selectionChange 事件同步） */
const selectedRows = ref<ProRecord[]>([])

/** 批量删除按钮文案 */
const batchDeleteText = computed(() =>
  selectedRows.value.length ? `批量删除(${selectedRows.value.length})` : '批量删除',
)

/**
 * 同步选中行
 *
 * ProTable 内部维护选中 key，此处同步一份行数据用于工具栏按钮状态。
 */
const handleSelectionChange = (rows: ProRecord[]): void => {
  selectedRows.value = rows
}

/** 清空选中：同时清理 ProTable 内部状态与页面本地状态 */
const clearSelectedRows = (): void => {
  tableRef.value?.clearSelection()
  selectedRows.value = []
}

/**
 * 打开新增 / 编辑弹窗
 *
 * @param record 行数据；不传为新增
 */
const openModal = (record?: ProRecord): void => {
  modalRef.value?.open(record)
}

/** 提交表单：表单值为动态 schema 产物，此处收敛为接口入参类型 */
const handleFormSubmit = (values: ProRecord) => saveUser(values as UserSaveForm)

/**
 * 删除单条记录
 *
 * @param record 行数据
 */
const handleRowDelete = (record: ProRecord): void => {
  handleDelete(
    record,
    async (row) => {
      await deleteUser(row.id as number)
      // 删除后选中集合可能包含已失效的行，需要同步清理
      clearSelectedRows()
    },
    { content: `确定删除用户「${record.username}」吗？删除后不可恢复。` },
  )
}

/**
 * 操作列配置
 *
 * 按钮的文案、形态、状态色全部来自 ./schema.ts，页面只把业务回调交出去，
 * 模板中不再出现任何操作按钮标签。
 */
const actions = createTableActions({
  onEdit: (record) => openModal(record),
  onDelete: handleRowDelete,
})

/** 批量删除选中记录 */
const handleBatchDelete = (): void => {
  if (!selectedRows.value.length) {
    return
  }
  const count = selectedRows.value.length
  Modal.confirm({
    title: '批量删除',
    content: `确定删除选中的 ${count} 条记录吗？删除后不可恢复。`,
    okButtonProps: { status: 'danger' },
    onOk: async () => {
      await batchDeleteUsers(selectedRows.value.map((row) => row.id as number))
      $message.success('删除成功')
      clearSelectedRows()
      await tableRef.value?.refresh()
    },
  })
}
</script>

<template>
  <!-- 页面根节点需具备确定高度，ProTable 的自适应高度才能生效 -->
  <div class="h-full w-full">
    <a-card>
      <ProTable
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :search="{ schema: searchSchema, cols: 3, collapsible: true }"
        :request="getUserPage"
        :toolbar="{ title: '用户列表' }"
        :pagination="pagination"
        :row-selection="{ type: 'checkbox', showCheckedAll: true }"
        :actions="actions"
        :action-column="{ width: 160 }"
        @selection-change="handleSelectionChange"
      >
        <!-- 工具栏操作区：新增 + 批量删除 -->
        <template #toolbar-actions>
          <a-button type="primary" size="small" @click="openModal()">新增用户</a-button>
          <a-button status="danger" size="small" :disabled="!selectedRows.length" @click="handleBatchDelete">
            {{ batchDeleteText }}
          </a-button>
        </template>
      </ProTable>
    </a-card>
    <!-- 新增 / 编辑弹窗 -->
    <ProFormModal
      ref="modalRef"
      :schema="formSchema"
      :submit="handleFormSubmit"
      :initial-values="{ status: 1 }"
      @success="tableRef?.refresh()"
    />
  </div>
</template>

<style lang="scss" scoped>
/**
 * 卡片作为高度容器
 *
 * ProTable 的自适应高度依赖父级具备确定高度，此处把卡片改为纵向弹性容器，
 * 使其内容区撑满卡片剩余高度，ProTable 才能正确计算表体可用高度。
 */
:deep(.arco-card) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.arco-card-body) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
