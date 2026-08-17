import { darkTheme, lightTheme, type GlobalThemeOverrides } from 'naive-ui'

/**
 * Tailwind v4 黑白极简主题
 */
export const blackWhiteTheme: GlobalThemeOverrides = {
  common: {
    ...lightTheme.common,

    /* ========== 主色 (Neutral Black) ========== */

    baseColor: '#ffffff',

    primaryColor: '#171717', // neutral-900
    primaryColorHover: '#0a0a0a', // neutral-950
    primaryColorPressed: '#000000', // black
    primaryColorSuppl: '#737373', // neutral-500

    /* ========== info (slate, 做区分) ========== */

    infoColor: '#475569', // slate-600
    infoColorHover: '#334155', // slate-700
    infoColorPressed: '#1e293b', // slate-800
    infoColorSuppl: '#94a3b8', // slate-400

    /* ========== success ========== */

    successColor: '#22c55e', // green-500
    successColorHover: '#16a34a', // green-600
    successColorPressed: '#15803d', // green-700
    successColorSuppl: '#86efac',

    /* ========== warning ========== */

    warningColor: '#f59e0b', // amber-500
    warningColorHover: '#d97706', // amber-600
    warningColorPressed: '#b45309', // amber-700
    warningColorSuppl: '#fcd34d',

    /* ========== error ========== */

    errorColor: '#ef4444', // red-500
    errorColorHover: '#dc2626', // red-600
    errorColorPressed: '#b91c1c', // red-700
    errorColorSuppl: '#fca5a5',

    /* ========== 文本 (neutral 统一) ========== */

    textColorBase: '#0a0a0a', // neutral-950
    textColor1: '#000000',
    textColor2: '#404040', // neutral-700
    textColor3: '#737373', // neutral-500
    textColorDisabled: '#a3a3a3', // neutral-400

    placeholderColor: '#a3a3a3',
    placeholderColorDisabled: '#d4d4d4',

    iconColor: '#737373',
    iconColorHover: '#262626',
    iconColorPressed: '#000000',
    iconColorDisabled: '#d4d4d4',

    /* ========== 边框 ========== */

    dividerColor: '#e5e5e5', // neutral-200
    borderColor: '#e5e5e5',

    /* ========== 操作类 ========== */

    closeIconColor: '#a3a3a3',
    closeIconColorHover: '#525252',
    closeIconColorPressed: '#171717',

    closeColorHover: '#f5f5f5',
    closeColorPressed: '#e5e5e5',

    clearColor: '#a3a3a3',
    clearColorHover: '#525252',
    clearColorPressed: '#171717',

    /* ========== 滚动条 ========== */

    scrollbarColor: 'rgba(0,0,0,0.2)',
    scrollbarColorHover: 'rgba(0,0,0,0.35)',

    /* ========== 轨道 ========== */

    progressRailColor: '#e5e5e5',
    railColor: '#e5e5e5',

    /* ========== 容器 ========== */

    bodyColor: '#ffffff',
    cardColor: '#fafafa', // neutral-50
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    tableColor: '#ffffff',

    tagColor: '#f5f5f5',
    avatarColor: '#e5e5e5',
    invertedColor: '#171717',

    inputColor: '#ffffff',
    inputColorDisabled: '#f5f5f5',

    codeColor: '#f5f5f5',
    tabColor: '#fafafa',

    /* ========== 状态 (极简关键) ========== */

    hoverColor: 'rgba(0,0,0,0.04)',
    pressedColor: 'rgba(0,0,0,0.08)',
    actionColor: '#fafafa',

    tableColorHover: 'rgba(0,0,0,0.03)',
    tableColorStriped: '#f5f5f5',
    tableHeaderColor: '#fafafa',

    /* ========== 次按钮 ========== */

    buttonColor2: '#f5f5f5',
    buttonColor2Hover: '#e5e5e5',
    buttonColor2Pressed: '#d4d4d4',

    /* ========== 字体 ========== */

    fontFamily:
      "'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",

    fontFamilyMono: 'Menlo,Monaco,Consolas',
  },
}

/**
 * Tailwind v4 黑白极简暗色主题
 */
export const blackWhiteDarkTheme: GlobalThemeOverrides = {
  common: {
    ...darkTheme.common,

    /* ========== 主色 (Neutral White) ========== */

    baseColor: '#0a0a0a', // neutral-950

    primaryColor: '#e5e5e5', // neutral-200
    primaryColorHover: '#f5f5f5', // neutral-100
    primaryColorPressed: '#ffffff', // white
    primaryColorSuppl: '#525252', // neutral-600

    /* ========== info (slate, 做区分) ========== */

    infoColor: '#94a3b8', // slate-400
    infoColorHover: '#cbd5e1', // slate-300
    infoColorPressed: '#e2e8f0', // slate-200
    infoColorSuppl: '#475569', // slate-600

    /* ========== success ========== */

    successColor: '#4ade80', // green-400
    successColorHover: '#86efac', // green-300
    successColorPressed: '#bbf7d0', // green-200
    successColorSuppl: '#166534',

    /* ========== warning ========== */

    warningColor: '#fbbf24', // amber-400
    warningColorHover: '#fcd34d', // amber-300
    warningColorPressed: '#fde68a', // amber-200
    warningColorSuppl: '#92400e',

    /* ========== error ========== */

    errorColor: '#f87171', // red-400
    errorColorHover: '#fca5a5', // red-300
    errorColorPressed: '#fecaca', // red-200
    errorColorSuppl: '#991b1b',

    /* ========== 文本 (neutral 统一) ========== */

    textColorBase: '#fafafa', // neutral-50
    textColor1: '#ffffff',
    textColor2: '#d4d4d4', // neutral-300
    textColor3: '#a3a3a3', // neutral-400
    textColorDisabled: '#525252', // neutral-600

    placeholderColor: '#737373', // neutral-500
    placeholderColorDisabled: '#525252',

    iconColor: '#a3a3a3',
    iconColorHover: '#e5e5e5',
    iconColorPressed: '#ffffff',
    iconColorDisabled: '#525252',

    /* ========== 边框 ========== */

    dividerColor: '#262626', // neutral-800
    borderColor: '#262626',

    /* ========== 操作类 ========== */

    closeIconColor: '#737373',
    closeIconColorHover: '#d4d4d4',
    closeIconColorPressed: '#fafafa',

    closeColorHover: '#262626',
    closeColorPressed: '#171717',

    clearColor: '#737373',
    clearColorHover: '#d4d4d4',
    clearColorPressed: '#fafafa',

    /* ========== 滚动条 ========== */

    scrollbarColor: 'rgba(255,255,255,0.2)',
    scrollbarColorHover: 'rgba(255,255,255,0.35)',

    /* ========== 轨道 ========== */

    progressRailColor: '#262626',
    railColor: '#262626',

    /* ========== 容器 ========== */

    bodyColor: '#0a0a0a',
    cardColor: '#171717', // neutral-900
    modalColor: '#171717',
    popoverColor: '#1c1c1c',
    tableColor: '#0d0d0d',

    tagColor: '#1f1f1f',
    avatarColor: '#262626',
    invertedColor: '#fafafa',

    inputColor: '#171717',
    inputColorDisabled: '#111111',

    codeColor: '#1a1a1a',
    tabColor: '#171717',

    /* ========== 状态 (极简关键) ========== */

    hoverColor: 'rgba(255,255,255,0.06)',
    pressedColor: 'rgba(255,255,255,0.1)',
    actionColor: '#1c1c1c',

    tableColorHover: 'rgba(255,255,255,0.04)',
    tableColorStriped: '#141414',
    tableHeaderColor: '#171717',

    /* ========== 次按钮 ========== */

    buttonColor2: '#1f1f1f',
    buttonColor2Hover: '#262626',
    buttonColor2Pressed: '#2e2e2e',

    /* ========== 字体 ========== */

    fontFamily:
      "'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",

    fontFamilyMono: 'Menlo,Monaco,Consolas',
  },
}
