export {}

declare global {
  interface Menu {
    id: number
    parentId: number
    title: string
    routeName: string
    component?: string
    icon?: string
    sort: number
    hidden: boolean
    tabShow?: boolean
    type: 'C' | 'M' | 'B'
    permission?: string
    children?: Menu[]
  }
}
