import { useEffect, useState } from 'react'
import Dither, { ditherScrollRef, ditherMouseRef } from '@/components/webgl/Dither'
import SplashHeader from '@/components/layout/SplashHeader'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3ScrollEffect from './Section3ScrollEffect'
import Section4 from './Section4'
import Section5v2 from './Section5v2'
import Section6v2 from './Section6v2'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [headerBg, setHeaderBg] = useState(false)
  const [headerTheme, setHeaderTheme] = useState<'dark' | 'light' | number>('dark')

  const handleSection4BgOpacity = (opacity: number) => {
    setHeaderTheme(opacity)
  }

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1)
      ditherScrollRef.current = progress
      setHeaderBg(progress >= 1)

      // Section5v2 存在时沿用原逻辑
      const s5v2 = document.getElementById('section5v2')
      if (s5v2) {
        const rect = s5v2.getBoundingClientRect()
        const totalH = s5v2.offsetHeight
        const scrolled = -rect.top
        const sectionProgress = Math.max(0, Math.min(1, scrolled / totalH))
        const t = Math.max(0, Math.min(1, sectionProgress / 0.5))
        if (scrolled >= 0 && scrolled <= totalH) {
          setHeaderTheme(t)
          return
        } else if (scrolled > totalH) {
          setHeaderTheme('light')
          return
        }
      }

      const s4 = document.getElementById('section4')
      if (s4) {
        const rect = s4.getBoundingClientRect()
        const totalH = s4.offsetHeight
        const scrolled = -rect.top
        const sectionProgress = Math.max(0, Math.min(1, scrolled / totalH))
        // 白色背景在 sectionProgress 0.7→1.0 淡入
        const t = Math.max(0, Math.min(1, (sectionProgress - 0.7) / 0.3))
        if (scrolled >= 0 && scrolled <= totalH) {
          setHeaderTheme(t)
        } else if (scrolled < 0) {
          setHeaderTheme('dark')
        } else {
          setHeaderTheme('light')
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      ditherMouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      ditherScrollRef.current = 0
    }
  }, [])

  const themeT = typeof headerTheme === 'number' ? headerTheme : headerTheme === 'light' ? 1 : 0

  return (
    <div style={{ background: '#000000' }}>
      {/* 固定顶部 Header */}
      <SplashHeader
        showBackground={headerBg}
        theme={headerTheme}
        right={
          <motion.button
            onClick={() => navigate('/home')}
            className="group relative overflow-hidden rounded-2xl font-medium text-sm"
            style={{
              width: 100,
              height: 38,
              background: themeT > 0.5 ? '#111111' : '#FFFFFF',
              color: themeT > 0.5 ? '#FFFFFF' : '#111111',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s ease, color 0.3s ease',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            />
            <span className="relative">开始创作</span>
          </motion.button>
        }
      />

      {/* Dither 背景：fixed 不随滚动移动，颜色随滚动衰减至黑 */}
      <div className="fixed inset-0" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <Dither
          waveSpeed={0.08}
          waveFrequency={2}
          waveAmplitude={0.18}
          waveColor={[0.435, 0.435, 0.435]}
          colorNum={4.3}
          pixelSize={3}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.4}
        />
      </div>

      <Section1 />
      <Section2 />
      <Section3ScrollEffect />
      <Section4 title="更多素材, 一键互联" archiveButton={{ text: '查看全部', href: '/home' }} onBgOpacity={handleSection4BgOpacity} />

      {/* Section5v2：滚动展开媒体动效，背景从透明→白 */}
      {/* <Section5v2 /> */}

      {/* 白色背景区域 */}
      <div style={{ background: '#FFFFFF', position: 'relative', zIndex: 1 }}>
        <Section6v2 />
      </div>
    </div>
  )
}
