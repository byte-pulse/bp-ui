import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig, loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  let envPort
  if (command === 'serve') {
    const devEnv = loadEnv('dev', './')
    envPort = Number(devEnv['VITE_APP_PORT'])
  }

  /** @type {import('vite').UserConfig} */
  return {
    plugins: [
      vue(),
      vueDevTools(),
      // 函数自动导入
      AutoImport({
        imports: ['vue', 'vue-router'],
        dirs: ['./src/stores/**', './src/utils/**'],
        dts: './src/types/auto-imports.d.ts',
        dtsMode: 'overwrite'
      }),
      // 组件自动导入
      Components({
        resolvers: [NaiveUiResolver()],
        dirs: ['./src/components/**', './src/layouts/components/**'],
        dts: './src/types/auto-components.d.ts'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/style/variables.scss" as vv;
        `
        }
      }
    },
    server: {
      port: envPort || 5173
    }
  }
})
