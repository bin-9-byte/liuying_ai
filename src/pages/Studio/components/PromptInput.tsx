import { useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Square, Sparkles, X } from 'lucide-react'
import { useStudioStore } from '../store'
import { cn } from '@/lib/utils'

export default function PromptInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const prompt = useStudioStore((s) => s.prompt)
  const setPrompt = useStudioStore((s) => s.setPrompt)
  const uploadedImages = useStudioStore((s) => s.uploadedImages)
  const removeImage = useStudioStore((s) => s.removeImage)
  const generationStatus = useStudioStore((s) => s.generationStatus)
  const generate = useStudioStore((s) => s.generate)
  const cancelGeneration = useStudioStore((s) => s.cancelGeneration)

  const isGenerating = generationStatus === 'thinking' || generationStatus === 'generating'

  // 自动调整高度
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 180) + 'px'
  }, [prompt])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!isGenerating && prompt.trim()) generate()
    }
  }

  const handleSubmit = () => {
    if (isGenerating) {
      cancelGeneration()
    } else if (prompt.trim()) {
      generate()
    }
  }

  return (
    <div className="relative w-full">
      <motion.div
        className={cn(
          'relative rounded-2xl transition-all duration-300 overflow-hidden',
          'bg-white/[0.04] border border-white/[0.08]',
          isGenerating && 'border-violet-500/40'
        )}
        animate={isGenerating ? { boxShadow: ['0 0 0 1px rgba(124,58,237,0.3)', '0 0 20px rgba(124,58,237,0.4)', '0 0 0 1px rgba(124,58,237,0.3)'] } : { boxShadow: '0 0 0 0px transparent' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* 已上传图片预览 */}
        <AnimatePresence>
          {uploadedImages.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-2 px-4 pt-3 overflow-x-auto"
            >
              {uploadedImages.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative flex-shrink-0 group"
                >
                  <img
                    src={img.previewUrl}
                    alt="reference"
                    className="w-12 h-12 rounded-lg object-cover border border-white/10"
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-black/80 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={8} className="text-white" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 文本输入区 */}
        <div className="flex items-end gap-3 p-4">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the design you want to create..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/25 resize-none outline-none leading-relaxed"
            style={{ maxHeight: 180, minHeight: 22 }}
          />

          {/* 提交按钮 */}
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
              isGenerating
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : prompt.trim()
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:bg-violet-500'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
            )}
          >
            {isGenerating ? (
              <Square size={14} fill="currentColor" />
            ) : (
              <Send size={14} />
            )}
          </motion.button>
        </div>

        {/* 底部提示栏 */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-1 text-xs text-white/20">
            <Sparkles size={11} />
            <span>⌘ Enter to generate</span>
          </div>
          <span className="text-xs text-white/15">{prompt.length}</span>
        </div>
      </motion.div>
    </div>
  )
}
