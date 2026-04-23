<script lang="ts" setup>
const backgroundColor = ref('white')
const layoutStore = useLayoutStore()
// 监听 主题 变化
watch(
  () => layoutStore.cardColor,
  (newVal) => {
    backgroundColor.value = newVal || 'white'
  },
  { immediate: true },
)

onMounted(() => {
  backgroundColor.value = layoutStore.cardColor || 'white'
})
</script>

<template>
  <div :style="{ background: backgroundColor }">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
