<script lang="ts" setup>
const layoutStore = useLayoutStore()

onMounted(() => {})
</script>

<template>
  <n-layout has-sider class="h-screen w-screen">
    <!-- 侧边栏区域 -->
    <n-layout-sider
      v-model:collapsed="layoutStore.collapsed"
      collapse-mode="width"
      :collapsed-width="120"
      :width="220"
      show-trigger="arrow-circle"
      class="h-screen"
    >
      <Sidebar />
    </n-layout-sider>

    <!-- 主内容区域 -->
    <n-layout>
      <!-- 头部区域 -->
      <n-layout-header class="h-15 border-b w-full border-gray-200 px-4">
        <Header />
      </n-layout-header>

      <div class="h-10 w-full" v-if="layoutStore.showTabs">
        <Tabs />
      </div>

      <!-- 内容区域，路由出口位置 -->
      <n-layout-content
        class="p-4 w-full"
        :class="{
          'h-[calc(100vh-60px)]': !layoutStore.showTabs,
          'h-[calc(100vh-100px)]': layoutStore.showTabs,
        }"
        ref="contentRef"
      >
        <RouterView v-slot="{ Component, route }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </RouterView>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style lang="scss" scoped></style>
