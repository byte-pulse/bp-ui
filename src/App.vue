<template>
  <n-config-provider style="width: 100%; height: 100%" :theme-overrides="theme">
    <RouterView />
    <n-global-style />
  </n-config-provider>
</template>

<script setup lang="ts">
import defaultTheme from '@/assets/themes/default'
const settingsStore = useSettingsStore()

const theme = computed(() => getTheme(settingsStore.theme))

const getTheme = (themeName: string) => {
  switch (themeName) {
    case 'defaultTheme':
      return defaultTheme
    default:
      return defaultTheme
  }
}
</script>

<style scoped></style>
