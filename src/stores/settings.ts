import { defineStore } from 'pinia'

export const useSettingsStore = defineStore(
  'setting',
  () => {
    const theme = ref<string>('default')
    return { theme }
  },
  {
    persist: true
  }
)
