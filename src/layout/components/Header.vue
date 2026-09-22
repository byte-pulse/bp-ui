<script lang="ts" setup>
import { DoubleLeftOutlined, DoubleRightOutlined } from '@vicons/antd'
import { type DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { MailOutline, SettingsOutline, Moon, SunnyOutline } from '@vicons/ionicons5'

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const router = useRouter()

const toggleDark = () => {
  layoutStore.isDark = !layoutStore.isDark
  if (layoutStore.isDark === true) {
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

// 头像下拉选项
const avatarOptions = ref<DropdownMixedOption[]>([
  {
    label: '个人中心',
    key: '个人中心',
  },
  {
    label: '用户设置',
    key: '用户设置',
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: '退出登录',
    key: '退出登录',
  },
])

// 头像下拉选择
const avatarHandleSelect = (op: string) => {
  switch (op) {
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
  <div class="h-full w-full flex items-center justify-between gap-1.5">
    <div class="h-full flex items-center">
      <n-button @click="toggleCollapse" :focusable="false">
        <template #icon>
          <n-icon v-if="layoutStore.collapsed"><DoubleRightOutlined /></n-icon>
          <n-icon v-else><DoubleLeftOutlined /></n-icon>
        </template>
      </n-button>
    </div>
    <div class="h-full flex items-center gap-3">
      <!-- 明暗切换 -->
      <n-button @click="toggleDark" v-if="layoutStore.isDark" quaternary circle :focusable="false">
        <template #icon>
          <n-icon><Moon /></n-icon>
        </template>
      </n-button>
      <n-button @click="toggleDark" v-else quaternary circle :focusable="false">
        <template #icon>
          <n-icon><SunnyOutline /></n-icon>
        </template>
      </n-button>
      <!-- 消息 -->
      <n-badge :value="14" :max="99">
        <n-button quaternary circle :focusable="false">
          <template #icon>
            <n-icon><MailOutline /></n-icon>
          </template>
        </n-button>
      </n-badge>
      <!-- 设置 -->
      <n-button @click="openPageSettings" quaternary circle :focusable="false">
        <template #icon>
          <n-icon><SettingsOutline /></n-icon>
        </template>
      </n-button>
      <!-- 头像 -->
      <n-dropdown trigger="hover" :options="avatarOptions" placement="bottom-start" @select="avatarHandleSelect">
        <n-avatar
          object-fit="cover"
          round
          :size="40"
          :src="`https://www.dmoe.cc/random.php?t=${new Date().getTime()}`"
        />
      </n-dropdown>
    </div>
    <PageSettings v-model="pageSettingsActive" />
    <!-- <n-button type="primary" @click="toggleTheme('default')"> 默认主题 </n-button>
    <n-button type="primary" @click="toggleTheme('blackWhite')"> 黑白主题 </n-button> -->
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-badge .n-badge-sup) {
  transform: translateX(-70%) translateY(10%) scale(0.8);
}
</style>
