import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeft, PanelRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import PromptInput from './components/PromptInput'
import UploadZone from './components/UploadZone'
import GenerationCanvas from './components/GenerationCanvas'
import SidePanel from './components/SidePanel'
import HistorySidebar from './components/HistorySidebar'
import { useStudioStore } from './store'
import { cn } from '@/lib/utils'

export default function StudioPage() {
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)
  const generationStatus = useStudioStore((s) => s.generationStatus)
  const isGenerating = generationStatus === 'thinking' || generationStatus === 'generating'

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-base">
      {/* ── 顶部 Navbar（Studio 专属） ── */}
      <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 border-b border-white/[0.05] bg-black/20 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-xs font-semibold gradient-text">DesignAI</span>
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-xs text-white/30">Studio</span>
        </div>

        <div className="flex items-center gap-2">
          {/* 生成状态指示 */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25"
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-[11px] text-violet-300">Generating</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 面板切换按钮 */}
          <button
            onClick={() => setLeftOpen((v) => !v)}
            className={cn(
              'p-1.5 rounded-lg transition-all duration-200 text-sm',
              leftOpen ? 'text-white/60 bg-white/[0.07]' : 'text-white/25 hover:text-white/50 hover:bg-white/[0.04]'
            )}
            title="Toggle history panel"
          >
            <PanelLeft size={15} />
          </button>
          <button
            onClick={() => setRightOpen((v) => !v)}
            className={cn(
              'p-1.5 rounded-lg transition-all duration-200 text-sm',
              rightOpen ? 'text-white/60 bg-white/[0.07]' : 'text-white/25 hover:text-white/50 hover:bg-white/[0.04]'
            )}
            title="Toggle settings panel"
          >
            <PanelRight size={15} />
          </button>
        </div>
      </header>

      {/* ── 主体三栏布局 ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* 左侧历史记录面板 */}
        <AnimatePresence initial={false}>
          {leftOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 overflow-hidden border-r border-white/[0.05] bg-black/10"
              style={{ width: 240 }}
            >
              <div className="w-[240px] h-full">
                <HistorySidebar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 中间主画布 + Prompt 输入区 */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* 生成结果展示区 */}
          <div className="flex-1 min-h-0 p-4 overflow-hidden">
            <GenerationCanvas />
          </div>

          {/* 底部输入区 */}
          <div className="flex-shrink-0 border-t border-white/[0.05] bg-black/10 backdrop-blur-xl">
            <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-3">
              {/* 上传区 */}
              <UploadZone />
              {/* Prompt 输入 */}
              <PromptInput />
            </div>
          </div>
        </div>

        {/* 右侧参数面板 */}
        <AnimatePresence initial={false}>
          {rightOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 overflow-hidden border-l border-white/[0.05] bg-black/10"
              style={{ width: 280 }}
            >
              <div className="w-[280px] h-full">
                <SidePanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
