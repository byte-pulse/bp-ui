<script lang="ts" setup>
import type { ProValueEnumItem } from '../../types/field'

/**
 * 下拉选择字段渲染器
 *
 * 对应 valueType: `select`
 */
defineOptions({ name: 'ProFieldSelect', inheritAttrs: false })

/** 双向绑定值 */
const modelValue = defineModel<string | number | boolean | undefined>()

withDefaults(
  defineProps<{
    /** 占位提示 */
    placeholder?: string
    /** 选项列表（由 ProFormItem 依据 valueEnum / options 归一后传入） */
    options?: ProValueEnumItem[]
  }>(),
  {
    placeholder: '请选择',
    options: () => [],
  },
)
</script>

<template>
  <a-select
    v-model="modelValue"
    :placeholder="placeholder"
    :options="options"
    allow-clear
    allow-search
    v-bind="$attrs"
  />
</template>
