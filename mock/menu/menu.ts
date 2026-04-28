import { type MockMethod } from 'vite-plugin-mock'

const menuList: Menu[] = [
  {
    id: 1,
    parentId: 0,
    title: '基础数据',
    routeName: 'baseData',
    component: undefined,
    isGroup: true,
    icon: 'home',
    sort: 1,
    hidden: false,
    type: 'C',
    children: [
      {
        id: 2,
        parentId: 1,
        title: '仪表盘',
        routeName: 'dashboard',
        component: undefined,
        isGroup: false,
        icon: 'home',
        sort: 1,
        hidden: false,
        type: 'C',
        children: [
          {
            id: 3,
            parentId: 2,
            title: '概念仪表盘',
            routeName: 'conceptDashboard',
            component: 'workbench/Dashboard',
            isGroup: false,
            icon: 'home',
            sort: 1,
            hidden: false,
            tabShow: true,
            type: 'M',
          },
          {
            id: 4,
            parentId: 2,
            title: '工作台',
            routeName: 'workspace',
            component: 'workbench/Workspace',
            isGroup: false,
            icon: 'home',
            sort: 1,
            hidden: false,
            tabShow: true,
            type: 'M',
          },
        ],
      },
    ],
  },
]

// 导出 mock 接口数组
export default [
  {
    url: '/api/menus', // 请求地址
    method: 'get', // 请求方式
    response: () => {
      return {
        code: 200,
        data: menuList,
      }
    },
  },
  {
    url: '/api/routes', // 请求地址
    method: 'get', // 请求方式
    response: () => {
      return {
        code: 200,
        data: menuList,
      }
    },
  },
] as MockMethod[]
