<script lang="ts" setup>
import type { FormField, FormFieldType } from './types'

defineOptions({ name: 'BpFormField' })

const props = defineProps<{ item: FormField }>()

const value = defineModel<unknown>()

type ScalarValue = string | number | boolean
type DateValue = string | number | Date

// 按控件类型收窄的双向绑定，保证与各控件的 modelValue 类型一致
function useTypedModel<T>() {
  return computed<T | undefined>({
    get: () => value.value as T | undefined,
    set: (val) => {
      value.value = val
    },
  })
}

const textValue = useTypedModel<string>()
const numberValue = useTypedModel<number>()
const scalarValue = useTypedModel<ScalarValue>()
const arrayValue = useTypedModel<ScalarValue[]>()
const dateValue = useTypedModel<DateValue>()
const dateRangeValue = useTypedModel<DateValue[]>()
const sliderValue = useTypedModel<number | [number, number]>()

// 需要「请选择」语义的控件类型
const SELECT_TYPES: FormFieldType[] = ['select', 'date', 'date-range', 'time']

// 占位提示：优先取字段配置，否则按类型 + 标签自动生成
const placeholder = computed(() => {
  if (props.item.placeholder) return props.item.placeholder
  return SELECT_TYPES.includes(props.item.type) ? `请选择${props.item.label}` : `请输入${props.item.label}`
})
</script>

<template>
  <a-form-item
    :field="item.field"
    :label="item.label"
    :rules="item.rules"
    :tooltip="item.tooltip"
    :disabled="item.disabled"
  >
    <a-input
      v-if="item.type === 'input'"
      v-model="textValue"
      :placeholder="placeholder"
      allow-clear
      v-bind="item.props"
    />
    <a-input-password
      v-else-if="item.type === 'password'"
      v-model="textValue"
      :placeholder="placeholder"
      allow-clear
      v-bind="item.props"
    />
    <a-textarea
      v-else-if="item.type === 'textarea'"
      v-model="textValue"
      :placeholder="placeholder"
      :auto-size="{ minRows: 3, maxRows: 5 }"
      allow-clear
      v-bind="item.props"
    />
    <a-input-number
      v-else-if="item.type === 'number'"
      v-model="numberValue"
      :placeholder="placeholder"
      class="w-full"
      v-bind="item.props"
    />
    <a-select
      v-else-if="item.type === 'select'"
      v-model="scalarValue"
      :placeholder="placeholder"
      allow-clear
      v-bind="item.props"
    >
      <a-option v-for="opt in item.options" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </a-option>
    </a-select>
    <a-radio-group v-else-if="item.type === 'radio'" v-model="scalarValue" v-bind="item.props">
      <a-radio v-for="opt in item.options" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </a-radio>
    </a-radio-group>
    <a-checkbox-group v-else-if="item.type === 'checkbox'" v-model="arrayValue" v-bind="item.props">
      <a-checkbox v-for="opt in item.options" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </a-checkbox>
    </a-checkbox-group>
    <a-switch v-else-if="item.type === 'switch'" v-model="scalarValue" v-bind="item.props" />
    <a-date-picker
      v-else-if="item.type === 'date'"
      v-model="dateValue"
      :placeholder="placeholder"
      class="w-full"
      v-bind="item.props"
    />
    <a-range-picker
      v-else-if="item.type === 'date-range'"
      v-model="dateRangeValue"
      class="w-full"
      v-bind="item.props"
    />
    <a-time-picker
      v-else-if="item.type === 'time'"
      v-model="dateValue"
      :placeholder="placeholder"
      class="w-full"
      v-bind="item.props"
    />
    <a-slider v-else-if="item.type === 'slider'" v-model="sliderValue" v-bind="item.props" />
    <a-rate v-else-if="item.type === 'rate'" v-model="numberValue" v-bind="item.props" />
  </a-form-item>
</template>

<style lang="scss" scoped></style>
