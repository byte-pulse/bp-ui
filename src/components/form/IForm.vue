<script lang="ts" setup>
import type { FormInstance } from '@arco-design/web-vue'
import type { FormConfig, FormExpose, FormField, FormGroup } from './types'

defineOptions({ name: 'BpForm' })

const props = defineProps<{ config: FormConfig }>()

// 表单数据，支持 v-model
const model = defineModel<Record<string, unknown>>({ default: () => ({}) })

const formRef = ref<FormInstance>()

// 解析分组列数：分组 > 全局 > 1
const resolveColumns = (group: FormGroup) => group.columns ?? props.config.columns ?? 1

// 解析字段栅格占位：字段自定义 > 按列数均分
const colSpan = (item: FormField, group: FormGroup) => {
  if (item.span) return item.span
  return Math.max(1, Math.floor(24 / resolveColumns(group)))
}

// 过滤掉隐藏字段
const visibleFields = (group: FormGroup) => group.fields.filter((field) => !field.hidden)

// 初始化默认值到表单数据
const applyDefaults = () => {
  props.config.groups.forEach((group) => {
    group.fields.forEach((item) => {
      if (model.value[item.field] === undefined && item.defaultValue !== undefined) {
        model.value[item.field] = item.defaultValue
      }
    })
  })
}
applyDefaults()

const validate = async (): Promise<boolean> => {
  if (!formRef.value) return true
  const errors = await formRef.value.validate().catch((err) => err)
  return !errors
}
const reset = () => formRef.value?.resetFields()
const clearValidate = () => formRef.value?.clearValidate()
const getValues = () => ({ ...model.value })

defineExpose<FormExpose>({ validate, reset, clearValidate, getValues })
</script>

<template>
  <a-form
    ref="formRef"
    :model="model"
    :layout="config.layout ?? 'vertical'"
    :label-align="config.labelAlign ?? 'right'"
    :size="config.size ?? 'medium'"
    :auto-label-width="config.layout === 'horizontal'"
    class="w-full"
  >
    <template v-for="(group, groupIndex) in config.groups" :key="groupIndex">
      <a-divider v-if="group.title" orientation="left" :margin="14">
        {{ group.title }}
      </a-divider>
      <a-row :gutter="[20, 0]">
        <a-col v-for="item in visibleFields(group)" :key="item.field" :xs="24" :md="colSpan(item, group)">
          <IFormField v-model="model[item.field]" :item="item" />
        </a-col>
      </a-row>
    </template>

    <div v-if="$slots.footer" class="mt-2 flex items-center gap-3">
      <slot name="footer" />
    </div>
  </a-form>
</template>

<style lang="scss" scoped></style>
