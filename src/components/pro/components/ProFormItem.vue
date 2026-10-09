<script lang="ts" setup>
import { computed } from 'vue'
import type { VNodeChild } from 'vue'
import type { ProRecord } from '../types/field'
import type { ProFormField } from '../types/form'
import { getField } from '../registry/componentMap'
import { installDefaultFields } from '../registry/defaultFields'
import { normalizeValueEnum, resolveDynamic } from '../utils/resolve'
import ProFieldInput from './fields/ProFieldInput.vue'

/**
 * 单个表单字段的控件渲染器
 *
 * 只负责「控件」的渲染与取值，标签 / 校验 / 栅格由外层 `ProForm` 统一处理。
 *
 * 渲染优先级：
 * 1. `field.render` —— 完全自定义渲染
 * 2. `field.slot`   —— 父组件提供的具名插槽
 * 3. 注册表组件     —— 依据 `field.component` 查注册表
 * 4. 兜底           —— 默认单行文本输入
 */
defineOptions({ name: 'ProFormItem' })

// 确保内置字段组件已注册（幂等）
installDefaultFields()

const props = defineProps<{
  /** 字段配置 */
  field: ProFormField
  /** 当前表单值（用于联动计算与取值） */
  model: ProRecord
  /** 父组件透传的插槽集合 */
  parentSlots: ProRecord
  /** 表单级禁用态 */
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'change', fieldName: string, value: unknown): void
}>()

/** 是否为自定义渲染（render 或 slot） */
const isCustomRender = computed(
  () => Boolean(props.field.render) || Boolean(props.field.slot && props.parentSlots[props.field.slot]),
)

/** 解析需要渲染的字段组件（注册表优先，兜底单行文本） */
const resolvedComponent = computed(() => getField(props.field.component) ?? ProFieldInput)

/** 联动解析后的禁用态 */
const resolvedDisabled = computed(() => resolveDynamic(props.field.disabled, props.model) ?? props.disabled)

/**
 * 联动解析后的选项列表（select / radio / checkbox 使用）
 *
 * 优先取 `field.options`（支持函数联动），未声明时回退到 `field.valueEnum` 归一结果，
 * 使业务侧仅声明字典即可完成下拉 / 单选的渲染。
 */
const resolvedOptions = computed(() => {
  const dynamicOptions = resolveDynamic(props.field.options, props.model)
  if (dynamicOptions?.length) {
    return dynamicOptions
  }
  return normalizeValueEnum(props.field.valueEnum)
})

/** 联动解析后的组件属性（透传给字段组件） */
const resolvedProps = computed(() => resolveDynamic(props.field.componentProps, props.model) ?? {})

/** 当前字段值 */
const currentValue = computed(() => props.model[props.field.fieldName])

/** 执行自定义渲染（render 优先，其次 slot） */
const renderCustom = (): VNodeChild => {
  if (props.field.render) {
    return props.field.render({
      record: props.model,
      value: currentValue.value,
      index: -1,
      field: props.field,
    })
  }
  return props.parentSlots[props.field.slot as string]({
    record: props.model,
    value: currentValue.value,
    field: props.field,
  })
}

/** 值变更：向上抛给 ProForm 维护模型 */
const handleChange = (value: unknown) => {
  emit('change', props.field.fieldName, value)
}
</script>

<template>
  <!-- 自定义渲染 -->
  <component :is="() => renderCustom()" v-if="isCustomRender" />
  <!-- 注册表组件 -->
  <component
    v-else
    :is="resolvedComponent"
    :model-value="currentValue"
    :placeholder="field.placeholder"
    :options="resolvedOptions"
    :disabled="resolvedDisabled"
    v-bind="resolvedProps"
    @update:model-value="handleChange"
  />
</template>

<style lang="scss" scoped></style>
