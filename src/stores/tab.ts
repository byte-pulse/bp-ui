import { defineStore } from 'pinia'

export const useTabStore = defineStore(
  'tab',
  () => {
    // 标签页
    const tabs = ref<{ label: string; key: string }[]>([])
    return { tabs }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
