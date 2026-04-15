import { type MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 导出 mock 接口数组
export default [
  {
    url: '/api/user', // 请求地址
    method: 'get', // 请求方式
    response: () => {
      return {
        code: 200,
        data: Mock.mock({
          'list|5': [
            {
              id: '@id',
              name: '@cname',
              age: '@integer(18,40)',
            },
          ],
        }),
      }
    },
  },
] as MockMethod[]
