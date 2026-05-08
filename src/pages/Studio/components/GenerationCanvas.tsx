import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, RefreshCw, Copy, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useStudioStore } from '../store'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import type { GeneratedItem } from '@/types'

// ── Loading 粒子汇聚动画 ──
function ConvergingParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry } = useMemo(() => {
    const count = 300
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 2 + 0.5
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
      phases[i] = Math.random() * Math.PI * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return { geometry: geo }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const phaseAttr = pointsRef.current.geometry.attributes.aPhase as THREE.BufferAttribute
    for (let i = 0; i < posAttr.count; i++) {
      const phase = phaseAttr.getX(i)
      const progress = (Math.sin(t * 0.8 + phase) + 1) / 2
      const angle = phase + t * 0.5
      const radius = (1 - progress) * 1.5 + 0.1
      posAttr.setX(i, Math.cos(angle) * radius)
      posAttr.setY(i, Math.sin(angle) * radius)
    }
    posAttr.needsUpdate = true
    pointsRef.current.rotation.z = t * 0.1
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#a855f7"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ── 单张结果图卡片 ──
function ResultCard({ item, isSelected, onClick }: { item: GeneratedItem; isSelected: boolean; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={cn(
        'relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group',
        isSelected
          ? 'ring-2 ring-violet-500/80 ring-offset-2 ring-offset-transparent'
          : 'hover:ring-1 hover:ring-white/20'
      )}
    >
      <img
        src={item.url}
        alt={item.prompt}
        className="w-full h-full object-cover aspect-square block"
        loading="lazy"
      />
      {/* hover 操作覆层 */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); window.open(item.url, '_blank') }}
          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/80 hover:text-white"
        >
          <Download size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(item.url) }}
          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/80 hover:text-white"
        >
          <Copy size={14} />
        </button>
      </div>
    </motion.div>
  )
}

export default function GenerationCanvas() {
  const generationStatus = useStudioStore((s) => s.generationStatus)
  const progressMessage = useStudioStore((s) => s.progressMessage)
  const results = useStudioStore((s) => s.results)
  const selectedResultId = useStudioStore((s) => s.selectedResultId)
  const selectResult = useStudioStore((s) => s.selectResult)
  const clearResults = useStudioStore((s) => s.clearResults)
  const generate = useStudioStore((s) => s.generate)

  const selectedIndex = results.findIndex((r) => r.id === selectedResultId)

  const isGenerating = generationStatus === 'thinking' || generationStatus === 'generating'

  return (
    <div className="flex flex-col h-full gap-4">
      {/* 主展示区 */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06] min-h-0">
        <AnimatePresence mode="wait">
          {/* Loading 状态 */}
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              {/* Three.js 粒子动画 */}
              <div className="w-32 h-32">
                <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ alpha: true }}>
                  <Suspense fallback={null}>
                    <ConvergingParticles />
                  </Suspense>
                </Canvas>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-white/60 font-medium">
                  {generationStatus === 'thinking' ? 'Thinking...' : 'Generating...'}
                </p>
                {progressMessage && (
                  <motion.p
                    key={progressMessage}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-white/30"
                  >
                    {progressMessage}
                  </motion.p>
                )}
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-violet-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 空状态 */}
          {!isGenerating && results.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Loader2 size={24} className="text-white/15" />
              </div>
              <p className="text-sm text-white/25">Your generations will appear here</p>
              <p className="text-xs text-white/15">Enter a prompt and press ⌘ Enter</p>
            </motion.div>
          )}

          {/* 生成结果展示 */}
          {!isGenerating && results.length > 0 && selectedResultId && (
            <motion.div
              key={selectedResultId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={results.find((r) => r.id === selectedResultId)?.url}
                alt="Generated result"
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 翻页箭头 */}
        {results.length > 1 && (
          <>
            <button
              onClick={() => selectResult(results[Math.max(0, selectedIndex - 1)].id)}
              disabled={selectedIndex <= 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => selectResult(results[Math.min(results.length - 1, selectedIndex + 1)].id)}
              disabled={selectedIndex >= results.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* 缩略图列表 */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2"
          >
            <div className="flex gap-2 flex-1 overflow-x-auto">
              {results.map((item) => (
                <div key={item.id} className="w-16 h-16 flex-shrink-0">
                  <ResultCard
                    item={item}
                    isSelected={item.id === selectedResultId}
                    onClick={() => selectResult(item.id)}
                  />
                </div>
              ))}
            </div>

            {/* 重新生成 */}
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={generate}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs text-white/60 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
              >
                <RefreshCw size={12} />
                Regenerate
              </button>
              <button
                onClick={clearResults}
                className="h-8 px-2 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
