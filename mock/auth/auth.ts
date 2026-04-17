import { type MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 导出 mock 接口数组
export default [
  {
    url: '/api/login', // 请求地址
    method: 'post', // 请求方式
    response: () => {
      return {
        code: 200,
        data: Mock.mock({
          token: '@string(10,20)',
        }),
      }
    },
  },
] as MockMethod[]
