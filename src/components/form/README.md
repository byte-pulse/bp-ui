# IForm / IFormField 配置化表单

通过一份配置对象（`FormConfig`）描述整个表单：字段控件类型、校验规则、分组、多列栅格全部由配置驱动，无需手写 `a-form-item`。

## 目录

- [特性](#特性)
- [快速开始](#快速开始)
- [IForm Props](#iform-props)
- [FormConfig 配置](#formconfig-配置)
- [FormGroup 分组](#formgroup-分组)
- [FormField 字段](#formfield-字段)
- [支持的控件类型](#支持的控件类型)
- [栅格与响应式](#栅格与响应式)
- [插槽](#插槽)
- [实例方法](#实例方法)
- [IFormField 单独使用](#iformfield-单独使用)
- [行为说明](#行为说明)

## 特性

- **配置驱动**：字段、校验、选项、默认值统一写在配置里
- **分组 + 多列**：按分组组织字段，支持全局 / 分组级列数切换
- **13 种控件**：输入、选择、日期、开关、评分等开箱即用
- **响应式栅格**：小屏自动单列，大屏按列数均分
- **完整表单能力**：校验、重置、取值、清除校验状态

## 快速开始

`IForm` / `IFormField` 已通过 `unplugin-vue-components` 全局自动注册（扫描 `src/components/**`），模板中直接使用 `<IForm>` 即可，**无需 import**。类型需从 `@/components/form/types` 显式引入。

```vue
<script lang="ts" setup>
import type { FormConfig, FormExpose } from '@/components/form/types'

const formRef = ref<FormExpose>()
const model = ref<Record<string, unknown>>({})

const config: FormConfig = {
  columns: 2,
  layout: 'horizontal',
  groups: [
    {
      title: '基本信息',
      fields: [
        {
          field: 'name',
          label: '姓名',
          type: 'input',
          rules: [{ required: true, message: '请输入姓名' }],
        },
        {
          field: 'level',
          label: '等级',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: '普通', value: 'normal' },
            { label: '高级', value: 'senior' },
          ],
        },
      ],
    },
  ],
}

const submit = async () => {
  if (await formRef.value?.validate()) {
    console.log('表单数据：', formRef.value?.getValues())
  }
}
</script>

<template>
  <IForm ref="formRef" v-model="model" :config="config">
    <template #footer>
      <a-button type="primary" @click="submit">提交</a-button>
      <a-button @click="formRef?.reset()">重置</a-button>
    </template>
  </IForm>
</template>
```

## IForm Props

| 属性      | 类型                      | 默认值 | 说明                              |
| --------- | ------------------------- | ------ | --------------------------------- |
| `config`  | `FormConfig`              | —      | **必填**，表单配置对象            |
| `v-model` | `Record<string, unknown>` | `{}`   | 表单数据，字段值以 `field` 为 key |

## FormConfig 配置

| 字段         | 类型                                       | 默认值       | 说明                    |
| ------------ | ------------------------------------------ | ------------ | ----------------------- |
| `groups`     | `FormGroup[]`                              | —            | **必填**，分组集合      |
| `columns`    | `number`                                   | `1`          | 全局列数（1 / 2 / 3 …） |
| `layout`     | `'vertical' \| 'horizontal'`               | `'vertical'` | 标签布局                |
| `labelAlign` | `'left' \| 'right'`                        | `'right'`    | 标签对齐方式            |
| `size`       | `'mini' \| 'small' \| 'medium' \| 'large'` | `'medium'`   | 控件尺寸                |

> `layout` 为 `horizontal` 时，组件会自动开启标签宽度自适应（`auto-label-width`）。

## FormGroup 分组

| 字段      | 类型          | 说明                                 |
| --------- | ------------- | ------------------------------------ |
| `title`   | `string`      | 分组标题，填写后在分组上方渲染分割线 |
| `columns` | `number`      | 分组列数，**覆盖**全局 `columns`     |
| `fields`  | `FormField[]` | **必填**，分组内的字段集合           |

## FormField 字段

| 字段           | 类型                       | 说明                                                          |
| -------------- | -------------------------- | ------------------------------------------------------------- |
| `field`        | `string`                   | **必填**，字段名，对应表单数据的 key                          |
| `label`        | `string`                   | **必填**，标签文本                                            |
| `type`         | `FormFieldType`            | **必填**，控件类型                                            |
| `placeholder`  | `string`                   | 占位提示，不填时自动生成（见[行为说明](#行为说明)）           |
| `span`         | `number`                   | 栅格占位（24 栅格制），设置后优先于列数计算，可让字段独占一行 |
| `defaultValue` | `unknown`                  | 默认值，初始化时写入表单数据                                  |
| `options`      | `FormFieldOption[]`        | 选项，`select` / `radio` / `checkbox` 使用                    |
| `rules`        | `FieldRule \| FieldRule[]` | 校验规则，支持单条或多条                                      |
| `disabled`     | `boolean`                  | 是否禁用                                                      |
| `hidden`       | `boolean`                  | 是否隐藏（不渲染，但字段值仍保留在表单数据中）                |
| `tooltip`      | `string`                   | 标签旁的提示文案                                              |
| `props`        | `Record<string, unknown>`  | 透传给底层控件的额外属性，如 `{ maxLength: 20 }`              |

`FormFieldOption`：

| 字段       | 类型                          | 说明     |
| ---------- | ----------------------------- | -------- |
| `label`    | `string`                      | 选项文本 |
| `value`    | `string \| number \| boolean` | 选项值   |
| `disabled` | `boolean`                     | 是否禁用 |

## 支持的控件类型

| `type`       | 底层组件           | 值类型                            |
| ------------ | ------------------ | --------------------------------- |
| `input`      | `a-input`          | `string`                          |
| `password`   | `a-input-password` | `string`                          |
| `textarea`   | `a-textarea`       | `string`                          |
| `number`     | `a-input-number`   | `number`                          |
| `select`     | `a-select`         | `string \| number \| boolean`     |
| `radio`      | `a-radio-group`    | `string \| number \| boolean`     |
| `checkbox`   | `a-checkbox-group` | `(string \| number \| boolean)[]` |
| `switch`     | `a-switch`         | `string \| number \| boolean`     |
| `date`       | `a-date-picker`    | `string \| number \| Date`        |
| `date-range` | `a-range-picker`   | `(string \| number \| Date)[]`    |
| `time`       | `a-time-picker`    | `string \| number \| Date`        |
| `slider`     | `a-slider`         | `number \| [number, number]`      |
| `rate`       | `a-rate`           | `number`                          |

> `input` / `password` / `textarea` / `select` 默认开启 `allow-clear`；`textarea` 默认 `auto-size="{ minRows: 3, maxRows: 5 }"`。

## 栅格与响应式

- 每个字段基于 24 栅格布局，占位计算规则：**字段 `span` > 按列数均分**（`Math.floor(24 / columns)`）。
- 小屏（`xs`）固定为 24（单列占满），`md` 及以上才按列数均分，移动端始终单列。
- 需要某个字段独占一行时，设置 `span: 24`。

## 插槽

| 插槽名   | 说明                                                       |
| -------- | ---------------------------------------------------------- |
| `footer` | 表单底部操作区，提供该插槽时在表单下方渲染操作按钮所在容器 |

## 实例方法

通过 `ref` 获取组件实例（类型 `FormExpose`）：

```ts
const formRef = ref<FormExpose>()

await formRef.value?.validate() // 校验表单，返回是否通过
formRef.value?.reset() // 重置为初始值
formRef.value?.clearValidate() // 仅清除校验状态
formRef.value?.getValues() // 获取表单数据副本
```

| 方法            | 类型                            | 说明                       |
| --------------- | ------------------------------- | -------------------------- |
| `validate`      | `() => Promise<boolean>`        | 校验表单，返回是否通过     |
| `reset`         | `() => void`                    | 重置为初始值               |
| `clearValidate` | `() => void`                    | 清除校验状态（不清空数据） |
| `getValues`     | `() => Record<string, unknown>` | 获取当前表单数据副本       |

## IFormField 单独使用

`IFormField` 可脱离 `IForm` 单独使用，用于自定义布局场景（如表格头部搜索区）。它内部自带 `a-form-item`，需包裹在 `a-form` 中才能获得校验能力。

```vue
<a-form :model="model">
  <IFormField v-model="model.dept" :item="{ field: 'dept', label: '部门', type: 'select', options }" />
</a-form>
```

| 属性      | 类型        | 说明               |
| --------- | ----------- | ------------------ |
| `item`    | `FormField` | **必填**，字段配置 |
| `v-model` | `unknown`   | 字段值双向绑定     |

## 行为说明

- **默认值初始化**：`applyDefaults` 在组件初始化时执行，仅当表单数据中该字段为 `undefined` 且配置了 `defaultValue` 时才写入。
- **占位提示自动生成**：未配置 `placeholder` 时，`select` / `date` / `date-range` / `time` 生成「请选择{label}」，其余生成「请输入{label}」。
- **隐藏字段**：`hidden: true` 的字段不渲染，但其值仍保留在表单数据中（适合用于提交但不需要用户编辑的字段）。
- **校验传递**：`rules` 与 `tooltip` 直接透传给 `a-form-item`，校验规则写法与 Arco `FieldRule` 一致。
