import { type GlobalThemeOverrides } from 'naive-ui'
import { lightTheme } from 'naive-ui'

/**
 * 高级冷调蓝主题
 */
export const defaultTheme: GlobalThemeOverrides = {
  common: {
    ...lightTheme.common,

    /* ========== 主色(高级蓝) ========== */

    baseColor: '#ffffff',

    primaryColor: '#2563eb', // 更深一点的蓝
    primaryColorHover: '#1d4ed8',
    primaryColorPressed: '#1e40af',
    primaryColorSuppl: '#93c5fd',

    /* info (稍微偏青一点) */
    infoColor: '#3b82f6',
    infoColorHover: '#2563eb',
    infoColorPressed: '#1d4ed8',
    infoColorSuppl: '#bfdbfe',

    /* success */
    successColor: '#059669',
    successColorHover: '#047857',
    successColorPressed: '#065f46',
    successColorSuppl: '#6ee7b7',

    /* warning */
    warningColor: '#d97706',
    warningColorHover: '#b45309',
    warningColorPressed: '#92400e',
    warningColorSuppl: '#fcd34d',

    /* error */
    errorColor: '#dc2626',
    errorColorHover: '#b91c1c',
    errorColorPressed: '#991b1b',
    errorColorSuppl: '#fca5a5',

    /* ========== 文本(偏冷灰) ========== */

    textColorBase: '#0b1220',
    textColor1: '#0b1220',
    textColor2: '#334155',
    textColor3: '#64748b',
    textColorDisabled: '#94a3b8',

    placeholderColor: '#94a3b8',
    placeholderColorDisabled: '#cbd5e1',

    iconColor: '#64748b',
    iconColorHover: '#1e293b',
    iconColorPressed: '#0b1220',
    iconColorDisabled: '#cbd5e1',

    /* ========== 边框(更细腻) ========== */

    dividerColor: '#e6eaf0',
    borderColor: '#e6eaf0',

    /* ========== 关闭 / 清除 ========== */

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

    bodyColor: '#f6f8fb', // 微微带蓝灰
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    tableColor: '#ffffff',

    tagColor: '#f1f5f9',
    avatarColor: '#e2e8f0',
    invertedColor: '#0b1220',

    inputColor: '#ffffff',
    inputColorDisabled: '#f1f5f9',

    codeColor: '#f1f5f9',
    tabColor: '#f8fafc',

    /* ========== 状态(关键优化) ========== */

    hoverColor: 'rgba(37,99,235,0.06)', // 带主色!!!
    pressedColor: 'rgba(37,99,235,0.12)',
    actionColor: '#f8fafc',

    tableColorHover: 'rgba(37,99,235,0.05)',
    tableColorStriped: '#f1f5f9',
    tableHeaderColor: '#f8fafc',

    /* ========== 按钮 secondary ========== */

    buttonColor2: '#f1f5f9',
    buttonColor2Hover: '#e2e8f0',
    buttonColor2Pressed: '#cbd5e1',

    /* ========== 字体 ========== */

    fontFamily:
      "'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif",

    fontFamilyMono: 'Menlo,Monaco,Consolas',
  },
}
