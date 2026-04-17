<script lang="ts" setup>
import type { MenuOption, MenuInst } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { BookmarkOutline, CaretDownOutline } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { getMenuTree } from '@/api/menu'

// 公司名称
const company = ref('')

const menuOptions = ref<MenuOption[]>([])

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

// 渲染菜单图标
function renderMenuIcon(option: MenuOption) {
  // 渲染图标占位符以保持缩进
  if (option.type === 'sheep-man') return true
  // 返回 falsy 值，不再渲染图标及占位符
  if (option.type === 'food') return null
  return h(NIcon, null, { default: () => h(BookmarkOutline) })
}

// 渲染展开图标
function expandIcon() {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}
const layoutStore = useLayoutStore()

// 转换菜单
function transformMenu(list: Menu[]): MenuOption[] {
  return list.map((item) => {
    // 1. 解构出 children，剩下的就是 meta
    const { children, ...rest } = item

    return {
      label: item.title, // title -> label
      key: item.routeName, // routeName -> key
      show: item.hidden !== true, // hidden -> show
      meta: rest, // 原始数据，但已经不包含 children

      // 2. 递归处理 children
      children: children?.length ? transformMenu(children) : undefined,
    }
  })
}

// 获取菜单
const getMenuOptions = () => {
  getMenuTree().then((menus) => {
    menuOptions.value = transformMenu(menus)
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
  <div class="h-screen w-full shadow-lg flex flex-col">
    <!-- logo -->
    <div class="h-15 border-b border-gray-200 p-0">
      <div
        class="w-full h-15 flex items-center"
        :class="{
          'justify-center': layoutStore.collapsed,
          'justify-around': !layoutStore.collapsed,
        }"
      >
        <p>logo</p>
        <p v-if="!layoutStore.collapsed">{{ company }}</p>
      </div>
    </div>
    <n-scrollbar class="shadow-2xl">
      <n-menu
        ref="menuInstRef"
        v-model:value="activeKey"
        :collapsed="layoutStore.collapsed"
        :collapsed-width="80"
        :collapsed-icon-size="20"
        :options="menuOptions"
        :render-label="renderMenuLabel"
        :render-icon="renderMenuIcon"
        :expand-icon="expandIcon"
      >
      </n-menu>
    </n-scrollbar>
  </div>
</template>

<style lang="scss" scoped></style>
