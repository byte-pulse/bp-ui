<script lang="ts" setup>
import { getMenuTree } from '@/api/menu'

const layoutStore = useLayoutStore()
const router = useRouter()
const route = useRoute()

const isMenuDark = computed(() => {
  if (layoutStore.themeName === 'dark') return false
  return layoutStore.darkMenu
})

// 公司名称
const company = ref('')

const menusRef = ref<Menu[]>([])

// 菜单点击
const handleMenuItemClick = (key: string) => {
  router.push({ name: key })
}

const findAncestorRouteNames = (menus: Menu[], targetRouteName: string, path: string[] = []): string[] | null => {
  for (const menu of menus) {
    // 命中：直接返回祖先链（path 里没有自己）
    if (menu.routeName === targetRouteName) {
      return path
    }

    // 没命中：把自己加进 path，继续往子树找
    if (menu.children && menu.children.length > 0) {
      const found = findAncestorRouteNames(menu.children, targetRouteName, [...path, menu.routeName])
      if (found !== null) return found
    }
  }
  return null
}

// 获取菜单
const getMenuOptions = () => {
  getMenuTree().then((menus) => {
    menusRef.value = menus
    activeParentKey.value = findAncestorRouteNames(menusRef.value, route.name as string) || []
  })
}
// 当前激活的父菜单
const activeParentKey = ref<string[]>([])
// 当前激活的菜单
const activeKey = ref<string[]>([])

// 监听 route 变化
watch(
  () => route.name as string,
  (name) => {
    if (name) {
      activeKey.value = [name]
      // 展开的菜单数组
      activeParentKey.value = [
        ...new Set([...activeParentKey.value, ...(findAncestorRouteNames(menusRef.value, name) || [])]),
      ]
    }
  },
  { immediate: true },
)

onMounted(() => {
  // 从环境变量中获取公司名称
  company.value = import.meta.env.VITE_APP_COMPANY_NAME
  getMenuOptions()
})
</script>

<template>
  <div
    :arco-theme="isMenuDark ? 'dark' : undefined"
    class="h-screen w-full shadow-lg flex flex-col overflow-hidden bg-(--color-bg-2)"
  >
    <!-- logo -->
    <div class="h-15 p-0">
      <div
        class="w-full h-15 flex items-center justify-around"
        :class="{
          'justify-center': layoutStore.collapsed,
          'justify-start': !layoutStore.collapsed,
          'pl-8': !layoutStore.collapsed,
          'gap-2': !layoutStore.collapsed,
        }"
      >
        <img
          v-if="layoutStore.themeName === 'dark'"
          src="@/assets/images/logo-dark.png"
          class="w-8 h-8 object-cover rounded-full"
        />
        <img v-else src="@/assets/images/logo.png" class="w-8 h-8 object-cover rounded-full" />
        <Transition enter-from-class="animate__animated animate__zoomIn animate__delay-2s">
          <p v-if="!layoutStore.collapsed" class="text-(--color-text-1)">
            {{ company }}
          </p>
        </Transition>
      </div>
    </div>
    <a-scrollbar class="h-[calc(100vh-60px)] overflow-auto">
      <a-menu
        show-collapse-button
        style="height: calc(100vh - 60px)"
        v-model:collapsed="layoutStore.collapsed"
        :collapsed-width="layoutStore.collapsedCollapsedWidth"
        breakpoint="lg"
        :theme="isMenuDark ? 'dark' : 'light'"
        v-model:selected-keys="activeKey"
        v-model:open-keys="activeParentKey"
        :auto-open-selected="true"
        @menu-item-click="handleMenuItemClick"
      >
        <RecursiveMenu :menus="menusRef" />
      </a-menu>
    </a-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.arco-menu-collapsed .arco-menu-title) {
  display: none;
}
:deep(.arco-menu-collapsed .arco-menu-has-icon) {
  height: 40px;
  padding: 0;
  display: flex;
  justify-content: center;
}
:deep(.arco-menu-collapsed .arco-menu-icon) {
  margin: 0;
}
</style>
