// 后端统一返回结构
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

interface ApiPageResponse<T = unknown> {
  code: number
  message: string
  data: PageData<T>
}

interface PageData<T> {
  total: number
  list: Array<T>
  pageNum: number
  pageSize: number
  size: number
  startRow: number
  endRow: number
  pages: number
  prePage: number
  nextPage: number
  isFirstPage: boolean
  isLastPage: boolean
  hasPreviousPage: boolean
  hasNextPage: boolean
  navigatePages: number
  navigatepageNums: Array<number>
  navigateFirstPage: number
  navigateLastPage: number
}

type ParamsType = string | number | Array
