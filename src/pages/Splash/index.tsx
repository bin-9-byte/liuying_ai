import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Dither from '@/components/webgl/Dither'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [exiting, setExiting] = useState(false)
  const [dParams, setDParams] = useState({
    waveSpeed: 0.08,
    waveFrequency: 2,
    waveAmplitude: 0.18,
    waveColor: [0.435, 0.435, 0.435] as [number, number, number],
    colorNum: 4.3,
    pixelSize: 3,
    disableAnimation: false,
    enableMouseInteraction: true,
    mouseRadius: 0.4,
  })

  const handleGetStarted = () => {
    setExiting(true)
  }

  return (
    <AnimatePresence
      onExitComplete={() => navigate('/home', { replace: true })}
    >
      {!exiting && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: '#08080f' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* 调试控制面板（将 false 改为 true 以启用调试）*/}
          {false && (
            <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 999, background: 'rgba(0,0,0,0.75)', padding: '12px 16px', borderRadius: 10, color: '#fff', fontSize: 12, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Dither 参数调试</div>
              {([
                { key: 'waveSpeed', min: 0, max: 1, step: 0.01 },
                { key: 'waveFrequency', min: 0.5, max: 10, step: 0.1 },
                { key: 'waveAmplitude', min: 0, max: 1, step: 0.01 },
                { key: 'colorNum', min: 2, max: 16, step: 0.1 },
                { key: 'pixelSize', min: 1, max: 10, step: 0.5 },
                { key: 'mouseRadius', min: 0, max: 3, step: 0.05 },
              ] as { key: keyof typeof dParams; min: number; max: number; step: number }[]).map(({ key, min, max, step }) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span>{key}: {(dParams[key] as number).toFixed(2)}</span>
                  <input type="range" min={min} max={max} step={step} value={dParams[key] as number}
                    onChange={e => setDParams(p => ({ ...p, [key]: +e.target.value }))} style={{ width: '100%' }} />
                </label>
              ))}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={dParams.disableAnimation}
                  onChange={e => setDParams(p => ({ ...p, disableAnimation: e.target.checked }))} />
                disableAnimation
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={dParams.enableMouseInteraction}
                  onChange={e => setDParams(p => ({ ...p, enableMouseInteraction: e.target.checked }))} />
                enableMouseInteraction
              </label>
            </div>
          )}

          {/* Dither 背景 */}
          <div className="absolute inset-0">
            <Dither {...dParams} />
          </div>

          {/* Logo + 文字 */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 select-none"
            style={{ pointerEvents: 'none' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          >
            {/* Logo 图标 */}
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.7793 29.8082C23.4446 30.3031 22.8865 30.6001 22.2891 30.6002H7.20117L13.2881 21.6002H16.8887C17.4862 21.6002 18.0451 21.3032 18.3799 20.8082L22.7139 14.4H34.2012L23.7793 29.8082ZM22.7139 14.4H19.1133C18.5157 14.4 17.9569 14.697 17.6221 15.192L13.2881 21.6002H1.80078L12.2217 6.19202C12.5565 5.69702 13.1153 5.40004 13.7129 5.40002H28.8008L22.7139 14.4Z" fill="white"/>
              </svg>
            </motion.div>

            {/* 品牌名 */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <span
                className="text-3xl font-semibold tracking-wide"
                style={{ color: '#f0f0f5', letterSpacing: '0.06em' }}
              >
                流影AI
              </span>
              <span
                className="text-sm font-normal tracking-widest uppercase"
                style={{ color: 'rgba(240,240,245,0.45)', letterSpacing: '0.2em' }}
              >
                灵感即画面
              </span>
            </motion.div>
          </motion.div>

          {/* 底部 Get Started 按钮 */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            style={{ pointerEvents: 'none' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button
              onClick={handleGetStarted}
              className="group relative px-8 py-3.5 rounded-full font-medium text-sm tracking-wide overflow-hidden"
              style={{
                pointerEvents: 'auto',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#f0f0f5',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* 按钮光效 */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                }}
              />
              
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
