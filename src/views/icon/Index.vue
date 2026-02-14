<template>
  <div class="icon-container">
    <IconPickerInput v-model:value="icon" preview="prefix" />
  </div>
</template>

<script lang="ts" setup>
const icon = ref('ionicons5/AirplaneOutline')
</script>

<style lang="scss" scoped></style>
