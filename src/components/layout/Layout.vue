<script lang="ts" setup>
const router = useRouter()
const authStore = useAuthStore()


const logout = () => {
  authStore.token = ''
  router.replace('/login')
}

</script>

<template>
  <div class="layout-container w-screen h-screen bg-blue-300">

    <n-button type="primary" @click="logout">退出登录</n-button>
  </div>
</template>

<style lang="scss" scoped></style>
