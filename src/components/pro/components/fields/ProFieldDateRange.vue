<script lang="ts" setup>
/**
 * 日期区间字段渲染器
 *
 * 对应 valueType: `dateRange`
 */
defineOptions({ name: 'ProFieldDateRange', inheritAttrs: false })

/** 双向绑定值 */
const modelValue = defineModel<Array<string | number | Date>>()
</script>

<template>
  <a-range-picker v-model="modelValue" class="w-full" v-bind="$attrs" />
</template>
