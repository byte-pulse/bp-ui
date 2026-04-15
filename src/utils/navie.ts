/**
 * Naive UI 离散组件配置
 *
 * createDiscreteApi 创建的组件不在 n-config-provider 的 DOM 树内，
 * 因此无法自动继承主题配置，需要通过 configProviderProps 显式绑定。
 */
import { createDiscreteApi } from 'naive-ui'
import type {
  DiscreteApiOptions,
  GlobalTheme,
  GlobalThemeOverrides,
} from 'naive-ui'

/** 主题 Ref 存储 */
const themeRef = shallowRef<Ref<GlobalTheme | undefined> | undefined>()
const themeOverridesRef = shallowRef<
  Ref<GlobalThemeOverrides | undefined> | undefined
>()

/** 计算属性：传递给 createDiscreteApi 的配置 */
const configProviderPropsRef = computed(() => ({
  theme: themeRef.value?.value,
  themeOverrides: themeOverridesRef.value?.value,
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
 * @param theme - 响应式的主题配置 (darkTheme 或 undefined)
 * @param themeOverrides - 响应式的主题覆盖配置
 */
export const setupDiscreteApiTheme = (
  theme: Ref<GlobalTheme | undefined>,
  themeOverrides: Ref<GlobalThemeOverrides | undefined>,
) => {
  themeRef.value = theme
  themeOverridesRef.value = themeOverrides
}

export {
  message as $message,
  dialog as $dialog,
  notification as $notification,
  loadingBar as $loadingBar,
  modal as $modal,
}
