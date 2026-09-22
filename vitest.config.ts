import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfigFn from './vite.config'

// 如果 vite.config.ts 是函数形式，需要先执行
const viteConfig =
  typeof viteConfigFn === 'function'
    ? viteConfigFn({ command: 'serve', mode: 'dev' })
    : viteConfigFn

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
