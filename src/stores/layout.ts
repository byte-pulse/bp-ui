import { defineStore } from 'pinia'
import type { GlobalThemeOverrides } from 'naive-ui'

export const useLayoutStore = defineStore(
  'layout',
  () => {
    // 布局状态
    const collapsed = ref<boolean>(false)
    // 主题名称
    const themeName = ref<'default' | 'blackWhite'>('default')
    // 卡片背景颜色
    const cardColor = ref<string | undefined>('white')
    // 主题颜色
    const themeColor = ref<GlobalThemeOverrides['common']>({})
    // 是否暗色模式
    const isDark = ref<boolean>(false)
    // 展示标签页
    const showTabs = ref<boolean>(false)
    // 深色菜单
    const darkMenu = ref<boolean>(false)

    return { collapsed, themeName, cardColor, themeColor, isDark, showTabs, darkMenu }
  },
  {
    persist: true,
  },
)
