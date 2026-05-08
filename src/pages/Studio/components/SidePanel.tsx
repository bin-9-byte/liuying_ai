import { motion } from 'framer-motion'
import { Sliders, Square, Wand2 } from 'lucide-react'
import { useStudioStore } from '../store'
import { cn } from '@/lib/utils'
import type { StyleParams } from '@/types'

// ── 选项按钮组 ──
function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-white/30 font-medium uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              value === opt.value
                ? 'bg-violet-600/80 text-white border border-violet-500/50'
                : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/70 hover:bg-white/[0.07]'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── 滑块 ──
function SliderControl({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/30 font-medium uppercase tracking-wider">{label}</p>
        <span className="text-[11px] text-white/40 font-mono">{value}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5"
        style={{ position: 'relative', marginTop: -20 }}
      />
    </div>
  )
}

export default function SidePanel() {
  const styleParams = useStudioStore((s) => s.styleParams)
  const updateStyleParams = useStudioStore((s) => s.updateStyleParams)

  const update = <K extends keyof StyleParams>(key: K) =>
    (value: StyleParams[K]) => updateStyleParams({ [key]: value })

  return (
    <aside className="flex flex-col h-full overflow-hidden">
      {/* 面板标题 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
        <Sliders size={14} className="text-white/40" />
        <span className="text-xs font-medium text-white/60">Style Settings</span>
      </div>

      {/* 参数内容 */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* Style */}
        <OptionGroup
          label="Style"
          value={styleParams.style}
          onChange={update('style')}
          options={[
            { value: 'realistic', label: 'Realistic' },
            { value: 'illustration', label: 'Illustration' },
            { value: 'abstract', label: 'Abstract' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'cinematic', label: 'Cinematic' },
          ]}
        />

        {/* Format */}
        <OptionGroup
          label="Format"
          value={styleParams.format}
          onChange={update('format')}
          options={[
            { value: 'square', label: '1:1' },
            { value: 'landscape', label: '16:9' },
            { value: 'portrait', label: '9:16' },
            { value: 'banner', label: 'Banner' },
            { value: 'thumbnail', label: 'Thumb' },
          ]}
        />

        {/* Color Tone */}
        <OptionGroup
          label="Color Tone"
          value={styleParams.colorTone}
          onChange={update('colorTone')}
          options={[
            { value: 'auto', label: 'Auto' },
            { value: 'warm', label: 'Warm' },
            { value: 'cool', label: 'Cool' },
            { value: 'monochrome', label: 'Mono' },
            { value: 'vibrant', label: 'Vibrant' },
          ]}
        />

        {/* Quality */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] text-white/30 font-medium uppercase tracking-wider">Quality</p>
          <div className="flex gap-1.5">
            {(['draft', 'standard', 'hd'] as StyleParams['quality'][]).map((q) => (
              <button
                key={q}
                onClick={() => update('quality')(q)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs transition-all',
                  styleParams.quality === q
                    ? 'bg-violet-600/80 text-white border border-violet-500/50'
                    : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/70 hover:bg-white/[0.07]'
                )}
              >
                {q === 'hd' && <Wand2 size={12} />}
                {q === 'standard' && <Square size={12} />}
                {q === 'draft' && <Square size={12} className="opacity-50" />}
                <span className="capitalize">{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reference Strength */}
        <SliderControl
          label="Reference Strength"
          value={styleParams.strength}
          onChange={update('strength')}
        />

        {/* 分隔线 */}
        <div className="border-t border-white/[0.05]" />

        {/* Seed 信息（只读展示） */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] text-white/30 font-medium uppercase tracking-wider">Seed</p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <span className="text-xs text-white/30 font-mono flex-1">Random</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
