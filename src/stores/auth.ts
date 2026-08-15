import { defineStore } from 'pinia'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // 认证状态
    const token = ref<string>()
    // 角色
    const role = ref<Array<string>>([])
    // 权限
    const permission = ref<Array<string>>([])
    return { token, role, permission }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
