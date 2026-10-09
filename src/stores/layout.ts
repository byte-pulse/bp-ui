import { defineStore } from 'pinia'

export const useLayoutStore = defineStore(
  'layout',
  () => {
    // 布局状态
    const collapsed = ref<boolean>(false)
    // 主题名称
    const themeName = ref<'dark' | 'light'>('light')
    // 展示标签页
    const showTabs = ref<boolean>(false)
    // 深色菜单
    const darkMenu = ref<boolean>(false)
    // 侧边栏宽度
    const sidebarWidth = ref<number>(250)
    // 侧边栏收起宽度
    const collapsedCollapsedWidth = ref<number>(48)

    return { collapsed, themeName, showTabs, darkMenu, sidebarWidth, collapsedCollapsedWidth }
  },
  {
    persist: true,
  },
)
