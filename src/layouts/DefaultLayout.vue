<template>
  <n-layout has-sider class="h-screen">
    <AppSidebar />
    <n-layout>
      <AppHeader />
      <AppContent />
      <!-- <AppFooter /> -->
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.h-screen {
  width: 100vw;
  height: 100vh;
}
</style>
