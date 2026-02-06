<template>
  <n-layout-content
    class="p-6 content"
    :native-scrollbar="false"
    content-style="min-height: calc(100vh - 128px);"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </n-layout-content>
</template>

<style lang="scss" scoped>
/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content {
  height: calc(100vh - vv.$header-heigth);
  padding: vv.$primary-padding;
}
</style>
