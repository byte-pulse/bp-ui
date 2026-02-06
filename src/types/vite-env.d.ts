interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  // 标题
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_LANGUAGE: string
  readonly VITE_APP_PORT: string
  readonly VITE_APP_API_BASE_URL: string
  readonly VITE_APP_HAPPY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
