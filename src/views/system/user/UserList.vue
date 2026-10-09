<script lang="ts" setup>
import { deleteUser, getUserPage, saveUser } from '@/api/user'
import { useProTable, type ProFormModalInstance, type ProRecord } from '@/components/pro'
import { createUserActions, userColumns, userFormSchema, userSearchSchema } from './schema'

/**
 * 用户管理
 *
 * 页面仅承担「编排」职责：
 * - 表格的查询 / 分页 / 列设置 / 删除二次确认由 ProTable 与 useProTable 内聚；
 * - 新增 / 编辑弹窗的校验、提交、反馈由 ProFormModal 内聚；
 * - 字段与列的配置全部外置在 ./schema.ts。
 */

/** 表格实例与通用删除流程 */
const { tableRef, handleDelete } = useProTable()

/** 弹窗表单实例 */
const modalRef = ref<ProFormModalInstance>()

/**
 * 打开新增 / 编辑弹窗
 *
 * @param record 行数据；不传为新增
 */
const openModal = (record?: ProRecord): void => {
  modalRef.value?.open(record)
}

/**
 * 提交用户表单
 *
 * 表单值为动态 schema 产物，此处收敛为接口入参类型。
 */
const handleUserSubmit = (values: ProRecord) => saveUser(values as UserSaveForm)

/**
 * 删除用户
 *
 * @param record 行数据
 */
const handleUserDelete = (record: ProRecord): void => {
  handleDelete(record, (row) => deleteUser(row.id as number), { content: `确定删除用户「${record.username}」吗？` })
}

/** 操作列配置：按钮形态来自 ./schema.ts，页面只提供业务回调 */
const actions = createUserActions({
  onEdit: (record) => openModal(record),
  onDelete: handleUserDelete,
})
</script>

<template>
  <!-- 页面根节点需具备确定高度，ProTable 的自适应高度才能生效 -->
  <div class="h-full w-full">
    <ProTable
      ref="tableRef"
      row-key="id"
      :columns="userColumns"
      :search="{ schema: userSearchSchema }"
      :request="getUserPage"
      :toolbar="{ title: '用户管理' }"
      :row-selection="{ type: 'checkbox', showCheckedAll: true }"
      :actions="actions"
    >
      <!-- 工具栏操作区 -->
      <template #toolbar-actions>
        <a-button type="primary" size="small" @click="openModal()">新增用户</a-button>
      </template>
    </ProTable>

    <!-- 新增 / 编辑弹窗 -->
    <ProFormModal
      ref="modalRef"
      :schema="userFormSchema"
      :submit="handleUserSubmit"
      :initial-values="{ status: 1 }"
      @success="tableRef?.refresh()"
    />
  </div>
</template>

<style lang="scss" scoped></style>
