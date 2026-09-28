<template>
  <div class="w-full h-full flex items-center justify-center">
    <a-result status="404" subtitle="生活总归带点荒谬">
      <template #extra>
        <a-space>
          <a-button @click="handleClick">回到首页</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const handleClick = throttle(() => {
  router.push('/')
}, 2000)
</script>

<style lang="scss" scoped></style>
