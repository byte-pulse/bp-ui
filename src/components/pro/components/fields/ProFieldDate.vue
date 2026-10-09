<script lang="ts" setup>
/**
 * 日期字段渲染器
 *
 * 对应 valueType: `date`
 */
defineOptions({ name: 'ProFieldDate', inheritAttrs: false })

/** 双向绑定值 */
const modelValue = defineModel<string | number | Date | undefined>()

withDefaults(
  defineProps<{
    /** 占位提示 */
    placeholder?: string
  }>(),
  {
    placeholder: '请选择日期',
  },
)
</script>

<template>
  <a-date-picker v-model="modelValue" :placeholder="placeholder" class="w-full" v-bind="$attrs" />
</template>
