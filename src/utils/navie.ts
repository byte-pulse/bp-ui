/**
 * Naive UI 离散组件配置
 *
 * createDiscreteApi 创建的组件不在 n-config-provider 的 DOM 树内，
 * 因此无法自动继承主题配置，需要通过 configProviderProps 显式绑定。
 */

import { createDiscreteApi, darkTheme } from 'naive-ui'
import type { DiscreteApiOptions, GlobalThemeOverrides } from 'naive-ui'
import { defaultTheme } from '@/assets/themes/default'
import { blackWhiteTheme } from '@/assets/themes/blackWhite'

/** 主题覆盖配置，响应式引用 */
const themeOverridesRef = ref<GlobalThemeOverrides | undefined>(defaultTheme)

/** 是否暗色模式 */
const isDarkRef = ref(false)

/** 计算属性：传递给 createDiscreteApi 的配置 */
const configProviderPropsRef = computed(() => ({
  theme: isDarkRef.value ? darkTheme : undefined,
  themeOverrides: themeOverridesRef.value,
}))

/** 创建离散 API 组件 */
const { message, dialog, notification, loadingBar, modal } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
  {
    configProviderProps: configProviderPropsRef,
  } as DiscreteApiOptions,
)

/**
 * 初始化离散组件主题
 *
 * 必须在 Pinia 初始化后调用（在 main.ts 中 app.use(pinia) 之后）
 * 监听 layoutStore 中的主题状态，同步更新离散组件的主题配置
 */
export function setupDiscreteApiTheme() {
  const layoutStore = useLayoutStore()

  // 监听暗色模式切换
  watch(
    () => layoutStore.isDark,
    (isDark) => {
      isDarkRef.value = isDark
    },
    { immediate: true },
  )

  // 监听主题名称切换
  watch(
    () => layoutStore.themeName,
    () => {
      if (layoutStore.isDark) {
        themeOverridesRef.value = darkTheme as unknown as GlobalThemeOverrides
      } else {
        switch (layoutStore.themeName) {
          case 'blackWhite':
            themeOverridesRef.value = blackWhiteTheme
            break
          default:
            themeOverridesRef.value = defaultTheme
        }
      }
    },
    { immediate: true },
  )
}

export {
  message as $message,
  dialog as $dialog,
  notification as $notification,
  loadingBar as $loadingBar,
  modal as $modal,
}
