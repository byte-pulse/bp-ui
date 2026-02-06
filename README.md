# bp-ui

一个基于 Vue 3 + Vite + TypeScript + Naive UI 的前端快速启动项目模板，开箱即用，帮助开发者快速搭建现代化前端应用。

## ✨ 特性

- 🚀 **现代化技术栈**：Vue 3.5 + Vite + TypeScript 5.9
- 🎨 **UI 组件库**：Naive UI，提供丰富的组件
- 📦 **自动导入**：支持 API 和组件自动导入，提升开发效率
- 🔐 **权限管理**：内置路由守卫和权限控制
- 🌐 **HTTP 封装**：基于 Axios 的二次封装，支持请求/响应拦截
- 💾 **状态管理**：Pinia + 持久化插件
- 🧪 **单元测试**：Vitest + Vue Test Utils
- 📝 **代码规范**：ESLint + oxlint + oxfmt
- 🎯 **TypeScript**：完整的类型定义支持
- 📱 **响应式布局**：支持多端适配

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | ^3.5.27 | 渐进式 JavaScript 框架 |
| Vite | beta | 下一代前端构建工具 |
| TypeScript | ~5.9.3 | JavaScript 的超集 |
| Naive UI | ^2.43.2 | Vue 3 组件库 |
| Vue Router | ^5.0.1 | 官方路由管理器 |
| Pinia | ^3.0.4 | Vue 状态管理库 |
| Axios | ^1.13.4 | HTTP 客户端 |
| Vitest | ^4.0.18 | 单元测试框架 |
| Sass | ^1.97.3 | CSS 预处理器 |

## 📁 项目结构

```
bp-ui/
├── public/                 # 静态资源
├── src/
│   ├── __tests__/          # 单元测试
│   ├── api/                # API 接口
│   │   └── login/          # 登录相关接口
│   ├── assets/             # 资源文件
│   │   ├── images/         # 图片资源
│   │   └── style/          # 样式文件
│   ├── components/         # 全局组件
│   │   └── exception/      # 异常页面组件
│   ├── layouts/            # 布局组件
│   │   └── components/     # 布局子组件
│   ├── router/             # 路由配置
│   ├── stores/             # 状态管理
│   ├── types/              # 类型定义
│   ├── utils/              # 工具函数
│   ├── views/              # 页面视图
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── .env                    # 环境变量
├── .env.dev                # 开发环境变量
├── vite.config.ts          # Vite 配置
├── vitest.config.ts        # Vitest 配置
└── package.json            # 项目配置
```

## 🚀 快速开始

### 环境要求

- Node.js ^20.19.0 || >=22.12.0
- pnpm (推荐)

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

访问 http://localhost:5173

### 构建

```bash
pnpm build
```

### 预览

```bash
pnpm preview
```

## 📖 开发指南

### 环境变量

在 `.env` 或 `.env.dev` 中配置环境变量：

```env
VITE_APP_PORT=5173
VITE_APP_API_BASE_URL=/api
```

### 自动导入

项目已配置自动导入，无需手动导入：

- **Vue API**：`ref`, `reactive`, `computed`, `watch` 等
- **Vue Router API**：`useRouter`, `useRoute` 等
- **Naive UI 组件**：自动按需导入
- **自定义组件**：`src/components/` 和 `src/layouts/components/` 下的组件
- **Store**：`src/stores/` 下的状态管理
- **工具函数**：`src/utils/` 下的工具函数

### 路由配置

在 `src/router/routes.ts` 中配置路由：

```typescript
{
  path: '/example',
  name: 'Example',
  component: () => import('@/views/example/Index.vue'),
  meta: {
    title: '示例页面',
    permissions: ['example:view'], // 权限控制
    enabled: true // 是否启用
  }
}
```

### API 请求

使用封装的 `fetchAxios` 进行请求：

```typescript
import { fetchAxios } from '@/utils/http'

// GET 请求
const data = await fetchAxios.get('/api/user', { id: 1 })

// POST 请求
const result = await fetchAxios.post('/api/user', { name: 'test' })

// 文件上传
const upload = await fetchAxios.filePost('/api/upload', formData, {
  $onUploadProgress: (percent) => console.log(percent)
})
```

### 状态管理

使用 Pinia 创建 store：

```typescript
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

## 🧪 测试

运行单元测试：

```bash
pnpm test:unit
```

## 📝 代码规范

项目使用 ESLint + oxlint + oxfmt 进行代码检查和格式化：

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 🔧 配置说明

### Vite 配置

- **自动导入**：支持 Vue API、Router API、组件自动导入
- **别名**：`@` 指向 `src` 目录
- **SCSS**：全局变量自动注入
- **开发服务器**：支持端口配置

### TypeScript 配置

- 严格模式开启
- 路径别名支持
- Vue 组件类型支持

## 📄 License

MIT
