<script lang="ts" setup>
const layoutStore = useLayoutStore()

// 监听主题变化,立即执行一次
watch(
  () => layoutStore.themeName,
  (newVal) => {
    if (newVal === 'dark') {
      document.documentElement.setAttribute('arco-theme', 'dark')
      document.body.setAttribute('arco-theme', 'dark')
    } else {
      document.documentElement.setAttribute('arco-theme', 'light')
      document.body.removeAttribute('arco-theme')
    }
  },
  { immediate: true },
)

onMounted(() => {})
</script>

<template>
  <div class="app-container w-screen h-screen scroll-smooth">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
body ::selection {
  background: var(--primary-6);
  color: var(--primary-1);
  text-shadow: none;
}
</style>
