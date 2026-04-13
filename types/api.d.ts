export {}

declare global {
  /*
   * 分页数据类型
   */
  interface PageInfo<T> {
    pageNum: number // 当前页码
    pageSize: number // 每页数量
    pages: number // 总页数
    prePage: number // 上一页码码
    nextPage: number // 下一页码码
    isFirstPage: boolean // 是否是第一页
    isLastPage: boolean // 是否是最后一页
    hasPreviousPage: boolean // 是否有上一页
    hasNextPage: boolean // 是否有下一页
    navigatePages: number // 导航页码数
    navigatepageNums: number[] // 导航页码列表，用于分页组件
    navigateFirstPage: number // 导航第一页码码
    navigateLastPage: number // 导航最后一页码码
    size: number // 列表数据数量
    total: number // 总记录数
    startRow: number // 开始行号
    endRow: number // 结束行号
    list: T[] // 列表数据
  }

  /*
   * 定义 API 响应类型
   */
  interface ApiResponse<T> {
    code: number // 响应状态码
    message: string // 响应消息
    data: T // 响应数据，可能是单条数据或分页数据
    timestamp: number // 响应时间戳
    traceId: string // 请求跟踪 ID
  }

  /*
   * 定义 API 请求参数类型
   */
  type ParamsType = string | number | (string | number)[]
}

declare module 'axios' {
  interface AxiosRequestConfig {
    returnRaw?: boolean // 是否返回原始结构
  }
}
