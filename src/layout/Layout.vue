<script lang="ts" setup>
const layoutStore = useLayoutStore()

onMounted(() => {})
</script>

<template>
  <n-layout has-sider class="h-screen w-screen">
    <!-- 侧边栏区域 -->
    <!--
      show-trigger="arrow-circle"
     -->
    <n-layout-sider
      v-model:collapsed="layoutStore.collapsed"
      collapse-mode="width"
      :collapsed-width="80"
      :width="260"
      class="h-screen"
    >
      <Sidebar />
    </n-layout-sider>

    <!-- 主内容区域 -->
    <n-layout content-style="scrollbar-width: none">
      <!-- 头部区域 -->
      <n-layout-header
        class="h-15 border-b w-full px-4"
        :class="{
          'border-gray-200': !layoutStore.isDark,
          'border-zinc-500': layoutStore.isDark,
        }"
      >
        <Header />
      </n-layout-header>
      <div
        class="overflow-hidden shrink-0"
        :style="{
          height: layoutStore.showTabs ? '36px' : '0px',
          opacity: layoutStore.showTabs ? 1 : 0,
          transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
        }"
      >
        <Tabs />
      </div>
      <!-- 内容区域，路由出口位置 -->
      <n-layout-content
        content-class="p-4"
        style="transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        :class="{
          'h-[calc(100vh-60px)]': !layoutStore.showTabs,
          'h-[calc(100vh-100px)]': layoutStore.showTabs,
        }"
        ref="contentRef"
      >
        <RouterView v-slot="{ Component, route }">
          <transition
            name="fade-slide"
            mode="out-in"
            enter-active-class="animate__animated animate__fadeInLeftBig animate__faster"
            leave-active-class="animate__animated animate__fadeOutLeftBig animate__faster"
          >
            <component :is="Component" style="width: 100%; height: 100%; border-radius: 4px" :key="route.fullPath" />
          </transition>
        </RouterView>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style lang="scss" scoped></style>
