import { defineStore } from 'pinia'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string>()
    const role = ref<Array<string>>([])
    const permission = ref<Array<string>>([])

    return { token, role, permission }
  },
  {
    persist: true
  }
)
