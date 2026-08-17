<script lang="ts" setup>
import { darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { defaultTheme } from '@/assets/themes/default'
import { blackWhiteTheme } from '@/assets/themes/blackWhite'
import { setupDiscreteApiTheme } from '@/utils/navie'

const layoutStore = useLayoutStore()

const theme = computed(() => (layoutStore.isDark ? darkTheme : undefined))

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  if (layoutStore.isDark === true) {
    layoutStore.cardColor = darkTheme.common.cardColor
    layoutStore.themeColor = darkTheme.common || {}
    return {}
  }
  switch (layoutStore.themeName) {
    case 'blackWhite':
      layoutStore.cardColor = blackWhiteTheme?.common?.cardColor
      layoutStore.themeColor = blackWhiteTheme?.common || {}
      return blackWhiteTheme
    default:
      layoutStore.cardColor = defaultTheme?.common?.cardColor
      layoutStore.themeColor = defaultTheme?.common || {}
      return defaultTheme
  }
})

setupDiscreteApiTheme(theme, themeOverrides)

onMounted(() => {
  // app 挂载完成后获取动态路由
  // getDynamicRoutes()
  printBanner()
  // 带图标和超链接的通知
  sendSystemNotification('新消息提醒', {
    body: '您收到一条新消息',
  })
})
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <div class="app-container w-screen h-screen scroll-smooth">
      <RouterView />
    </div>
  </n-config-provider>
</template>

<style lang="scss" scoped></style>
