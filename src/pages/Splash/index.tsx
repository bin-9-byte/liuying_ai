import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Dither from '@/components/webgl/Dither'
import SplashHeader from '@/components/layout/SplashHeader'

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
      onExitComplete={() => navigate('/home')}
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

          {/* 顶部 Header */}
          <SplashHeader />

          {/* 中间大文案 + 按钮 */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-5 select-none"
            style={{ pointerEvents: 'none' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
          >
            <h1
              className="text-6xl font-bold text-center leading-tight"
              style={{ color: '#f0f0f5', letterSpacing: '-0.01em' }}
            >
              灵感, 即画面
            </h1>
            <p
              className="text-l text-center"
              style={{ color: 'rgba(240,240,245,0.55)', letterSpacing: '0.02em' }}
            >
              让好创意，更快被看见
            </p>

            {/* 开始按钮 */}
            <motion.button
              onClick={handleGetStarted}
              className="group relative overflow-hidden rounded-3xl font-medium text-sm tracking-wide"
              style={{
                pointerEvents: 'auto',
                width: 164,
                height: 58,
                background: '#FFFFFF',
                color: '#111111',
                border: 'none',
                marginTop: 36,
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'rgba(0,0,0,0.06)' }}
              />
              <span className="relative flex items-center justify-center gap-2 text-base font-semibold">
                即刻开始
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
