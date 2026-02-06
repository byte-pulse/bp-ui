<template>
  <div class="icon-container">
    <IconPicker @select="handleSelect"></IconPicker>
  </div>
</template>

<script lang="ts" setup>
const handleSelect = (value: string) => {
  $message.info(value)
}
</script>

<style lang="scss" scoped></style>
