import { type GlobalThemeOverrides } from 'naive-ui'
import { lightTheme } from 'naive-ui'

/**
 * 默认主题
 */
export const defaultTheme: GlobalThemeOverrides = {
  common: {
    // 导入原样式, 只修改颜色
    ...lightTheme.common,
    /* ========== 颜色系统 (Tailwind scale) ========== */

    baseColor: '#ffffff',

    /* primary - blue */
    primaryColor: '#3b82f6', // 500
    primaryColorHover: '#2563eb', // 600
    primaryColorPressed: '#1d4ed8', // 700
    primaryColorSuppl: '#93c5fd', // 300

    /* info - sky */
    infoColor: '#0ea5e9',
    infoColorHover: '#0284c7',
    infoColorPressed: '#0369a1',
    infoColorSuppl: '#7dd3fc',

    /* success - emerald */
    successColor: '#10b981',
    successColorHover: '#059669',
    successColorPressed: '#047857',
    successColorSuppl: '#6ee7b7',

    /* warning - amber */
    warningColor: '#f59e0b',
    warningColorHover: '#d97706',
    warningColorPressed: '#b45309',
    warningColorSuppl: '#fde68a',

    /* error - red */
    errorColor: '#ef4444',
    errorColorHover: '#dc2626',
    errorColorPressed: '#b91c1c',
    errorColorSuppl: '#fca5a5',

    /* neutral - slate */
    textColorBase: '#0f172a', // 900
    textColor1: '#0f172a',
    textColor2: '#334155', // 700
    textColor3: '#64748b', // 500
    textColorDisabled: '#94a3b8',

    placeholderColor: '#94a3b8',
    placeholderColorDisabled: '#cbd5f5',

    iconColor: '#64748b',
    iconColorHover: '#334155',
    iconColorPressed: '#0f172a',
    iconColorDisabled: '#cbd5f5',

    dividerColor: '#e2e8f0', // 200
    borderColor: '#e2e8f0',

    /* 状态背景 */
    hoverColor: '#f1f5f9', // 100
    pressedColor: '#e2e8f0', // 200

    actionColor: '#f1f5f9',

    tableColorHover: '#f8fafc',
    tableColorStriped: '#f1f5f9',
    tableHeaderColor: '#f8fafc',

    /* 容器 */
    bodyColor: '#f8fafc', // 50
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

    /* 按钮 secondary */
    buttonColor2: '#f1f5f9',
    buttonColor2Hover: '#e2e8f0',
    buttonColor2Pressed: '#cbd5f5',

    /* 关闭/清除 */
    closeIconColor: '#94a3b8',
    closeIconColorHover: '#64748b',
    closeIconColorPressed: '#334155',

    closeColorHover: '#f1f5f9',
    closeColorPressed: '#e2e8f0',

    clearColor: '#94a3b8',
    clearColorHover: '#64748b',
    clearColorPressed: '#334155',

    /* ========== 字体系统 ========== */
    fontFamily:
      "'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",
    fontFamilyMono: 'Menlo,Monaco,Consolas',
  },
}
