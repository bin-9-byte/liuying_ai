import { motion } from 'framer-motion'

interface SplashHeaderProps {
  /** 左右 padding，默认 300 */
  paddingX?: number
  /** 是否禁用鼠标事件（透传给背景），默认 true */
  pointerEventsNone?: boolean
  /** 右侧插槽 */
  right?: React.ReactNode
}

export default function SplashHeader({
  paddingX = 240,
  pointerEventsNone = true,
  right,
}: SplashHeaderProps) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between"
      style={{ padding: `20px ${paddingX}px`, pointerEvents: pointerEventsNone ? 'none' : 'auto' }}
    >
      <motion.div
        className="flex items-center gap-3 select-none"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.7793 29.8082C23.4446 30.3031 22.8865 30.6001 22.2891 30.6002H7.20117L13.2881 21.6002H16.8887C17.4862 21.6002 18.0451 21.3032 18.3799 20.8082L22.7139 14.4H34.2012L23.7793 29.8082ZM22.7139 14.4H19.1133C18.5157 14.4 17.9569 14.697 17.6221 15.192L13.2881 21.6002H1.80078L12.2217 6.19202C12.5565 5.69702 13.1153 5.40004 13.7129 5.40002H28.8008L22.7139 14.4Z" fill="white"/>
        </svg>
        <span
          className="text-xl font-semibold"
          style={{ color: '#f0f0f5', letterSpacing: '0.04em' }}
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
