import { type MockMethod } from 'vite-plugin-mock'

const menuList: Menu[] = [
  {
    id: 1,
    parentId: 0,
    title: '基础数据',
    routeName: 'baseData',
    component: undefined,
    icon: 'ant-design:menu-outlined',
    sort: 1,
    hidden: false,
    type: 'C',
    children: [
      {
        id: 3,
        parentId: 1,
        title: '概念仪表盘',
        routeName: 'conceptDashboard',
        component: 'workbench/Dashboard',
        icon: 'ant-design:menu-outlined',
        sort: 1,
        hidden: false,
        tabShow: true,
        type: 'M',
      },
      {
        id: 4,
        parentId: 1,
        title: '工作台',
        routeName: 'workspace',
        component: 'workbench/Workspace',
        icon: 'ant-design:menu-outlined',
        sort: 1,
        hidden: false,
        tabShow: true,
        type: 'M',
      },
    ],
  },
  {
    id: 5,
    parentId: 0,
    title: '组件案例',
    routeName: 'case',
    component: undefined,
    icon: 'ant-design:menu-outlined',
    sort: 2,
    hidden: false,
    type: 'C',
    children: [
      {
        id: 7,
        parentId: 5,
        title: '表单',
        routeName: 'form',
        component: 'case/FormExample',
        icon: 'ant-design:menu-outlined',
        sort: 1,
        hidden: false,
        tabShow: true,
        type: 'M',
      },
      {
        id: 8,
        parentId: 5,
        title: '表格',
        routeName: 'table',
        component: 'case/TableExample',
        icon: 'ant-design:menu-outlined',
        sort: 1,
        hidden: false,
        tabShow: true,
        type: 'M',
      },
      {
        id: 9,
        parentId: 5,
        title: '文件',
        routeName: 'file',
        component: 'case/FileExample',
        icon: 'ant-design:menu-outlined',
        sort: 1,
        hidden: false,
        tabShow: true,
        type: 'M',
      },
      {
        id: 10,
        parentId: 5,
        title: '弹出框',
        routeName: 'popup',
        component: 'case/PopupExample',
        icon: 'ant-design:menu-outlined',
        sort: 1,
        hidden: false,
        tabShow: true,
        type: 'M',
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
