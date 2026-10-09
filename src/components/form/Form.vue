<script lang="ts" setup>
import { computed } from 'vue'
import type { ProRecord } from '../pro/types/field'
import type { ProFormField } from '../pro/types/form'
import ProForm from '../pro/components/ProForm.vue'

/**
 * 旧版配置化表单壳（兼容适配层）
 *
 * @deprecated 请直接使用 `ProForm`（`import { ProForm } from '@/components/pro'`）。
 * 本组件仅为兼容既有的 `<Form :formItems="..." />` 用法而保留，
 * 内部已改为渲染 `ProForm`，不再单独维护渲染逻辑。
 */
// 组件名刻意不使用 'Form'（HTML 保留标签名，会触发 lint 规则）；
// 模板中的 `<Form>` 标签由 unplugin-vue-components 依据文件名解析，与此处命名无关。
defineOptions({ name: 'LegacyForm', inheritAttrs: false })

/** 旧版字段配置项 */
interface LegacyFormItem {
  /** 字段名 */
  fieldName: string
  /** 组件类型 */
  component?: string
  /** 标签 */
  label?: string
}

const props = withDefaults(
  defineProps<{
    /** 旧版字段配置数组 */
    formItems?: LegacyFormItem[]
    /** 表单模型 */
    modelValue?: ProRecord
    /** 每行列数 */
    cols?: number
  }>(),
  {
    formItems: () => [],
    modelValue: undefined,
    cols: 1,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', values: ProRecord): void
}>()

/** 将旧版 formItems 映射为 ProForm 所需的 schema */
const schema = computed<ProFormField[]>(() =>
  props.formItems.map((item) => ({
    fieldName: item.fieldName,
    label: item.label,
    component: item.component ?? 'input',
  })),
)

/** 模型更新：向外透传 */
const handleModelUpdate = (values: ProRecord): void => {
  emit('update:modelValue', values)
}
</script>

<template>
  <ProForm
    :schema="schema"
    :model-value="modelValue"
    :layout="{ cols }"
    v-bind="$attrs"
    @update:model-value="handleModelUpdate"
  />
</template>

<style lang="scss" scoped></style>
