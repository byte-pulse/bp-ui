<script lang="ts" setup>
/**
 * 开关字段渲染器
 *
 * 对应 valueType: `switch`
 */
defineOptions({ name: 'ProFieldSwitch', inheritAttrs: false })

/** 双向绑定值 */
const modelValue = defineModel<boolean | undefined>()
</script>

<template>
  <a-switch v-model="modelValue" v-bind="$attrs" />
</template>
