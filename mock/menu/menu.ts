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
  {
    id: 5,
    parentId: 0,
    title: '组件',
    routeName: 'components',
    component: undefined,
    isGroup: true,
    icon: 'home',
    sort: 2,
    hidden: false,
    type: 'C',
    children: [
      {
        id: 6,
        parentId: 5,
        title: '案例',
        routeName: 'examples',
        component: undefined,
        isGroup: false,
        icon: 'home',
        sort: 1,
        hidden: false,
        type: 'C',
        children: [
          {
            id: 7,
            parentId: 6,
            title: '表格',
            routeName: 'table',
            component: 'workbench/Dashboard',
            isGroup: false,
            icon: 'home',
            sort: 1,
            hidden: false,
            tabShow: true,
            type: 'M',
          },
          {
            id: 8,
            parentId: 6,
            title: '表单',
            routeName: 'form',
            component: 'workbench/Workspace',
            isGroup: false,
            icon: 'home',
            sort: 1,
            hidden: false,
            tabShow: true,
            type: 'M',
          },
          {
            id: 9,
            parentId: 6,
            title: '文件',
            routeName: 'file',
            component: 'workbench/Workspace',
            isGroup: false,
            icon: 'home',
            sort: 1,
            hidden: false,
            tabShow: true,
            type: 'M',
          },
          {
            id: 10,
            parentId: 6,
            title: '弹出框',
            routeName: 'popup',
            component: 'workbench/Workspace',
            isGroup: false,
            icon: 'home',
            sort: 1,
            hidden: false,
            tabShow: true,
            type: 'M',
          },
          {
            id: 11,
            parentId: 6,
            title: '图标选择',
            routeName: 'iconSelect',
            component: 'components/examples/IconSelect',
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
