<script lang="ts" setup>
import { type GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { defaultTheme } from '@/assets/themes/default'

// 是否暗色模式
const isDark = ref(false)
// const themeName = ref('default')
const theme = computed(() => {
  if (isDark.value) {
    return darkTheme
  }
  const t = defaultTheme
  return t as GlobalTheme
})
</script>

<template>
  <n-config-provider :theme="theme">
    <div class="app-container w-screen h-screen scroll-smooth">
      <RouterView />
    </div>
  </n-config-provider>
</template>

<style lang="scss" scoped></style>
