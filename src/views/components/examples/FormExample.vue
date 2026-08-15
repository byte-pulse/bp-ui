<script lang="ts" setup>
const formItems = [
  {
    fieldName: 'name',
    component: 'input',
    label: '姓名',
  },
  {
    fieldName: 'age',
    component: 'input',
    label: '年龄',
  },
]
</script>

<template>
  <div class="w-full h-full">
    <Form :formItems="formItems" />
  </div>
</template>

<style lang="scss" scoped></style>
