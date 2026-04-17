import { defineStore } from 'pinia'

export const useLayoutStore = defineStore(
  'layout',
  () => {
    // 布局状态
    const collapsed = ref<boolean>(false)
    // 主题名称
    const themeName = ref<string>('default')
    // 是否暗色模式
    const isDark = ref<boolean>(false)
    // 展示标签页
    const showTabs = ref<boolean>(false)

    return { collapsed, themeName, isDark, showTabs }
  },
  {
    persist: true,
  },
)
