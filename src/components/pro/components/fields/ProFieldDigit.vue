<script lang="ts" setup>
/**
 * 数字字段渲染器
 *
 * 对应 valueType: `digit`
 */
defineOptions({ name: 'ProFieldDigit', inheritAttrs: false })

/** 双向绑定值 */
const modelValue = defineModel<number | undefined>()

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
  <a-input-number v-model="modelValue" :placeholder="placeholder" class="w-full" v-bind="$attrs" />
</template>
