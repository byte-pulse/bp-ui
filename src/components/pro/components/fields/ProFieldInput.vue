<script lang="ts" setup>
/**
 * 单行文本字段渲染器
 *
 * 对应 valueType: `text` / `input`
 */
defineOptions({ name: 'ProFieldInput', inheritAttrs: false })

/** 双向绑定值 */
const modelValue = defineModel<string | undefined>()

withDefaults(
  defineProps<{
    /** 占位提示 */
    placeholder?: string
  }>(),
  {
    placeholder: '请输入',
  },
)
</script>

<template>
  <a-input v-model="modelValue" :placeholder="placeholder" allow-clear v-bind="$attrs" />
</template>
