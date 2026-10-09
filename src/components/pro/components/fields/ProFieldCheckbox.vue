<script lang="ts" setup>
import type { ProValueEnumItem } from '../../types/field'

/**
 * 多选字段渲染器
 *
 * 对应 valueType: `checkbox`
 */
defineOptions({ name: 'ProFieldCheckbox', inheritAttrs: false })

/** 双向绑定值 */
const modelValue = defineModel<Array<string | number> | undefined>()

const props = withDefaults(
  defineProps<{
    /** 选项列表（由 ProFormItem 依据 valueEnum / options 归一后传入） */
    options?: ProValueEnumItem[]
  }>(),
  {
    options: () => [],
  },
)

/** 归一化为 Arco Checkbox 可识别的选项（value 收敛为 string | number） */
const normalizedOptions = computed(() =>
  props.options.map((item) => ({
    label: item.label,
    value: item.value as string | number,
    disabled: item.disabled,
  })),
)
</script>

<template>
  <a-checkbox-group v-model="modelValue" v-bind="$attrs">
    <a-checkbox v-for="item in normalizedOptions" :key="item.value" :value="item.value" :disabled="item.disabled">
      {{ item.label }}
    </a-checkbox>
  </a-checkbox-group>
</template>
