import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// 配置 naive-ui 组件自动导入
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  let envPort
  let useMock = false
  if (command === 'serve') {
    const devEnv = loadEnv('dev', './')
    // 从环境变量中获取端口
    envPort = Number(devEnv['VITE_APP_PORT'])
    // 从环境变量中获取是否启用 mock 数据
    useMock = devEnv['VITE_APP_USE_MOCK'] === 'true'
  }

  /** @type {import('vite').UserConfig} */
  return {
    plugins: [
      vue(),
      // 配置 vue-devtools
      vueDevTools(),
      // 配置 tailwindcss
      tailwindcss(),
      // 配置 mock 数据
      viteMockServe({
        mockPath: 'mock',
        enable: command === 'serve' && useMock, // 仅在开发环境下启用 mock 数据
        watchFiles: true,
        logger: true,
        cors: true,
      }),
      // 函数自动导入
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dirs: ['./src/stores/**', './src/utils/**'],
        dts: './types/auto-imports.d.ts',
        dtsMode: 'overwrite',
      }),
      // 组件自动导入
      Components({
        resolvers: [NaiveUiResolver()],
        dirs: ['./src/components/**', './src/layout/components/**'],
        dts: './types/auto-components.d.ts',
        syncMode: 'overwrite',
      }),
    ],
    // 配置路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 配置 scss 变量
    css: {
      preprocessorOptions: {
        scss: {
          // 配置 scss 变量
          additionalData: `
          @use "@/assets/style/variables.scss" as vv;
        `,
        },
      },
    },
    // 配置服务器
    server: {
      // 配置服务器端口
      port: envPort || 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8080', // 后端地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
