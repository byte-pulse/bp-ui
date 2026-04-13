<template>
  <div class="not-found-container">
    <n-result
      status="404"
      title="404 资源不存在"
      description="生活总归带点荒谬"
    >
      <template #footer>
        <n-button @click="handleClick">找点乐子吧</n-button>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts" setup>
const handleClick = throttle(() => {
  window.open(import.meta.env.VITE_APP_HAPPY_URL, '_blank')
}, 2000)
</script>

<style lang="scss" scoped>
.not-found-container {
  width: 100%;
  height: calc(100vh - vv.$header-heigth - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
