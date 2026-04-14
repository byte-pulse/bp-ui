<script lang="ts" setup>
const authStore = useAuthStore()

const clearToken = () => {
  authStore.token = ''
  $message.success('清除token成功')
}
</script>

<template>
  <div class="h-full w-full bg-amber-300 flex items-center">
    <n-button type="primary" @click="clearToken">清除token</n-button>
  </div>
</template>

<style lang="scss" scoped></style>
