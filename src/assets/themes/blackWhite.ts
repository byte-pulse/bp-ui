import { type GlobalThemeOverrides } from 'naive-ui'
import { lightTheme } from 'naive-ui'

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
