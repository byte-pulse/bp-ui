import { darkTheme, lightTheme, type GlobalThemeOverrides } from 'naive-ui'

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

/**
 * Tailwind v4 高级冷调蓝暗色主题
 */
export const defaultDarkTheme: GlobalThemeOverrides = {
  common: {
    ...darkTheme.common,

    /* ========== 主色 (Brand Blue) ========== */

    baseColor: '#ffffff',

    primaryColor: '#3b82f6', // blue-500
    primaryColorHover: '#60a5fa', // blue-400
    primaryColorPressed: '#2563eb', // blue-600
    primaryColorSuppl: '#93c5fd', // blue-300

    /* ========== info (Sky, 区分主色) ========== */

    infoColor: '#0ea5e9', // sky-500
    infoColorHover: '#38bdf8', // sky-400
    infoColorPressed: '#0284c7', // sky-600
    infoColorSuppl: '#7dd3fc', // sky-300

    /* ========== success (emerald) ========== */

    successColor: '#10b981', // emerald-500
    successColorHover: '#34d399', // emerald-400
    successColorPressed: '#059669', // emerald-600
    successColorSuppl: '#6ee7b7', // emerald-300

    /* ========== warning (amber) ========== */

    warningColor: '#f59e0b', // amber-500
    warningColorHover: '#fbbf24', // amber-400
    warningColorPressed: '#d97706', // amber-600
    warningColorSuppl: '#fcd34d', // amber-300

    /* ========== error (red) ========== */

    errorColor: '#ef4444', // red-500
    errorColorHover: '#f87171', // red-400
    errorColorPressed: '#dc2626', // red-600
    errorColorSuppl: '#fca5a5', // red-300

    /* ========== 文本 (Slate) ========== */

    textColorBase: '#f8fafc', // slate-50
    textColor1: '#f8fafc', // slate-50
    textColor2: '#cbd5e1', // slate-300
    textColor3: '#94a3b8', // slate-400
    textColorDisabled: '#64748b', // slate-500

    placeholderColor: '#64748b', // slate-500
    placeholderColorDisabled: '#475569', // slate-600

    iconColor: '#94a3b8', // slate-400
    iconColorHover: '#cbd5e1', // slate-300
    iconColorPressed: '#f1f5f9', // slate-100
    iconColorDisabled: '#475569', // slate-600

    /* ========== 边框 ========== */

    dividerColor: '#334155', // slate-700
    borderColor: '#334155', // slate-700

    /* ========== 操作类 ========== */

    closeIconColor: '#64748b', // slate-500
    closeIconColorHover: '#94a3b8', // slate-400
    closeIconColorPressed: '#cbd5e1', // slate-300

    closeColorHover: 'rgba(148,163,184,0.12)',
    closeColorPressed: 'rgba(148,163,184,0.18)',

    clearColor: '#64748b',
    clearColorHover: '#94a3b8',
    clearColorPressed: '#cbd5e1',

    /* ========== 滚动条 ========== */

    scrollbarColor: 'rgba(148,163,184,0.25)',
    scrollbarColorHover: 'rgba(148,163,184,0.45)',

    /* ========== 轨道 ========== */

    progressRailColor: '#334155',
    railColor: '#334155',

    /* ========== 容器 ========== */

    bodyColor: '#020617', // slate-950
    cardColor: '#0f172a', // slate-900
    modalColor: '#0f172a', // slate-900
    popoverColor: '#0f172a', // slate-900
    tableColor: '#0f172a', // slate-900

    tagColor: '#1e293b', // slate-800
    avatarColor: '#334155', // slate-700
    invertedColor: '#f8fafc', // slate-50

    inputColor: '#0f172a', // slate-900
    inputColorDisabled: '#1e293b', // slate-800

    codeColor: '#1e293b', // slate-800
    tabColor: '#0f172a', // slate-900

    /* ========== 状态 (带主色调) ========== */

    hoverColor: 'rgba(59,130,246,0.10)',
    pressedColor: 'rgba(59,130,246,0.18)',
    actionColor: '#0f172a',

    tableColorHover: 'rgba(59,130,246,0.08)',
    tableColorStriped: '#1e293b',
    tableHeaderColor: '#0f172a',

    /* ========== 次按钮 ========== */

    buttonColor2: '#1e293b', // slate-800
    buttonColor2Hover: '#334155', // slate-700
    buttonColor2Pressed: '#475569', // slate-600

    /* ========== 字体 ========== */

    fontFamily:
      "'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",

    fontFamilyMono: 'Menlo,Monaco,Consolas',
  },
}
