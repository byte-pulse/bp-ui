<script lang="ts" setup>
import { useProForm } from '@/components/pro'
import { baseSchema, customRenderSchema, fieldTypeSchema, linkageSchema, readonlyValues } from './schema'

/**
 * 表单组件能力展示
 *
 * 页面只承担「编排」职责：把 ./schema.ts 中按能力拆分好的字段配置拼装成若干卡片，
 * 字段本身、校验规则、联动逻辑、渲染方式全部由 schema 声明驱动，页面不出现任何控件模板。
 *
 * 能力总览：
 * 1. 基础表单     —— 两列栅格、校验规则、字典下拉 / 单选、整行文本域、提交 loading；
 * 2. 字段类型全览 —— 覆盖注册表内置控件；
 * 3. 字段联动     —— hidden / options / disabled 三种函数形态联动；
 * 4. 自定义渲染   —— render 函数式渲染与 slot 插槽渲染；
 * 5. 只读态       —— 整体禁用，用于详情页只读展示。
 */

/**
 * 基础表单流程编排
 *
 * - `baseFormRef`：绑定 ProForm 实例，可调用外部 API（validate / getValues / resetFields 等）；
 * - `baseSubmitting`：提交 pending 态，直接驱动提交按钮 loading；
 * - `submitBaseForm`：统一编排「校验 → pending → 异步提交」。
 */
const { formRef: baseFormRef, submitting: baseSubmitting, submit: submitBaseForm } = useProForm()

/**
 * 模拟异步提交耗时
 *
 * @param duration 延时毫秒数
 */
const delay = (duration = 800): Promise<void> => new Promise((resolve) => setTimeout(resolve, duration))

/**
 * 基础表单提交
 *
 * `@submit` 触发时 ProForm 已完成一轮校验，此处直接复用 useProForm 的提交编排，
 * 保证「校验 → loading → 异步提交」链路的单一实现。
 */
const handleBaseSubmit = (): void => {
  submitBaseForm(async (values) => {
    await delay()
    $message.success(`提交成功：${String(values.username ?? '未知用户')}`)
  })
}
</script>

<template>
  <div>
    <!-- 一、基础表单 -->
    <a-card class="mb-4" title="基础表单">
      <template #extra>
        <span class="text-xs text-(--color-text-3)">两列栅格 · 必填 / 长度 / 格式校验 · 提交流程编排</span>
      </template>
      <ProForm
        ref="baseFormRef"
        :schema="baseSchema"
        :layout="{ cols: 2 }"
        :loading="baseSubmitting"
        @submit="handleBaseSubmit"
      />
    </a-card>

    <!-- 二、字段类型全览 -->
    <a-card class="mb-4" title="字段类型全览">
      <template #extra>
        <span class="text-xs text-(--color-text-3)">注册表内置控件 · 声明 component 即可渲染</span>
      </template>
      <ProForm :schema="fieldTypeSchema" :layout="{ cols: 3 }" :actions="{ show: false }" />
    </a-card>

    <!-- 三、字段联动 -->
    <a-card class="mb-4" title="字段联动">
      <template #extra>
        <span class="text-xs text-(--color-text-3)">切换「用户类型」「所在省份」观察联动效果</span>
      </template>
      <ProForm :schema="linkageSchema" :layout="{ cols: 2 }" :actions="{ show: false }" />
    </a-card>

    <!-- 四、自定义渲染 -->
    <a-card class="mb-4" title="自定义渲染">
      <template #extra>
        <span class="text-xs text-(--color-text-3)">render 函数式渲染 · slot 插槽渲染</span>
      </template>
      <ProForm :schema="customRenderSchema" :layout="{ cols: 2 }" :actions="{ show: false }">
        <!-- 插槽作用域：{ record, value, field } -->
        <template #openTip="{ record }">
          <a-tag v-if="record.userType === 'enterprise'" color="gold">企业通道 · 优先开通</a-tag>
          <a-tag v-else color="arcoblue">个人通道 · 即时开通</a-tag>
        </template>
      </ProForm>
    </a-card>

    <!-- 五、只读态 -->
    <a-card title="只读态">
      <template #extra>
        <span class="text-xs text-(--color-text-3)">整体禁用 · 常用于详情页只读展示</span>
      </template>
      <ProForm
        :schema="baseSchema"
        :layout="{ cols: 2 }"
        :initial-values="readonlyValues"
        :actions="{ show: false }"
        disabled
      />
    </a-card>
  </div>
</template>

<style lang="scss" scoped></style>
