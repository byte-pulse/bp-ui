import { ref } from 'vue'
import { Modal } from '@arco-design/web-vue'
import type { ProTableInstance } from '../types/instance'
import type { ProTableRecord, ProTableRequestParams } from '../types/table'

/** useProTable 配置项 */
export interface UseProTableOptions {
  /** 数据变化后的回调（如删除成功后刷新统计等） */
  onSuccess?: () => void
}

/** 删除确认文案配置 */
export interface DeleteConfirmOptions {
  /** 确认框标题 */
  title?: string
  /** 确认框内容 */
  content?: string
}

/**
 * 表格流程编排钩子
 *
 * 只做通用流程编排（刷新、重置、二次确认删除），不参与渲染，
 * `ProTable` 组件单独使用也完整可用。
 */
export function useProTable(options: UseProTableOptions = {}) {
  /** ProTable 实例引用，模板中通过 ref 绑定 */
  const tableRef = ref<ProTableInstance>()
  /** 常驻查询参数，`reload` 时会与临时参数合并 */
  const params = ref<Partial<ProTableRequestParams>>({})

  /** 保持页码刷新 */
  const refresh = (): Promise<void> | undefined => tableRef.value?.refresh()

  /** 附加参数并回到第一页重新加载 */
  const reload = (extra?: Partial<ProTableRequestParams>): Promise<void> | undefined =>
    tableRef.value?.reload({ ...params.value, ...extra })

  /** 重置搜索条件 */
  const reset = (): Promise<void> | undefined => tableRef.value?.reset()

  /** 获取选中行 */
  const getSelectedRows = (): ProTableRecord[] => tableRef.value?.getSelectedRows() ?? []

  /** 清空选中 */
  const clearSelection = (): void => tableRef.value?.clearSelection()

  /**
   * 通用删除：二次确认 -> 执行删除 -> 提示 -> 刷新表格
   *
   * @param record  当前行数据
   * @param handler 业务删除请求，入参为当前行数据
   * @param confirm 确认框文案配置
   */
  const handleDelete = (
    record: ProTableRecord,
    handler: (record: ProTableRecord) => Promise<unknown>,
    confirm?: DeleteConfirmOptions,
  ): void => {
    Modal.confirm({
      title: confirm?.title ?? '删除确认',
      content: confirm?.content ?? '确定要删除该条数据吗？删除后不可恢复。',
      okButtonProps: { status: 'danger' },
      onOk: async () => {
        await handler(record)
        $message.success('删除成功')
        await refresh()
        options.onSuccess?.()
      },
    })
  }

  return {
    tableRef,
    params,
    refresh,
    reload,
    reset,
    getSelectedRows,
    clearSelection,
    handleDelete,
  }
}
