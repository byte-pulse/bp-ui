<script lang="ts" setup>
import { type GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { defaultTheme } from '@/assets/themes/default'
import { blackWhiteTheme } from '@/assets/themes/blackWhite'

const layoutStore = useLayoutStore()

const theme = computed(() => {
  if (layoutStore.isDark) {
    return darkTheme
  }
  switch (layoutStore.themeName) {
    case 'blackWhite':
      return blackWhiteTheme as GlobalTheme
    default:
      return defaultTheme as GlobalTheme
  }
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
