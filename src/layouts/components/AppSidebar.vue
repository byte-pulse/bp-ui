<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    :native-scrollbar="false"
    show-trigger="bar"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <div class="h-16 flex items-center justify-center border-b logo-div">
      <img v-if="!collapsed" src="@/assets/images/github.png" alt="Logo" />
    </div>
    <div class="menu-div">
      <n-scrollbar>
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :value="activeKey"
        />
      </n-scrollbar>
    </div>
  </n-layout-sider>
</template>

<script lang="ts" setup>
import type { MenuOption } from 'naive-ui'
import type { AppRouteRecordRaw } from '@/router/types' // 你的自定义路由类型
import type { VNodeChild } from 'vue'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const activeKey = computed(() => route.name as string)

// 从平铺路由生成多级菜单（通过 parentName）
const menuOptions = computed<MenuOption[]>(() => {
  const mainRoute = router.options.routes.find((r) => r.path === '/')
  if (!mainRoute?.children) return []
  return generateMenuFromParentName(mainRoute.children as AppRouteRecordRaw[])
})

function generateMenuFromParentName(routes: AppRouteRecordRaw[]): MenuOption[] {
  const router = useRouter()
  const routerMap = new Map<string, AppRouteRecordRaw>()
  const menuMap = new Map<string, MenuOption>()

  // 先生成所有菜单项
  routes.forEach((r) => {
    if (r.meta?.enabled === false || r.meta?.hidden === true) return

    const menuItem: MenuOption = {
      label: r.meta?.title || r.name!,
      key: r.name! as string, // ✅ 用路由 name 作为 key
      icon: renderIconUtil(r.meta?.icon) as () => VNodeChild,
      children: []
    }

    // 点击逻辑
    menuItem.onClick = () => {
      const target = routerMap.get(r.name! as string)
      if (!target) return
      if (target.redirect) router.push(target.redirect as string)
      else if (target.path) router.push(target.path)
    }

    menuMap.set(r.name! as string, menuItem)
    routerMap.set(r.name! as string, r)
  })

  const menuTree: MenuOption[] = []

  // 构建多级菜单
  menuMap.forEach((menuItem, name) => {
    const route = routerMap.get(name)!
    const parentName = route.meta?.parentName
    if (parentName && menuMap.has(parentName as string)) {
      menuMap.get(parentName as string)!.children!.push(menuItem)
    } else {
      menuTree.push(menuItem)
    }
  })

  // 清理空 children，让 Naive UI 判断目录
  const cleanChildren = (items: MenuOption[]) => {
    items.forEach((i) => {
      if (i.children?.length === 0) delete i.children
      else cleanChildren(i.children as MenuOption[])
    })
  }
  cleanChildren(menuTree)

  return menuTree
}
</script>

<style lang="scss" scoped>
.n-layout-sider {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-div {
  height: vv.$header-heigth;
  display: flex;
  align-items: center;
  padding: 0 vv.$primary-padding;

  img {
    height: 80%;
  }
}

.menu-div {
  width: 100%;
  height: calc(100vh - vv.$header-heigth);
}
</style>
