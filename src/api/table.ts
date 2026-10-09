/** 表格列表查询条件 */
export interface TableListQuery {
  pageNum?: number
  pageSize?: number
  /** 关键字：姓名 / 邮箱 */
  keyword?: string
  /** 部门 */
  dept?: string
  /** 状态 */
  status?: string | number
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: string
  /** 选中的行主键，导出时用于只导出选中数据 */
  keys?: (string | number)[]
  [key: string]: unknown
}

/**
 * 过滤空值并把查询条件转换为 ParamsType，避免 undefined / boolean 直接进入查询串
 */
function buildParams(query: TableListQuery): Record<string, ParamsType> {
  const params: Record<string, ParamsType> = {}
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      const list = value.filter((item): item is string | number => typeof item === 'string' || typeof item === 'number')
      if (list.length) params[key] = list
    } else if (typeof value === 'boolean') {
      params[key] = String(value)
    } else if (typeof value === 'string' || typeof value === 'number') {
      params[key] = value
    }
  })
  return params
}

/** 文件名时间戳：yyyyMMddHHmmss */
const timestamp = () => {
  const pad = (value: number) => String(value).padStart(2, '0')
  const date = new Date()
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

/**
 * 获取表格列表数据
 */
export function getTableList(query: TableListQuery = {}) {
  return fetchAxios.get<PageInfo<TableRow>>('/api/table/list', buildParams(query))
}

/**
 * 导出表格数据：由后端按当前查询条件生成文件，前端接收文件流并触发浏览器下载
 */
export function exportTableList(query: TableListQuery = {}) {
  return fileAxios.fileGet<Blob>('/api/table/export', { params: buildParams(query) }).then((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `用户列表_${timestamp()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  })
}
