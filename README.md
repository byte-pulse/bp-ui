# BP Admin UI

由 [字节脉动](https://gitee.com/byte-pulse) 出品的现代化中后台管理系统启动模板，开箱即用，为年轻企业而生。

## 特性

- **Vue 3 + TypeScript** — 基于 Composition API 与 `<script setup>` 的现代开发范式
- **Vite 8** — 极速开发服务器与构建工具
- **Arco Design Vue** — 高质量 Vue 3 组件库，组件与 API 自动按需导入
- **Tailwind CSS v4** — 原子化 CSS，按需生成
- **动态路由** — 后端菜单驱动的路由生成，菜单与路由共享同一数据源
- **配置化组件** — `ITable` / `IForm` 用一份配置描述整张表格、整个表单（[表格文档](./src/components/table/README.md) · [表单文档](./src/components/form/README.md)）
- **完整布局体系** — 侧边栏递归菜单、面包屑、多标签页、页面设置
- **亮 / 暗主题** — 基于 Arco `arco-theme` 属性全局切换
- **Pinia 持久化** — 布局、标签页、表格外观偏好刷新不丢失
- **Axios 封装** — 统一拦截、Token 注入、文件上传下载进度、Fetch 适配器
- **Mock 数据** — 开发环境基于 vite-plugin-mock 的接口模拟
- **HarmonyOS Sans SC** — 鸿蒙字体，中文排版更精致
- **ESLint + OxLint + Prettier** — 多层代码质量保障

## 技术栈

| 类别     | 技术                            | 版本    |
| -------- | ------------------------------- | ------- |
| 框架     | Vue                             | 3.5+    |
| 语言     | TypeScript                      | 6.0     |
| 构建     | Vite                            | 8.3+    |
| UI 库    | Arco Design Vue                 | 2.58+   |
| CSS      | Tailwind CSS                    | 4.3+    |
| 状态管理 | Pinia                           | 4.0+    |
| 路由     | Vue Router                      | 5.3+    |
| HTTP     | Axios                           | 1.20+   |
| 工具函数 | es-toolkit                      | 1.52+   |
| 图标     | @iconify/vue + Arco 图标         | —       |
| 动画     | animate.css                     | —       |
| Mock     | mockjs + vite-plugin-mock       | —       |
| 代码规范 | ESLint + OxLint + Prettier      | —       |

## 目录结构

```
bp-admin-ui/
├── mock/                       # Mock 接口（登录 / 菜单 / 表格）
│   ├── auth/auth.ts
│   ├── menu/menu.ts
│   └── table/table.ts
├── public/                     # 静态资源
├── src/
│   ├── api/                    # 接口模块
│   │   ├── types/              # 请求 / 响应类型声明
│   │   ├── auth.ts             # 登录
│   │   ├── menu.ts             # 菜单 / 路由树
│   │   └── table.ts            # 表格列表与导出
│   ├── assets/
│   │   ├── fonts/              # HarmonyOS Sans SC 字体
│   │   ├── images/             # 图片资源
│   │   └── style/              # main.css / fonts.css / vTransition.css
│   ├── components/             # 全局组件（自动注册）
│   │   ├── exception/          # 403 / 404 页面
│   │   ├── form/               # IForm / IFormField 配置化表单
│   │   └── table/              # ITable 配置化表格
│   ├── layout/                 # 布局骨架
│   │   ├── components/         # Sidebar / Header / Breadcrumb / Tabs / PageSettings / RecursiveMenu
│   │   └── Layout.vue
│   ├── router/index.ts         # 路由实例 + 动态路由 + 守卫
│   ├── stores/                 # auth / layout / tab / table
│   ├── utils/                  # http / arco / toolkit / banner / windows
│   ├── views/                  # 页面
│   │   ├── login/Login.vue
│   │   ├── workbench/          # Dashboard、Workspace
│   │   └── case/               # FormExample、TableExample
│   ├── App.vue
│   └── main.ts
├── types/                      # 全局类型与自动生成的 d.ts
│   ├── api.d.ts                # PageInfo / ApiResponse / ParamsType
│   ├── auto-imports.d.ts       # 自动生成，勿手改
│   └── auto-components.d.ts    # 自动生成，勿手改
├── env.d.ts
├── vite.config.ts
└── package.json
```

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

启动后访问 `http://localhost:5173`（端口可在 `.env.dev` 中修改）。登录页已预填测试账号，账号密码仅做必填校验，Mock 接口不校验真实性，直接返回 token。

### 构建生产版本

```sh
pnpm build
```

### 其他命令

```sh
# 预览生产构建
pnpm preview

# 仅构建（跳过类型检查）
pnpm build-only

# 代码检查（OxLint + ESLint，均带 --fix）
pnpm lint

# 代码格式化（Prettier，作用于 src/ 与 mock/）
pnpm format

# 仅类型检查
pnpm type-check
```

## 核心设计

### 动态路由

路由不再硬编码在前端，而是由后端菜单树驱动，菜单与路由共享同一数据源。

1. `main.ts` 在挂载前调用 `getDynamicRoutes()`，请求 `GET /api/routes` 拉取菜单树；
2. `generateRoutes()` 递归扁平化菜单，把 `component`（如 `workbench/Dashboard`）映射为 `import.meta.glob('@/views/**/*.vue')` 中对应的组件；
3. 扁平化后的路由通过 `router.addRoute('layout', route)` 挂到布局路由下，`/` 会自动跳到第一个动态路由。

`beforeEach` 中做了兜底：动态路由未加载完成时先加载再放行；未登录访问任意页面会重定向到 `/login`；未匹配的路径统一落到 `/404`。

### 配置化组件

项目内置两个由配置驱动的高阶组件，已全局自动注册，模板中直接使用即可：

- **ITable** — 列、搜索区、数据源、分页、导出、工具栏全部由 `TableConfig` 描述，支持本地 `data` 与远程 `request` 两种模式、行选择、外观偏好持久化。详见 [ITable 配置化表格](./src/components/table/README.md)。
- **IForm / IFormField** — 字段控件类型、校验规则、分组、多列栅格由 `FormConfig` 描述，内置 13 种控件与响应式栅格。详见 [IForm / IFormField 配置化表单](./src/components/form/README.md)。

类型需显式从 `@/components/table/types`、`@/components/form/types` 引入。

### HTTP 客户端

`src/utils/http.ts` 封装了两个 Axios 实例：

- **fetchAxios** — 日常请求，使用 `fetch` 适配器
- **fileAxios** — 文件上传 / 下载，`returnRaw: true` 返回完整响应体

内置功能：

- 请求头无 `Authorization` 时自动从 `useAuthStore` 注入 Token
- 业务码 `401` 跳转登录并携带 `redirect`，非 `200` 统一 `$message.error` 并 reject
- `blob` / `arraybuffer` 响应（文件流）直接透传，不解析业务码
- 参数序列化使用 `qs` 且 `arrayFormat: 'repeat'`（`arr=1&arr=2`）
- `filePost` / `fileGet` 提供上传 / 下载进度回调，且不设超时

### 主题与布局

主题状态放在 `useLayoutStore` 的 `themeName`（`'light' | 'dark'`）中，`App.vue` 监听变化并在 `<html>` / `<body>` 上设置 `arco-theme` 属性，从而让 Arco 组件、全局 CSS 变量与二级菜单一起切换。暗色下的 CSS 变量覆盖写在 `src/assets/style/main.css`。

`Layout.vue` 组装了侧边栏（`Sidebar` + `RecursiveMenu` 递归菜单）、顶部区（`Header` + `Breadcrumb`）、可选标签页（`Tabs`）与路由出口，路由切换带 `animate.css` 过渡动画。

- **Header** — 明暗切换（支持 `View Transition` 从点击位置扩散的圆形动画）、消息、页面设置入口、头像下拉（含退出登录）
- **PageSettings** — 抽屉式设置面板，调整菜单风格（深 / 浅）、标签页显隐、侧边栏宽度，设置结果持久化到 `layout` store

### 自动导入

配置见 `vite.config.ts`：

- **API 自动导入** — `vue`、`vue-router`、`pinia` 的函数，以及 `src/stores/**`、`src/utils/**` 的导出无需手动 import
- **组件自动导入** — Arco 组件、`src/components/**`、`src/layout/components/**` 下的 Vue 组件无需手动注册；`IIcon` 已映射为 `@iconify/vue` 的 `Icon`
- 生成的类型声明位于 `types/auto-imports.d.ts`、`types/auto-components.d.ts`，由插件覆盖写入，请勿手动修改

### 状态持久化

均通过 `pinia-plugin-persistedstate` 持久化：

| Store    | 内容                                     | 存储介质         |
| -------- | ---------------------------------------- | ---------------- |
| `auth`   | token / role / permission                | `sessionStorage` |
| `tab`    | 标签页列表                               | `sessionStorage` |
| `layout` | 折叠态、主题、菜单深浅、侧边栏宽度等      | `localStorage`   |
| `table`  | 表格密度 / 边框 / 斑马纹 / 每页条数       | `localStorage`   |

## 环境变量

| 变量                    | 文件       | 说明           | 默认值         |
| ----------------------- | ---------- | -------------- | -------------- |
| `VITE_APP_TITLE`        | `.env`     | 应用标题       | `BP Admin UI`  |
| `VITE_APP_COMPANY_NAME` | `.env`     | 公司名称       | `字节脉动科技` |
| `VITE_APP_LANGUAGE`     | `.env`     | 语言           | `zh-hans`      |
| `VITE_APP_VERSION`      | `.env`     | 版本号（控制台横幅输出） | `v1.0.0` |
| `VITE_APP_PORT`         | `.env.dev` | 开发服务器端口 | `5173`         |
| `VITE_APP_API_BASE_URL` | `.env.dev` | API 基础路径   | `/api`         |
| `VITE_APP_USE_MOCK`     | `.env.dev` | 是否启用 Mock  | `true`         |

`VITE_APP_TITLE` 与 `VITE_APP_LANGUAGE` 在 `index.html` 中通过 `%VAR%` 注入。

## 开发建议

### IDE

推荐 [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（请禁用 Vetur）。仓库已在 `.vscode/extensions.json` 中推荐了 Volar、ESLint、Oxc、Prettier、EditorConfig 插件，并在 `settings.json` 中配置了保存自动格式化。

### 浏览器扩展

- Chromium：[Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox：[Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### 新增页面

1. 在 `src/views/` 下创建 `.vue` 文件（路径即菜单中的 `component`）；
2. 在 `mock/menu/menu.ts` 的菜单树中新增节点，`component` 填写相对 `src/views/` 的路径（不带 `.vue`，如 `workbench/Dashboard`）；
3. 路由会在启动时自动注册，无需手动配置。

### 新增 API

1. 在 `src/api/types/` 中声明请求 / 响应类型；
2. 在 `src/api/` 下新建模块文件，使用 `fetchAxios` 或 `fileAxios` 发起请求；
3. 如需 Mock，在 `mock/` 下新建目录与模块，导出 `MockMethod[]` 即可被自动装载。

### 常用工具

`src/utils/` 下还提供了：

- `arco.ts` — 按需导出 Arco 的 `Message` 等命令式 API（如 `$message`）
- `toolkit.ts` — 集中导出 es-toolkit 的 `throttle` / `debounce`
- `banner.ts` — 控制台品牌横幅
- `windows.ts` — 浏览器系统通知与权限申请

## 代理配置

开发环境下，`/api` 前缀的请求默认代理到 `http://localhost:8080`（并去掉 `/api` 前缀），可在 `vite.config.ts` 中修改：

```ts
server: {
  host: '0.0.0.0',
  port: envPort || 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

> Mock 与代理同时存在时，`VITE_APP_USE_MOCK=true` 会优先由 Mock 中间件接管请求。

## License

[MIT](./LICENSE)
