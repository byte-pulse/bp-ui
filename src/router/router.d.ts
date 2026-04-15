export {}
// 扩展 vue router meta 类型
declare module 'vue-router' {
  interface RouteMeta {
    // 是否在菜单显示
    hidden?: boolean
  }
  interface RouteRecordRaw {
    name: string
  }
}
