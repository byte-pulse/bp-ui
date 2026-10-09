<script lang="ts" setup>
import { computed, ref } from 'vue'
import type {
  ProFormActions,
  ProFormField,
  ProFormInstance,
  ProFormLayout,
  ProFormModalInstance,
  ProRecord,
} from '../types'
import ProForm from './ProForm.vue'

/**
 * 弹窗表单预设组件
 *
 * 内聚「新增 / 编辑」弹窗的全部通用流程：
 * 打开（回填或置空）→ 校验 → 异步提交 → 成功提示 → 关闭 → 通知外部。
 * 业务侧只需声明 `schema`（字段配置）与 `submit`（提交函数），
 * 无需重复编写弹窗控制、校验编排与提交反馈逻辑。
 *
 * @example
 * ```vue
 * <ProFormModal ref="modalRef" :schema="userFormSchema" :submit="saveUser" @success="tableRef?.refresh()" />
 * ```
 */
defineOptions({ name: 'ProFormModal' })

/** 弹窗表单记录（行数据） */
type ProFormModalRecord = ProRecord

const props = withDefaults(
  defineProps<{
    /** 字段配置数组 */
    schema: ProFormField[]
    /**
     * 提交处理函数
     *
     * 校验通过后调用，返回 Promise 以驱动确认按钮的 loading 态；
     * 未提供时仅向外抛出 `success` 事件，由业务侧自行提交。
     *
     * @param values 表单值
     * @param record 编辑态下的原始行数据（新增态为 undefined）
     */
    submit?: (values: ProFormModalRecord, record?: ProFormModalRecord) => Promise<unknown>
    /** 弹窗标题；提供后新增 / 编辑统一使用该标题 */
    title?: string
    /** 新增态标题，默认「新增」 */
    addTitle?: string
    /** 编辑态标题，默认「编辑」 */
    editTitle?: string
    /** 弹窗宽度，默认 560 */
    width?: number | string
    /** 表单布局配置 */
    layout?: ProFormLayout
    /** 表单操作区配置；弹窗默认使用底部按钮，故默认不渲染操作区 */
    actions?: ProFormActions
    /** 记录唯一标识字段，用于判定新增 / 编辑，默认 id */
    recordKey?: string
    /** 新增态的初始值 */
    initialValues?: ProFormModalRecord
    /** 提交成功提示文案；传空字符串则不提示 */
    successMessage?: string
    /** 提交成功后是否自动关闭，默认 true */
    closeOnSuccess?: boolean
    /** 点击遮罩是否关闭，默认 false（避免误关闭导致数据丢失） */
    maskClosable?: boolean
    /** 透传给 `a-modal` 的额外属性 */
    modalProps?: Record<string, unknown>
  }>(),
  {
    submit: undefined,
    title: undefined,
    addTitle: '新增',
    editTitle: '编辑',
    width: 560,
    layout: () => ({ layout: 'vertical', cols: 1 }),
    actions: () => ({ show: false }),
    recordKey: 'id',
    initialValues: undefined,
    successMessage: '操作成功',
    closeOnSuccess: true,
    maskClosable: false,
    modalProps: () => ({}),
  },
)

const emit = defineEmits<{
  /** 提交成功 */
  (e: 'success', values: ProFormModalRecord, record?: ProFormModalRecord): void
  /** 弹窗已关闭 */
  (e: 'close'): void
}>()

/** 弹窗显隐 */
const visible = ref(false)
/** 当前操作的行数据：为空表示新增，非空表示编辑 */
const record = ref<ProFormModalRecord>()
/** 表单挂载序号：每次打开自增，强制重挂载以重新初始化表单模型 */
const formKey = ref(0)
/** 表单实例 */
const formRef = ref<ProFormInstance>()

/** 是否为编辑态 */
const isEdit = computed(() => record.value != null && record.value[props.recordKey] != null)

/** 弹窗标题 */
const titleText = computed(() => props.title ?? (isEdit.value ? props.editTitle : props.addTitle))

/**
 * 表单初始值
 *
 * 编辑态以行数据回填并覆盖公共初始值，新增态仅使用 `initialValues`。
 */
const initialValues = computed<ProFormModalRecord>(() => ({
  ...props.initialValues,
  ...record.value,
}))

/**
 * 打开弹窗
 *
 * @param target 行数据；不传为新增，传入为编辑
 */
const open = (target?: ProFormModalRecord): void => {
  record.value = target ? { ...target } : undefined
  // 自增 key 触发 ProForm 重新挂载，保证初始值被完整应用
  formKey.value += 1
  visible.value = true
}

/** 关闭弹窗 */
const close = (): void => {
  visible.value = false
}

/**
 * 确认前钩子
 *
 * 返回 Promise 时 Arco 会自动为确认按钮开启 loading；
 * 仅返回 true 才会关闭弹窗，校验失败或提交异常时保持打开。
 */
const handleBeforeOk = async (): Promise<boolean> => {
  const currentForm = formRef.value
  if (!currentForm) {
    return true
  }

  // 1. 校验：不通过则保持弹窗打开，等待用户修正
  const valid = await currentForm.validate()
  if (!valid) {
    return false
  }

  const values = currentForm.getValues()

  // 2. 提交：异常由 http 层统一提示，此处仅保持弹窗打开
  try {
    await props.submit?.(values, record.value)
  } catch {
    return false
  }

  // 3. 成功：提示 + 抛出事件 + 视配置关闭
  if (props.successMessage) {
    $message.success(props.successMessage)
  }
  emit('success', values, record.value)
  return props.closeOnSuccess
}

/** 弹窗关闭后清理现场，避免下次打开残留上一次的数据 */
const handleClose = (): void => {
  record.value = undefined
  emit('close')
}

defineExpose<ProFormModalInstance>({
  open,
  close,
})
</script>

<template>
  <a-modal
    v-bind="modalProps"
    v-model:visible="visible"
    :title="titleText"
    :width="width"
    :mask-closable="maskClosable"
    :unmount-on-close="true"
    :on-before-ok="handleBeforeOk"
    @close="handleClose"
  >
    <ProForm
      :key="formKey"
      ref="formRef"
      :schema="schema"
      :layout="layout"
      :actions="actions"
      :initial-values="initialValues"
    />
  </a-modal>
</template>

<style lang="scss" scoped></style>
