<script lang="ts" setup>
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const router = useRouter()

const toggleDark = () => {
  if (layoutStore.themeName === 'dark') {
    layoutStore.themeName = 'light'
  } else {
    layoutStore.themeName = 'dark'
  }
}

// 菜单折叠
const toggleCollapse = () => {
  layoutStore.collapsed = !layoutStore.collapsed
}

// 页面设置
const pageSettingsActive = ref(false)
const openPageSettings = () => {
  pageSettingsActive.value = true
}

// 头像下拉选择
const avatarHandleSelect = (value: string | number | Record<string, unknown> | undefined) => {
  switch (value) {
    case '退出登录':
      logout()
      break
  }
}

// 退出登录
const logout = () => {
  authStore.token = ''
  authStore.permission = []
  authStore.role = []
  router.push({ name: 'login' })
  $message.info('账号已退出')
}
</script>

<template>
  <div
    class="h-15 w-full px-4 pr-6 flex items-center justify-between gap-1.5 bg-(--color-bg-2) border-b border-(--color-border-1)"
  >
    <div class="h-full flex items-center">
      <a-button @click="toggleCollapse" :focusable="false">
        <template #icon> </template>
      </a-button>
    </div>
    <div class="h-full flex items-center gap-3">
      <!-- 明暗切换 -->
      <a-button @click="toggleDark" v-if="layoutStore.themeName === 'dark'" quaternary circle :focusable="false">
        <template #icon> </template>
      </a-button>
      <a-button @click="toggleDark" v-else quaternary circle :focusable="false">
        <template #icon> </template>
      </a-button>
      <!-- 消息 -->
      <a-badge dot :count="9" :max-count="99">
        <a-button quaternary circle :focusable="false">
          <template #icon> </template>
        </a-button>
      </a-badge>
      <!-- 设置 -->
      <a-button @click="openPageSettings" quaternary circle :focusable="false">
        <template #icon> </template>
      </a-button>
      <!-- 头像 -->
      <a-dropdown trigger="hover" position="bl" @select="avatarHandleSelect">
        <a-avatar
          object-fit="cover"
          :size="40"
          :image-url="`https://www.dmoe.cc/random.php?t=${new Date().getTime()}`"
        />
        <template #content>
          <a-doption>个人中心</a-doption>
          <a-doption>用户设置</a-doption>
          <a-doption>退出登录</a-doption>
        </template>
      </a-dropdown>
    </div>
    <PageSettings v-model="pageSettingsActive" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-badge .n-badge-sup) {
  transform: translateX(-70%) translateY(10%) scale(0.8);
}
</style>
