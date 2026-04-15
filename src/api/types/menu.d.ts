export {}

declare global {
  interface Menu {
    id: number
    parentId: number
    title: string
    name?: string
    path: string
    component?: string
    icon?: string
    sort: number
    hidden: boolean
    type: 1 | 2 | 3
    status: 0 | 1
    permission?: string
    children?: Menu[]
    createTime?: string
    updateTime?: string
  }
}
