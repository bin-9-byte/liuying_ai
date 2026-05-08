import { motion } from 'framer-motion'
import { MessageSquare, Clock, Trash2 } from 'lucide-react'
import { useStudioStore } from '../store'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function HistorySidebar() {
  const history = useStudioStore((s) => s.history)
  const setPrompt = useStudioStore((s) => s.setPrompt)

  return (
    <aside className="flex flex-col h-full overflow-hidden">
      {/* 标题 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
        <Clock size={14} className="text-white/40" />
        <span className="text-xs font-medium text-white/60">History</span>
        {history.length > 0 && (
          <span className="ml-auto text-[10px] text-white/20 font-mono">{history.length}</span>
        )}
      </div>

      {/* 历史列表 */}
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4">
            <MessageSquare size={20} className="text-white/10" />
            <p className="text-xs text-white/20 text-center">No history yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-px p-2">
            {history.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setPrompt(item.prompt)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-left',
                  'hover:bg-white/[0.05] transition-all duration-150 group w-full'
                )}
              >
                {/* 缩略图 */}
                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.05]">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* 文字信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 truncate leading-snug group-hover:text-white/90 transition-colors">
                    {item.prompt}
                  </p>
                  <p className="text-[10px] text-white/25 mt-0.5">
                    {formatRelativeTime(item.createdAt)}
                  </p>
                </div>

                {/* 删除按钮（hover 显示） */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400 transition-all"
                >
                  <Trash2 size={11} />
                </button>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
