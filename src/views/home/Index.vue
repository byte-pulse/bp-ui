<template>
  <div class="home-container">
    <n-button @click="handleLogin">登陆测试</n-button>
  </div>
</template>

<script lang="ts" setup>
import { checkLogin } from '@/api/login'

const handleLogin = throttle(async () => {
  await checkLogin()
}, 2000)
</script>
<style lang="scss" scoped></style>
