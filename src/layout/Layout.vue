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
      <a-layout style="padding: 12px 24px; background-color: var(--color-bg-4)">
        <a-layout-content>
          <a-layout> <Tabs /></a-layout>

          <RouterView v-slot="{ Component, route }">
            <transition
              name="fade-slide"
              mode="out-in"
              enter-active-class="animate__animated animate__fadeInLeftBig animate__faster"
              leave-active-class="animate__animated animate__fadeOutLeftBig animate__faster"
            >
              <component
                :is="Component"
                style="width: 100%; border-radius: 4px"
                :style="{ height: layoutStore.showTabs ? 'calc(100% - 32px - 12px)' : '100%' }"
                :key="route.fullPath"
              />
            </transition>
          </RouterView>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped></style>
