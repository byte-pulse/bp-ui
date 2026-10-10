<script lang="ts" setup>
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const router = useRouter()

const toggleDark = (event: MouseEvent) => {
  if (!document.startViewTransition) {
    layoutStore.themeName = layoutStore.themeName === 'dark' ? 'light' : 'dark'
    return
  }
  const x = event.clientX
  const y = event.clientY

  const maxX = Math.max(x, window.innerWidth - x)
  const maxY = Math.max(y, window.innerHeight - y)
  const radius = Math.hypot(maxX, maxY)

  const transition = document.startViewTransition(() => {
    layoutStore.themeName = layoutStore.themeName === 'dark' ? 'light' : 'dark'
  })

  transition.ready.then(() => {
    // Light → Dark
    // 新画面从点击位置向外展开
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
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
    <div class="h-full flex items-center"></div>
    <div class="h-full flex items-center gap-5">
      <!-- 明暗切换 -->
      <IIcon
        :width="18"
        icon="ant-design:moon-outlined"
        @click="toggleDark($event)"
        class="text-(--color-text-2) hover:cursor-pointer"
        v-if="layoutStore.themeName === 'dark'"
      />

      <IIcon
        :width="18"
        @click="toggleDark"
        icon="ant-design:sun-outlined"
        class="text-(--color-text-2) hover:cursor-pointer"
        v-else
      />
      <!-- 消息 -->
      <a-badge dot :count="9" :max-count="99">
        <IIcon :width="18" icon="ant-design:bell-outlined" class="text-(--color-text-2) hover:cursor-pointer" />
      </a-badge>
      <!-- 设置 -->
      <IIcon
        :width="18"
        @click="openPageSettings"
        icon="ant-design:setting-outlined"
        class="text-(--color-text-2) hover:cursor-pointer"
      />
      <!-- 头像 -->
      <a-dropdown trigger="hover" position="bl" @select="avatarHandleSelect">
        <a-avatar object-fit="cover" :size="40" :image-url="`https://www.dmoe.cc/random.php`" />
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
