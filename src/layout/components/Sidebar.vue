<script lang="ts" setup>
import { getMenuTree } from '@/api/menu'
import { CaretDownOutline } from '@vicons/ionicons5'
import type { MenuInst, MenuOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'
import { defaultDarkTheme } from '@/assets/themes/default'
import { blackWhiteDarkTheme } from '@/assets/themes/blackWhite'

const layoutStore = useLayoutStore()

const darkMenu = computed(() => {
  const theme = layoutStore.themeName
  switch (theme) {
    case 'blackWhite':
      return blackWhiteDarkTheme
    default:
      return defaultDarkTheme
  }
})

// 公司名称
const company = ref('')

const menusRef = ref<Menu[]>([])
const menuOptions = computed<MenuOption[]>(() => {
  return transformMenu(menusRef.value, layoutStore.collapsed)
})

// 渲染菜单标签
function renderMenuLabel(option: MenuOption) {
  if ((option.meta as Menu)?.type === 'M') {
    return h(
      RouterLink,
      { to: { name: option.key } as RouteLocationRaw },
      {
        default: () => option.label as VNodeChild,
      },
    )
  }
  return option.label as VNodeChild
}

// 渲染展开图标
function expandIcon() {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}

// 转换菜单
function transformMenu(list: Menu[], collapsed: boolean): MenuOption[] {
  const result: MenuOption[] = []

  for (const item of list) {
    // 如果当前项是分组且处于收起状态
    if (collapsed && item.isGroup === true) {
      // 递归处理其子菜单，并展开到当前层级
      if (item.children?.length) {
        const childOptions = transformMenu(item.children, collapsed)
        result.push(...childOptions)
      }
      continue // 跳过分组本身
    }

    // 非分组或展开状态：正常处理
    const { children, ...rest } = item
    const option: MenuOption = {
      label: item.title,
      key: item.routeName,
      show: item.hidden !== true,
      meta: rest,
      icon: renderIconUtil(item.icon),
    }

    if (item.isGroup === true) {
      option.type = 'group'
    }

    if (children?.length) {
      option.children = transformMenu(children, collapsed)
    }

    result.push(option)
  }

  return result
}

// 获取菜单
const getMenuOptions = () => {
  getMenuTree().then((menus) => {
    menusRef.value = menus
  })
}

// 当前激活的菜单
const activeKey = ref('')
const menuInstRef = ref<MenuInst>()

// 监听 route 变化
const route = useRoute()
// 尝试展开菜单
const tryExpand = async () => {
  const name = route.name as string
  if (!name || !menuOptions.value.length) return

  activeKey.value = name

  // 等待菜单实例挂载完成
  await nextTick()
  menuInstRef.value?.showOption(name)
}
// 监听 route 变化
watch(() => route.name, tryExpand, { immediate: true })
// 监听 menuOptions 变化 ,防止菜单实例未挂载完成时展开菜单
watch(menuOptions, tryExpand)

onMounted(() => {
  // 从环境变量中获取公司名称
  company.value = import.meta.env.VITE_APP_COMPANY_NAME
  getMenuOptions()
})
</script>

<template>
  <div
    class="h-screen w-full shadow-lg flex flex-col"
    style="background-color: #18181c"
    :style="{
      backgroundColor: !layoutStore.isDark && layoutStore.darkMenu ? darkMenu.common?.actionColor : undefined,
    }"
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
        <img src="@/assets/images/logo.png" class="w-8 h-8 object-cover rounded-full" />
        <Transition enter-from-class="animate__animated animate__zoomIn animate__delay-2s">
          <p
            v-if="!layoutStore.collapsed"
            :style="{
              color: !layoutStore.isDark && layoutStore.darkMenu ? darkMenu.common?.textColor2 : undefined,
            }"
          >
            {{ company }}
          </p>
        </Transition>
      </div>
    </div>
    <n-scrollbar class="shadow-2xl">
      <n-menu
        :theme-overrides="!layoutStore.isDark && layoutStore.darkMenu ? darkMenu : undefined"
        ref="menuInstRef"
        :indent="20"
        v-model:value="activeKey"
        :collapsed="layoutStore.collapsed"
        :collapsed-width="80"
        :collapsed-icon-size="20"
        :options="menuOptions"
        :render-label="renderMenuLabel"
        :expand-icon="expandIcon"
      >
      </n-menu>
    </n-scrollbar>
  </div>
</template>

<style lang="scss" scoped></style>
