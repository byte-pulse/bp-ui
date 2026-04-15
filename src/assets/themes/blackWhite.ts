import { type GlobalThemeOverrides } from 'naive-ui'
import { lightTheme } from 'naive-ui'

/**
 * 白底 + 黑主色主题 (完整补全版)
 */
export const blackWhiteTheme: GlobalThemeOverrides = {
  common: {
    ...lightTheme.common,

    /* ========== 主色 ========== */

    baseColor: '#ffffff',

    primaryColor: '#111111',
    primaryColorHover: '#000000',
    primaryColorPressed: '#000000',
    primaryColorSuppl: '#525252',

    infoColor: '#374151',
    infoColorHover: '#1f2937',
    infoColorPressed: '#111827',
    infoColorSuppl: '#9ca3af',

    successColor: '#16a34a',
    successColorHover: '#15803d',
    successColorPressed: '#166534',
    successColorSuppl: '#86efac',

    warningColor: '#d97706',
    warningColorHover: '#b45309',
    warningColorPressed: '#92400e',
    warningColorSuppl: '#fcd34d',

    errorColor: '#dc2626',
    errorColorHover: '#b91c1c',
    errorColorPressed: '#991b1b',
    errorColorSuppl: '#fca5a5',

    /* ========== 文本系统 ========== */

    textColorBase: '#111111',
    textColor1: '#000000',
    textColor2: '#374151',
    textColor3: '#6b7280',
    textColorDisabled: '#9ca3af',

    placeholderColor: '#9ca3af',
    placeholderColorDisabled: '#d1d5db',

    iconColor: '#6b7280',
    iconColorHover: '#111111',
    iconColorPressed: '#000000',
    iconColorDisabled: '#d1d5db',

    /* ========== 边框 / 分割 ========== */

    dividerColor: '#e5e7eb',
    borderColor: '#e5e7eb',

    /* ========== 关闭 / 清除 ========== */

    closeIconColor: '#9ca3af',
    closeIconColorHover: '#374151',
    closeIconColorPressed: '#111111',

    closeColorHover: '#f5f5f5',
    closeColorPressed: '#e5e5e5',

    clearColor: '#9ca3af',
    clearColorHover: '#374151',
    clearColorPressed: '#111111',

    /* ========== 滚动条 ========== */

    scrollbarColor: '#d4d4d4',
    scrollbarColorHover: '#a3a3a3',

    /* ========== 轨道 ========== */

    progressRailColor: '#e5e5e5',
    railColor: '#e5e5e5',

    /* ========== 容器 ========== */

    bodyColor: '#ffffff',
    cardColor: '#fafafa',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    tableColor: '#ffffff',

    tagColor: '#f5f5f5',
    avatarColor: '#e5e5e5',
    invertedColor: '#111111',

    inputColor: '#ffffff',
    inputColorDisabled: '#f5f5f5',

    codeColor: '#f5f5f5',
    tabColor: '#fafafa',

    /* ========== 状态 ========== */

    hoverColor: '#f5f5f5',
    pressedColor: '#e5e5e5',
    actionColor: '#fafafa',

    tableColorHover: 'rgba(0,0,0,0.03)',
    tableColorStriped: '#f5f5f5',
    tableHeaderColor: '#f9fafb',

    /* ========== secondary 按钮 ========== */

    buttonColor2: '#f5f5f5',
    buttonColor2Hover: '#e5e5e5',
    buttonColor2Pressed: '#d4d4d4',

    /* ========== 字体 ========== */

    fontFamily:
      "'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",
    fontFamilyMono: 'Menlo,Monaco,Consolas',
  },
}
