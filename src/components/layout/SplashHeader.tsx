import { motion } from 'framer-motion'

interface SplashHeaderProps {
  /** 左右 padding，默认 240 */
  paddingX?: number
  /** 是否禁用鼠标事件（透传给背景），默认 true */
  pointerEventsNone?: boolean
  /** 右侧插槽 */
  right?: React.ReactNode
  /** 是否显示黑色背景 */
  showBackground?: boolean
  /**
   * 主题色模式：
   * 'dark'  → 白色 logo/文字/按钮（默认）
   * 'light' → 黑色 logo/文字/按钮
   * 0-1 数值 → 在 dark/light 之间插值（1 = 完全 light）
   */
  theme?: 'dark' | 'light' | number
}

/** rgba helper: 在 #FFFFFF 和 #111111 之间插值 */
function interpolateColor(t: number, dark: string, light: string) {
  return t < 0.5 ? dark : light
}

/** 将 theme 归一化为 0-1 数值 */
function themeToT(theme: 'dark' | 'light' | number | undefined): number {
  if (theme === undefined || theme === 'dark') return 0
  if (theme === 'light') return 1
  return Math.max(0, Math.min(1, theme))
}

export default function SplashHeader({
  paddingX = 240,
  pointerEventsNone = true,
  right,
  showBackground = false,
  theme,
}: SplashHeaderProps) {
  const t = themeToT(theme)

  // logo fill：白 → 黑
  const logoFill = t < 0.5 ? '#FFFFFF' : '#111111'
  // 文字颜色
  const textColor = t < 0.5 ? '#f0f0f5' : '#111111'
  // 背景
  const bgColor = showBackground
    ? t < 0.5
      ? '#08080f'
      : '#FFFFFF'
    : 'transparent'

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between header-layout"
      style={{
        padding: '20px 300px',
        pointerEvents: pointerEventsNone ? 'none' : 'auto',
        background: 'transparent',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <motion.div
        className="flex items-center gap-3 select-none"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        style={{ transition: 'color 0.3s ease' }}
      >
        <svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.7793 29.8082C23.4446 30.3031 22.8865 30.6001 22.2891 30.6002H7.20117L13.2881 21.6002H16.8887C17.4862 21.6002 18.0451 21.3032 18.3799 20.8082L22.7139 14.4H34.2012L23.7793 29.8082ZM22.7139 14.4H19.1133C18.5157 14.4 17.9569 14.697 17.6221 15.192L13.2881 21.6002H1.80078L12.2217 6.19202C12.5565 5.69702 13.1153 5.40004 13.7129 5.40002H28.8008L22.7139 14.4Z"
            fill={logoFill}
            style={{ transition: 'fill 0.3s ease' }}
          />
        </svg>
        <span
          className="text-xl font-semibold"
          style={{ color: textColor, letterSpacing: '0.04em', transition: 'color 0.3s ease' }}
        >
          流影AI
        </span>
      </motion.div>

      {right && (
        <div style={{ pointerEvents: 'auto' }}>
          {right}
        </div>
      )}
    </div>
  )
}
