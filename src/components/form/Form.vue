<script lang="ts" setup>
import type { FormRules } from 'naive-ui'

interface Prop {
  formItems: {
    fieldName: 'input' | string
    component: string
    label: string
    componentProps?: Record<string, string>
    rules?: FormRules
  }[]
}

const props = defineProps<Prop>()
</script>

<template>
  <div class="w-full h-full">
    <n-form>
      <template v-for="item in props.formItems" :key="item.fieldName">
        <!-- 输入框 -->
        <n-form-item :label="item.label" :name="item.fieldName" v-if="item.component === 'input'">
          <n-input />
        </n-form-item>
      </template>
    </n-form>
  </div>
</template>

<style lang="scss" scoped></style>
