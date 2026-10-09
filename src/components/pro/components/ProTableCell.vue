<script lang="ts" setup>
import { computed } from 'vue'
import type { ProRecord } from '../types/field'
import type { ProTableColumn } from '../types/table'
import { resolveEnumItem } from '../utils/resolve'

/**
 * 表格单元格默认渲染器
 *
 * 依据列的 `valueType` / `valueEnum` 决定展示形态：
 * 序号、字典标签、普通文本（含复制）。
 */
defineOptions({ name: 'ProTableCell' })

const props = defineProps<{
  /** 列配置 */
  column: ProTableColumn
  /** 当前行数据 */
  record: ProRecord
  /** 行下标（当前页内，从 0 开始） */
  rowIndex: number
  /** 当前页码（用于序号列连续编号） */
  pageNum?: number
  /** 每页条数（用于序号列连续编号） */
  pageSize?: number
}>()

/** 原始单元格值 */
const rawValue = computed(() => props.record[props.column.dataIndex])

/** 是否为序号列 */
const isIndexColumn = computed(() => props.column.valueType === 'index')

/** 序号：跨页连续编号 */
const serialNumber = computed(() => {
  const pageNum = props.pageNum ?? 1
  const pageSize = props.pageSize ?? 10
  return (pageNum - 1) * pageSize + props.rowIndex + 1
})

/** 命中字典时的展示项 */
const enumItem = computed(() => resolveEnumItem(props.column.valueEnum, rawValue.value))

/** 展示文本：空值统一展示为 '-' */
const displayText = computed(() => {
  const value = rawValue.value
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  return String(value)
})

/** 复制单元格内容 */
const handleCopy = async () => {
  await navigator.clipboard.writeText(displayText.value)
  $message.success('已复制')
}
</script>

<template>
  <!-- 序号列 -->
  <span v-if="isIndexColumn" class="text-(--color-text-2)">{{ serialNumber }}</span>
  <!-- 字典标签 -->
  <a-tag v-else-if="enumItem" :color="enumItem.color" size="small">{{ enumItem.label }}</a-tag>
  <!-- 普通文本 -->
  <span v-else class="inline-flex items-center gap-1">
    <span>{{ displayText }}</span>
    <IIcon
      v-if="column.copyable && displayText !== '-'"
      icon="ant-design:copy-outlined"
      class="cursor-pointer text-(--color-text-3) transition-colors hover:text-(--color-text-1)"
      @click="handleCopy"
    />
  </span>
</template>

<style lang="scss" scoped></style>
