<script lang="ts" setup></script>

<template>
  <div class="w-full bg-[rgb(var(--primary-1))] text-[rgb(var(--warning-6))]">
    数据仪表台
    <template v-for="i in 100" :key="i">
      <p>{{ i }}</p>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
