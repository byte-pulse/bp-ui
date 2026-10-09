import { ref } from 'vue'
import type { ProRecord } from '../types/field'
import type { ProFormInstance } from '../types/instance'

/** useProForm 配置项 */
export interface UseProFormOptions {
  /** 提交成功后是否需要重置表单 */
  resetOnSuccess?: boolean
}

/**
 * 表单流程编排钩子
 *
 * 只负责状态与流程编排（提交 pending、校验、提交、重置），
 * 不参与任何渲染，组件本身单独使用也完整可用。
 *
 * @param options 配置项
 */
export function useProForm<T extends ProRecord = ProRecord>(options: UseProFormOptions = {}) {
  /** ProForm 实例引用，模板中通过 ref 绑定 */
  const formRef = ref<ProFormInstance<T>>()
  /** 提交中状态 */
  const submitting = ref(false)

  /** 获取当前表单值 */
  const getValues = (): T | undefined => formRef.value?.getValues()

  /** 校验表单 */
  const validate = async (): Promise<boolean> => {
    if (!formRef.value) {
      return true
    }
    return formRef.value.validate()
  }

  /**
   * 校验并提交
   *
   * @param handler 业务提交逻辑，入参为当前表单值
   */
  const submit = async (handler: (values: T) => Promise<unknown> | unknown): Promise<void> => {
    if (!formRef.value) {
      return
    }
    const valid = await formRef.value.validate()
    if (!valid) {
      return
    }
    submitting.value = true
    try {
      await handler(formRef.value.getValues())
      if (options.resetOnSuccess) {
        formRef.value.resetFields()
      }
    } finally {
      submitting.value = false
    }
  }

  /** 重置表单 */
  const reset = (): void => {
    formRef.value?.resetFields()
  }

  return {
    formRef,
    submitting,
    getValues,
    validate,
    submit,
    reset,
  }
}
