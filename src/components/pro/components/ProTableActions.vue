<script lang="ts" setup>
import { computed } from 'vue'
import type { ProTableAction, ProTableRecord } from '../types'
import { resolveDynamic } from '../utils/resolve'

/**
 * 配置化操作列内容
 *
 * 由 ProTable 的操作列通过 `render` 调用，只在表格内部使用，
 * 负责把 `actions` 配置渲染成按钮组，并处理按行数据的显隐与禁用。
 */
defineOptions({ name: 'ProTableActions' })

const props = defineProps<{
  /** 操作按钮配置 */
  actions: ProTableAction[]
  /** 当前行数据 */
  record: ProTableRecord
}>()

/**
 * 判断按钮是否展示
 *
 * 注意：`visible` 未配置时 `resolveDynamic` 会返回 `undefined`，
 * 若直接参与布尔判断会把按钮整体过滤掉，因此这里显式回退为「展示」。
 */
const isVisible = (action: ProTableAction): boolean => resolveDynamic(action.visible, props.record) ?? true

/** 当前行需要展示的按钮（按 `visible` 过滤） */
const visibleActions = computed(() => props.actions.filter(isVisible))

/** 按钮禁用态（按 `disabled` 解析） */
const isDisabled = (action: ProTableAction): boolean => Boolean(resolveDynamic(action.disabled, props.record))

/** 点击按钮：统一把当前行数据作为入参交给业务回调 */
const handleClick = (action: ProTableAction): void => {
  void action.onClick?.(props.record)
}
</script>

<template>
  <a-space :size="4">
    <a-button
      v-for="action in visibleActions"
      :key="action.key"
      :type="action.type ?? 'text'"
      :status="action.status ?? 'normal'"
      :size="action.size ?? 'small'"
      :disabled="isDisabled(action)"
      @click="handleClick(action)"
    >
      <template v-if="action.icon" #icon>
        <IIcon :icon="action.icon" />
      </template>
      {{ action.label }}
    </a-button>
  </a-space>
</template>
