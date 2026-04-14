<template>
  <div class="w-full h-full flex items-center justify-center">
    <n-result status="403" title="403 无权限" description="生活总归带点荒谬">
      <template #footer>
        <n-button @click="handleClick">回到首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const handleClick = throttle(() => {
  router.push('/')
}, 2000)
</script>

<style lang="scss" scoped></style>
