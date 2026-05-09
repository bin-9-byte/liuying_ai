import { Link, useLocation } from 'react-router-dom'
import { Sparkles, History, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/home', label: 'Home', icon: null },
  { to: '/home/studio', label: 'Studio', icon: <Sparkles size={15} /> },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ height: 'var(--spacing-navbar)' }}
    >
      {/* 毛玻璃背景 */}
      <div className="absolute inset-0 glass border-b border-white/5" />

      <nav className="relative flex items-center justify-between h-full px-6 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-shadow duration-300">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight gradient-text">
            DesignAI
          </span>
        </Link>

        {/* 桌面端导航 */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                pathname === to
                  ? 'text-white bg-white/10'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )}
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>

        {/* 右侧操作区 */}
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200">
            <History size={14} />
            History
          </button>
          <button className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200">
            <Settings size={16} />
          </button>
          {/* 用户头像占位 */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 cursor-pointer" />
        </div>

        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden p-2 text-white/60 hover:text-white"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* 移动端下拉菜单 */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 glass border-b border-white/5 p-4 md:hidden"
          >
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                {icon}
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
