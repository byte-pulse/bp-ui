import { defineStore } from 'pinia'

export const useLayoutStore = defineStore(
  'layout',
  () => {
    // 布局状态
    const collapsed = ref<boolean>(false)
    return { collapsed }
  },
  {
    persist: true,
  },
)
