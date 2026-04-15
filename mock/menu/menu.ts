import { type MockMethod } from 'vite-plugin-mock'

const menuList: Menu[] = []

// 导出 mock 接口数组
export default [
  {
    url: '/api/menu/tree', // 请求地址
    method: 'get', // 请求方式
    response: () => {
      return {
        code: 200,
        data: menuList,
      }
    },
  },
] as MockMethod[]
