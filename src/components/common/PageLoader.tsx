import { Loader2 } from 'lucide-react'

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="text-violet-400 animate-spin" />
        <p className="text-xs text-white/30">Loading...</p>
      </div>
    </div>
  )
}
