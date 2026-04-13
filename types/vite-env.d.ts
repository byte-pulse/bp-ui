export {}

declare global {
  interface ViteTypeOptions {
    // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
    // 这样就不允许有未知的键值了。
    strictImportMetaEnv: unknown
  }

  interface ImportMetaEnv {
    // 标题
    readonly VITE_APP_TITLE: string
    // 公司名
    readonly VITE_APP_COMPANY_NAME: string
    // 语言
    readonly VITE_APP_LANGUAGE: string
    // 端口
    readonly VITE_APP_PORT: string
    // API 基础路径
    readonly VITE_APP_API_BASE_URL: string
    // 是否启用 mock 数据
    readonly VITE_APP_USE_MOCK: boolean
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
