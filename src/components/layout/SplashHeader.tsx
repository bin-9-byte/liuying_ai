import { motion } from 'framer-motion'
import newTitle from '@/assets/icons/品牌logo/new title.svg'

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

/** 将 theme 归一化为 0-1 数值 */
function themeToT(theme: 'dark' | 'light' | number | undefined): number {
  if (theme === undefined || theme === 'dark') return 0
  if (theme === 'light') return 1
  return Math.max(0, Math.min(1, theme))
}

export default function SplashHeader({
  paddingX: _paddingX = 240,
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
  void bgColor

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between header-layout"
      style={{
        padding: '20px clamp(24px, 15vw, 300px)',
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
        <img
          src={newTitle}
          alt="流影AI"
          style={{
            height: 26,
            filter: t < 0.5 ? 'none' : 'invert(1)',
            transition: 'filter 0.3s ease',
          }}
        />
      </motion.div>

      {right && (
        <div style={{ pointerEvents: 'auto' }}>
          {right}
        </div>
      )}
    </div>
  )
}
