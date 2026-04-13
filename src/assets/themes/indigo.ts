import { type GlobalThemeOverrides } from 'naive-ui'
import { lightTheme } from 'naive-ui'

/**
 * indigo主题
 */
export const indigoTheme: GlobalThemeOverrides = {
  common: {
    ...lightTheme.common,

    /* ========== 颜色系统 (indigo/violet) ========== */

    baseColor: '#ffffff',

    /* primary - indigo */
    primaryColor: '#6366f1', // indigo-500
    primaryColorHover: '#4f46e5', // indigo-600
    primaryColorPressed: '#4338ca', // indigo-700
    primaryColorSuppl: '#a5b4fc', // indigo-300

    /* info - violet */
    infoColor: '#8b5cf6', // violet-500
    infoColorHover: '#7c3aed', // violet-600
    infoColorPressed: '#6d28d9', // violet-700
    infoColorSuppl: '#c4b5fd', // violet-300

    /* success - blue (改掉绿色!) */
    successColor: '#3b82f6',
    successColorHover: '#2563eb',
    successColorPressed: '#1d4ed8',
    successColorSuppl: '#93c5fd',

    /* warning - orange */
    warningColor: '#f97316', // orange-500
    warningColorHover: '#ea580c', // orange-600
    warningColorPressed: '#c2410c', // orange-700
    warningColorSuppl: '#fdba74',

    /* error - rose */
    errorColor: '#f43f5e', // rose-500
    errorColorHover: '#e11d48',
    errorColorPressed: '#be123c',
    errorColorSuppl: '#fda4af',

    /* ========== neutral (稍微冷一点) ========== */

    textColorBase: '#0f172a',
    textColor1: '#0f172a',
    textColor2: '#334155',
    textColor3: '#64748b',
    textColorDisabled: '#94a3b8',

    placeholderColor: '#94a3b8',
    placeholderColorDisabled: '#cbd5f5',

    iconColor: '#64748b',
    iconColorHover: '#334155',
    iconColorPressed: '#0f172a',
    iconColorDisabled: '#cbd5f5',

    dividerColor: '#e2e8f0',
    borderColor: '#e2e8f0',

    /* 状态层 */
    hoverColor: '#f8fafc', // 更轻一点
    pressedColor: '#f1f5f9',

    actionColor: '#f8fafc',

    tableColorHover: '#f8fafc',
    tableColorStriped: '#f1f5f9',
    tableHeaderColor: '#f8fafc',

    /* 容器 */
    bodyColor: '#f8fafc',
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

    /* 滚动条 */
    scrollbarColor: '#cbd5f5',
    scrollbarColorHover: '#94a3b8',

    /* 轨道 */
    progressRailColor: '#e2e8f0',
    railColor: '#e2e8f0',

    /* secondary button */
    buttonColor2: '#f8fafc',
    buttonColor2Hover: '#f1f5f9',
    buttonColor2Pressed: '#e2e8f0',

    /* close / clear */
    closeIconColor: '#94a3b8',
    closeIconColorHover: '#64748b',
    closeIconColorPressed: '#334155',

    closeColorHover: '#f8fafc',
    closeColorPressed: '#f1f5f9',

    clearColor: '#94a3b8',
    clearColorHover: '#64748b',
    clearColorPressed: '#334155',
  },
}
