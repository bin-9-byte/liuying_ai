import { Outlet, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './Navbar'

const WebGLBackground = lazy(() => import('@/components/webgl/WebGLBackground'))

export default function AppLayout() {
  const { pathname } = useLocation()
  const isStudio = pathname.startsWith('/home/studio')
  const isHome = pathname === '/home'

  // 首页有自己的浅色布局，不使用全局深色背景和顶部 Navbar
  if (isHome) {
    return <Outlet />
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#08080f', color: '#f0f0f5' }}>
      {/* 全局 WebGL 背景层（非首页） */}
      <Suspense fallback={null}>
        <WebGLBackground />
      </Suspense>

      {/* 导航栏 */}
      <Navbar />

      {/* 页面内容层 */}
      <main
        className="relative"
        style={{
          zIndex: 1,
          paddingTop: isStudio ? 0 : 'var(--spacing-navbar)',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
