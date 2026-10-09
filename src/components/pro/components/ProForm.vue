<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'
import type { FormInstance } from '@arco-design/web-vue'
import type { ProFormActions, ProFormField, ProFormInstance, ProFormLayout, ProRecord } from '../types'
import { resolveDynamic } from '../utils/resolve'
import ProFormItem from './ProFormItem.vue'

/**
 * 配置化表单组件
 *
 * 业务侧只需声明 `schema`（字段配置数组），组件负责栅格布局、控件渲染、
 * 校验、操作区与双向绑定，页面不再堆叠 `a-form-item` 模板。
 */
defineOptions({ name: 'ProForm' })

const props = withDefaults(
  defineProps<{
    /** 字段配置数组 */
    schema: ProFormField[]
    /** 布局配置 */
    layout?: ProFormLayout
    /** 操作区配置 */
    actions?: ProFormActions
    /** 初始值 */
    initialValues?: ProRecord
    /** 提交按钮 loading 态 */
    loading?: boolean
    /** 整体禁用 */
    disabled?: boolean
    /** 受控模型；不传则由组件内部维护 */
    modelValue?: ProRecord
  }>(),
  {
    layout: () => ({ layout: 'vertical', cols: 1 }),
    actions: () => ({ show: true }),
    loading: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', values: ProRecord): void
  (e: 'submit', values: ProRecord): void
  (e: 'reset'): void
  (e: 'change', fieldName: string, value: unknown, values: ProRecord): void
  (e: 'valuesChange', values: ProRecord): void
}>()

const slots = useSlots()
const formRef = ref<FormInstance>()

/**
 * 构建初始模型
 *
 * 以 `initialValues` 为基础，补齐 schema 中声明了 `defaultValue` 且未被赋值过的字段。
 */
const buildInitialModel = (): ProRecord => {
  const values: ProRecord = { ...props.initialValues }
  props.schema.forEach((field) => {
    if (field.fieldName in values) {
      return
    }
    if (field.defaultValue !== undefined) {
      values[field.fieldName] = field.defaultValue
    }
  })
  return values
}

/** 内部模型（非受控模式使用） */
const innerModel = ref<ProRecord>(buildInitialModel())

/** 是否受控：外部传入 modelValue 即视为受控 */
const isControlled = computed(() => props.modelValue !== undefined)

/** 当前表单模型 */
const model = computed<ProRecord>(() => props.modelValue ?? innerModel.value)

/** 布局配置 */
const layoutConfig = computed<ProFormLayout>(() => props.layout)

/** 操作区配置（补齐默认值） */
const actionsConfig = computed(() => ({
  show: true,
  showSubmit: true,
  showReset: true,
  submitText: '提交',
  resetText: '重置',
  align: 'right' as const,
  ...props.actions,
}))

/** 操作区对齐样式 */
const actionsAlignClass = computed(() => {
  switch (actionsConfig.value.align) {
    case 'left':
      return 'w-full justify-start'
    case 'center':
      return 'w-full justify-center'
    default:
      return 'w-full justify-end'
  }
})

/**
 * 参与渲染的字段列表
 *
 * 过滤掉 `hidden` 为真的字段，并按 `cols` 换算栅格占比。
 */
const visibleFields = computed(() =>
  props.schema
    .filter((field) => !resolveDynamic(field.hidden, model.value))
    .map((field) => ({
      field,
      span: field.span ?? Math.floor(24 / (layoutConfig.value.cols ?? 1)),
    })),
)

/**
 * 写入字段值
 *
 * 受控模式下发 `update:modelValue`，非受控模式下更新内部模型。
 */
const setFieldValue = (fieldName: string, value: unknown): void => {
  const nextValues = { ...model.value, [fieldName]: value }
  if (isControlled.value) {
    emit('update:modelValue', nextValues)
  } else {
    innerModel.value = nextValues
  }
  emit('change', fieldName, value, nextValues)
  emit('valuesChange', nextValues)
}

/** 校验全部字段 */
const validate = async (): Promise<boolean> => {
  if (!formRef.value) {
    return true
  }
  const errors = await formRef.value.validate()
  return !errors
}

/** 校验指定字段 */
const validateField = async (field: string | string[]): Promise<boolean> => {
  if (!formRef.value) {
    return true
  }
  const errors = await formRef.value.validateField(field)
  return !errors
}

/** 重置字段；非受控模式下同步还原初始模型 */
const resetFields = (fields?: string | string[]): void => {
  formRef.value?.resetFields(fields)
  if (fields) {
    return
  }
  const initialValues = buildInitialModel()
  if (isControlled.value) {
    emit('update:modelValue', initialValues)
  } else {
    innerModel.value = initialValues
  }
}

/** 清除校验状态 */
const clearValidate = (fields?: string | string[]): void => {
  formRef.value?.clearValidate(fields)
}

/** 批量设置字段值 */
const setValues = (values: Partial<ProRecord>): void => {
  const nextValues = { ...model.value, ...values }
  if (isControlled.value) {
    emit('update:modelValue', nextValues)
  } else {
    innerModel.value = nextValues
  }
  emit('valuesChange', nextValues)
}

/** 获取当前表单值 */
const getValues = (): ProRecord => model.value

/** 滚动到指定字段 */
const scrollToField = (field: string): void => {
  formRef.value?.scrollToField(field)
}

/** 提交：先校验，通过后向外抛 submit */
const handleSubmit = async (): Promise<void> => {
  const valid = await validate()
  if (!valid) {
    return
  }
  emit('submit', model.value)
}

/** 重置：先重置字段与模型，再向外抛 reset */
const handleReset = (): void => {
  resetFields()
  emit('reset')
}

defineExpose<ProFormInstance>({
  // 以 getter 形式暴露，保证外部始终拿到最新的 Arco 表单实例
  get formRef() {
    return formRef.value
  },
  validate,
  validateField,
  resetFields,
  clearValidate,
  setFieldValue,
  setValues,
  getValues,
  scrollToField,
})
</script>

<template>
  <a-form
    ref="formRef"
    :model="model"
    :layout="layoutConfig.layout ?? 'vertical'"
    :label-align="layoutConfig.labelAlign ?? 'left'"
    :label-col-props="layoutConfig.labelColProps"
    :wrapper-col-props="layoutConfig.wrapperColProps"
    :disabled="disabled"
  >
    <a-row :gutter="layoutConfig.rowGap ?? 16">
      <!-- 字段区域 -->
      <a-col v-for="item in visibleFields" :key="item.field.fieldName" :span="item.span" v-bind="item.field.colProps">
        <a-form-item
          :field="item.field.fieldName"
          :label="item.field.label"
          :tooltip="item.field.tooltip"
          :rules="item.field.rules"
        >
          <ProFormItem
            :field="item.field"
            :model="model"
            :parent-slots="slots"
            :disabled="disabled"
            @change="setFieldValue"
          />
        </a-form-item>
      </a-col>

      <!-- 操作区 -->
      <a-col v-if="actionsConfig.show" :span="24">
        <a-form-item :hide-label="true">
          <slot name="actions" :submit="handleSubmit" :reset="handleReset">
            <a-space :size="12" :class="actionsAlignClass">
              <a-button v-if="actionsConfig.showReset" @click="handleReset">
                {{ actionsConfig.resetText }}
              </a-button>
              <a-button v-if="actionsConfig.showSubmit" type="primary" :loading="loading" @click="handleSubmit">
                {{ actionsConfig.submitText }}
              </a-button>
            </a-space>
          </slot>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style lang="scss" scoped></style>
