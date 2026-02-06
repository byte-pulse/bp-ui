<template>
  <n-layout-header bordered class="h-16 px-4 flex items-center justify-between"> </n-layout-header>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.n-layout-header {
  background: var(--n-color);
  transition: background-color 0.3s;
  height: vv.$header-heigth !important;
  box-shadow: 0px -30px 40px #0000008c;
}
</style>
