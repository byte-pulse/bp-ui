<script lang="ts" setup>
import { darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { defaultTheme } from '@/assets/themes/default'
import { blackWhiteTheme } from '@/assets/themes/blackWhite'
import { setupDiscreteApiTheme } from '@/utils/navie'

const layoutStore = useLayoutStore()

const theme = computed(() => (layoutStore.isDark ? darkTheme : undefined))

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  if (layoutStore.isDark) {
    return {}
  }
  switch (layoutStore.themeName) {
    case 'blackWhite':
      return blackWhiteTheme
    default:
      return defaultTheme
  }
})

setupDiscreteApiTheme(theme, themeOverrides)
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <div class="app-container w-screen h-screen scroll-smooth">
      <RouterView />
    </div>
  </n-config-provider>
</template>

<style lang="scss" scoped></style>
