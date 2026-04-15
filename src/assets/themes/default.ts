import { type GlobalThemeOverrides } from 'naive-ui'
import { lightTheme } from 'naive-ui'

/**
 * Tailwind v4 高级冷调蓝主题
 */
export const defaultTheme: GlobalThemeOverrides = {
  common: {
    ...lightTheme.common,

    /* ========== 主色 (Brand Blue) ========== */

    baseColor: '#ffffff',

    primaryColor: '#3b82f6', // blue-500
    primaryColorHover: '#2563eb', // blue-600
    primaryColorPressed: '#1d4ed8', // blue-700
    primaryColorSuppl: '#93c5fd', // blue-300

    /* ========== info (Sky, 区分主色) ========== */

    infoColor: '#0ea5e9', // sky-500
    infoColorHover: '#0284c7', // sky-600
    infoColorPressed: '#0369a1', // sky-700
    infoColorSuppl: '#7dd3fc', // sky-300

    /* ========== success (emerald) ========== */

    successColor: '#10b981', // emerald-500
    successColorHover: '#059669', // emerald-600
    successColorPressed: '#047857', // emerald-700
    successColorSuppl: '#6ee7b7',

    /* ========== warning (amber) ========== */

    warningColor: '#f59e0b', // amber-500
    warningColorHover: '#d97706', // amber-600
    warningColorPressed: '#b45309', // amber-700
    warningColorSuppl: '#fcd34d',

    /* ========== error (red) ========== */

    errorColor: '#ef4444', // red-500
    errorColorHover: '#dc2626', // red-600
    errorColorPressed: '#b91c1c', // red-700
    errorColorSuppl: '#fca5a5',

    /* ========== 文本 (slate 更高级) ========== */

    textColorBase: '#0f172a', // slate-900
    textColor1: '#0f172a',
    textColor2: '#334155', // slate-700
    textColor3: '#64748b', // slate-500
    textColorDisabled: '#94a3b8', // slate-400

    placeholderColor: '#94a3b8',
    placeholderColorDisabled: '#cbd5e1',

    iconColor: '#64748b',
    iconColorHover: '#334155',
    iconColorPressed: '#0f172a',
    iconColorDisabled: '#cbd5e1',

    /* ========== 边框 ========== */

    dividerColor: '#e2e8f0', // slate-200
    borderColor: '#e2e8f0',

    /* ========== 操作类 ========== */

    closeIconColor: '#94a3b8',
    closeIconColorHover: '#64748b',
    closeIconColorPressed: '#334155',

    closeColorHover: '#f1f5f9',
    closeColorPressed: '#e2e8f0',

    clearColor: '#94a3b8',
    clearColorHover: '#64748b',
    clearColorPressed: '#334155',

    /* ========== 滚动条 ========== */

    scrollbarColor: 'rgba(100,116,139,0.3)',
    scrollbarColorHover: 'rgba(100,116,139,0.5)',

    /* ========== 轨道 ========== */

    progressRailColor: '#e2e8f0',
    railColor: '#e2e8f0',

    /* ========== 容器 ========== */

    bodyColor: '#f8fafc', // slate-50
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    tableColor: '#ffffff',

    tagColor: '#f1f5f9',
    avatarColor: '#e2e8f0',
    invertedColor: '#0f172a',

    inputColor: '#ffffff',
    inputColorDisabled: '#f1f5f9',

    codeColor: '#f1f5f9',
    tabColor: '#f8fafc',

    /* ========== 状态 (带主色调) ========== */

    hoverColor: 'rgba(59,130,246,0.08)', // blue-500
    pressedColor: 'rgba(59,130,246,0.15)',
    actionColor: '#f8fafc',

    tableColorHover: 'rgba(59,130,246,0.05)',
    tableColorStriped: '#f1f5f9',
    tableHeaderColor: '#f8fafc',

    /* ========== 次按钮 ========== */

    buttonColor2: '#f1f5f9',
    buttonColor2Hover: '#e2e8f0',
    buttonColor2Pressed: '#cbd5e1',

    /* ========== 字体 ========== */

    fontFamily:
      "'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",

    fontFamilyMono: 'Menlo,Monaco,Consolas',
  },
}
