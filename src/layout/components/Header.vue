<script lang="ts" setup>
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const clearToken = () => {
  authStore.token = ''
  authStore.permission = []
  authStore.role = []
  $message.info('清除token成功')
  $message.success('清除token成功')
  $message.error('清除token成功')
  $message.warning('清除token成功')
  $message.loading('清除token成功')
  $message.create('清除token成功')
}

const toggleDark = () => {
  layoutStore.isDark = !layoutStore.isDark
  if (layoutStore.isDark === true) {
    layoutStore.themeName = 'dark'
  }
}

const toggleTheme = (themeName: string) => {
  if (layoutStore.isDark !== true) {
    layoutStore.themeName = themeName
  }
}

const toggleTabs = () => {
  layoutStore.showTabs = !layoutStore.showTabs
}
</script>

<template>
  <div class="h-full w-full flex items-center gap-1.5">
    <n-button type="primary" @click="clearToken">清除token</n-button>
    <n-button type="primary" @click="toggleDark">切换暗色模式</n-button>
    <n-button type="primary" @click="toggleTheme('default')">
      默认主题
    </n-button>
    <n-button type="primary" @click="toggleTheme('blackWhite')">
      黑白主题
    </n-button>
    <n-button type="primary" @click="toggleTabs"> 切换标签页显示 </n-button>
  </div>
</template>

<style lang="scss" scoped></style>
