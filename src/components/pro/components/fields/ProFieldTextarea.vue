<script lang="ts" setup>
/**
 * 多行文本字段渲染器
 *
 * 对应 valueType: `textarea`
 */
defineOptions({ name: 'ProFieldTextarea', inheritAttrs: false })

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
  <a-textarea v-model="modelValue" :placeholder="placeholder" :auto-size="{ minRows: 3, maxRows: 6 }" v-bind="$attrs" />
</template>
