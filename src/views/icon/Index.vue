<template>
  <div class="icon-container">
    <IconPickerButton @select="handleSelect" v-model="icon"></IconPickerButton>
  </div>
</template>

<script lang="ts" setup>
const icon = ref('ionicons5/AirplaneOutline')

const handleSelect = (value: string) => {
  $message.info(value)
}
</script>

<style lang="scss" scoped></style>
