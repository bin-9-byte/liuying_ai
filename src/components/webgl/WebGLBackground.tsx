import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, useEffect } from 'react'
import { isWebGLSupported } from '@/lib/utils'
import { useAppStore } from '@/store'
import ParticleField from './ParticleField'
import FloatingOrbs from './FloatingOrbs'

export default function WebGLBackground() {
  const webglEnabled = useAppStore((s) => s.webglEnabled)
  const setWebglEnabled = useAppStore((s) => s.setWebglEnabled)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isWebGLSupported()) {
      setWebglEnabled(false)
    }
  }, [setWebglEnabled])

  if (!webglEnabled) {
    // 降级：CSS 径向渐变背景
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(37,99,235,0.12) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(8,145,178,0.1) 0%, transparent 60%)',
          }}
        />
      </div>
    )
  }

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <FloatingOrbs />
          <ParticleField />
        </Suspense>
      </Canvas>

      {/* 顶部渐变遮罩，让内容区域更易阅读 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center top, transparent 0%, rgba(8,8,15,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
