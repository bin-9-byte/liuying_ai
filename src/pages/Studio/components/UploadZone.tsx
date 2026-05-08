import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImagePlus, AlertCircle } from 'lucide-react'
import { useStudioStore } from '../store'
import { cn, formatFileSize } from '@/lib/utils'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default function UploadZone() {
  const addImage = useStudioStore((s) => s.addImage)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndAdd = useCallback(
    async (files: FileList | File[]) => {
      setError(null)
      const fileArr = Array.from(files)
      for (const file of fileArr) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setError('Unsupported format. PNG, JPG, WebP, SVG only.')
          return
        }
        if (file.size > MAX_SIZE) {
          setError(`File too large. Max ${formatFileSize(MAX_SIZE)}.`)
          return
        }
        await addImage(file)
      }
    },
    [addImage]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length) {
      validateAndAdd(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      validateAndAdd(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        className={cn(
          'relative rounded-xl border border-dashed cursor-pointer transition-all duration-200 overflow-hidden',
          'flex flex-col items-center justify-center gap-2 py-6 px-4',
          isDragging
            ? 'border-violet-400/70 bg-violet-500/10'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
        )}
        style={
          isDragging
            ? {
                boxShadow:
                  '0 0 0 1px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.2), inset 0 0 20px rgba(124,58,237,0.05)',
              }
            : {}
        }
      >
        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-col items-center gap-1"
            >
              <Upload size={20} className="text-violet-400" />
              <p className="text-xs text-violet-300 font-medium">Drop to add reference</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1"
            >
              <ImagePlus size={18} className="text-white/25" />
              <p className="text-xs text-white/30">Add reference image</p>
              <p className="text-[10px] text-white/15">PNG, JPG, WebP · Max 10MB</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 拖拽时的四角光效 */}
        {isDragging && (
          <>
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-violet-400 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-violet-400 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-violet-400 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-violet-400 rounded-br-xl" />
          </>
        )}
      </motion.div>

      {/* 错误提示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-xs text-red-400/80"
          >
            <AlertCircle size={11} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  )
}
