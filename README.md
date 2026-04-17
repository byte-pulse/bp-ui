# BP Admin UI

由 [字节脉动科技](https://github.com/jiejiebiezheyang) 出品的现代化中后台管理系统启动模板，开箱即用，为年轻企业而生。

## 特性

- **Vue 3 + TypeScript** — 基于 Composition API 与 `<script setup>` 的现代开发范式
- **Vite 8** — 极速开发服务器与构建工具
- **Naive UI** — 高质量 Vue 3 组件库，组件与 API 自动导入
- **Tailwind CSS v4** — 原子化 CSS，按需生成
- **动态路由** — 后端菜单驱动的路由生成，权限与路由解耦
- **多主题** — 内置冷调蓝（默认）与黑白极简两套主题，支持暗色模式切换
- **Pinia 持久化** — 状态管理开箱持久化，刷新不丢失
- **Axios 封装** — 统一拦截、Token 注入、文件上传下载、Fetch 适配器
- **Mock 数据** — 开发环境基于 vite-plugin-mock 的接口模拟
- **HarmonyOS Sans SC** — 鸿蒙字体，中文排版更精致
- **ESLint + OxLint + Prettier** — 多层代码质量保障

## 技术栈

| 类别     | 技术                            | 版本  |
| -------- | ------------------------------- | ----- |
| 框架     | Vue                             | 3.5+  |
| 语言     | TypeScript                      | 6.0   |
| 构建     | Vite                            | 8.0   |
| UI 库    | Naive UI                        | 2.44+ |
| CSS      | Tailwind CSS                    | 4.2+  |
| 状态管理 | Pinia                           | 3.0+  |
| 路由     | Vue Router                      | 5.0+  |
| HTTP     | Axios                           | 1.15+ |
| 工具函数 | es-toolkit                      | 1.45+ |
| 图标     | @vicons/ionicons5, @vicons/antd | —     |
| Mock     | mockjs + vite-plugin-mock       | —     |
| 代码规范 | ESLint + OxLint + Prettier      | —     |

## 快速开始

### 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- pnpm（推荐）

### 安装与运行

```sh
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

启动后访问 `http://localhost:5173`（端口可在 `.env.dev` 中修改）。

### 构建生产版本

```sh
pnpm build
```

### 其他命令

```sh
# 预览生产构建
pnpm preview

# 代码检查（OxLint + ESLint）
pnpm lint

# 代码格式化
pnpm format

# 仅类型检查
pnpm type-check
```

## 核心设计

### 动态路由

路由不再硬编码在前端，而是由后端 `/api/routes` 接口返回菜单树，前端递归生成扁平路由并动态注册到 `layout` 下。菜单与路由共享同一数据源，天然同步。

流程：`getDynamicRoutes()` → 请求后端菜单 → `generateRoutes()` 扁平化 → `router.addRoute()` 动态注册

### HTTP 客户端

`src/utils/http.ts` 封装了两个 Axios 实例：

- **fetchAxios** — 日常请求，使用 `fetch` 适配器
- **fileAxios** — 文件上传/下载，支持进度回调

内置功能：Token 自动注入、401 跳转登录、统一错误提示、参数序列化（`qs` + `arrayFormat: 'repeat'`）。

### 主题系统

通过 Naive UI 的 `themeOverrides` 实现主题切换，当前内置：

| 主题         | 说明                                 |
| ------------ | ------------------------------------ |
| `default`    | 冷调蓝主题，基于 Tailwind Slate 色系 |
| `blackWhite` | 黑白极简主题，中性色调               |

暗色模式通过 `n-config-provider` 的 `theme` 属性切换 `darkTheme`。离散组件（`$message`、`$dialog` 等）通过 `setupDiscreteApiTheme` 同步主题。

### 自动导入

- **API 自动导入** — `vue`、`vue-router`、`pinia` 的函数及 `stores/`、`utils/` 下的导出无需手动 import
- **组件自动导入** — Naive UI 组件及 `components/`、`layout/components/` 下的 Vue 组件无需手动注册

### 状态持久化

`auth` 和 `layout` 两个 Store 均通过 `pinia-plugin-persistedstate` 持久化到 localStorage，页面刷新后状态不丢失。

## 环境变量

| 变量                    | 文件       | 说明           | 默认值         |
| ----------------------- | ---------- | -------------- | -------------- |
| `VITE_APP_TITLE`        | `.env`     | 应用标题       | `BP Admin UI`  |
| `VITE_APP_COMPANY_NAME` | `.env`     | 公司名称       | `字节脉动科技` |
| `VITE_APP_LANGUAGE`     | `.env`     | 语言           | `zh-hans`      |
| `VITE_APP_PORT`         | `.env.dev` | 开发服务器端口 | `5173`         |
| `VITE_APP_API_BASE_URL` | `.env.dev` | API 基础路径   | `/api`         |
| `VITE_APP_USE_MOCK`     | `.env.dev` | 是否启用 Mock  | `true`         |

## 开发建议

### IDE

推荐 [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（请禁用 Vetur）。

### 浏览器扩展

- Chromium：[Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox：[Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### 新增页面

1. 在 `src/views/` 下创建 `.vue` 文件
2. 后端菜单接口返回对应的 `component` 路径（如 `workbench/Dashboard`）
3. 路由将自动注册，无需手动配置

### 新增 API

1. 在 `src/api/types/` 中声明请求/响应类型
2. 在 `src/api/` 下新建模块文件，使用 `fetchAxios` 或 `fileAxios` 发起请求
3. 如需 Mock，在 `mock/` 目录下新建对应模块

## 代理配置

开发环境下，`/api` 前缀的请求默认代理到 `http://localhost:8080`，可在 `vite.config.ts` 中修改：

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

## License

[MIT](./LICENSE)
