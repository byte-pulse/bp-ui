<template>
  <n-config-provider style="width: 100%; height: 100%">
    <n-theme-editor>
      <RouterView />
    </n-theme-editor>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NThemeEditor } from 'naive-ui'
</script>

<style scoped></style>
