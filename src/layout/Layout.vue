<script lang="ts" setup>
const layoutStore = useLayoutStore()

onMounted(() => {})
</script>

<template>
  <a-layout>
    <!-- 侧边栏区域 -->
    <a-layout-sider
      breakpoint="lg"
      :collapsed-width="layoutStore.collapsedCollapsedWidth"
      :width="layoutStore.sidebarWidth"
      collapsible
      :collapsed="layoutStore.collapsed"
      hide-trigger
    >
      <Sidebar />
    </a-layout-sider>
    <!-- 主内容区域 -->
    <a-layout>
      <!-- 头部区域 -->
      <a-layout-header>
        <Header />
      </a-layout-header>
      <!-- 内容区域，路由出口位置 -->
      <a-layout :style="{ backgroundColor: layoutStore.themeName === 'dark' ? 'var(--color-bg-4)' : '#f2f3f5' }">
        <a-layout-content>
          <Transition name="tabs">
            <a-layout class="h-8" v-if="layoutStore.showTabs"> <Tabs /></a-layout>
          </Transition>
          <div
            class="w-full px-4 py-2"
            :style="{
              height: layoutStore.showTabs ? 'calc(100vh - 60px -  32px)' : 'calc(100vh - 60px)',
              maxHeight: layoutStore.showTabs ? 'calc(100vh - 60px -  32px)' : 'calc(100vh - 60px)',
              overflowY: 'scroll',
            }"
          >
            <RouterView v-slot="{ Component, route }">
              <transition
                name="fade-slide"
                mode="out-in"
                enter-active-class="animate__animated animate__fadeInLeftBig animate__faster"
                leave-active-class="animate__animated animate__fadeOutLeftBig animate__faster"
              >
                <component :is="Component" style="width: 100%; height: 100%" :key="route.fullPath" />
              </transition>
            </RouterView>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped></style>
