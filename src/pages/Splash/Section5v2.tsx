import { useEffect, useRef, useState, type ReactNode } from 'react'

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function smooth(start: number, end: number, value: number) {
  const x = clamp((value - start) / (end - start))
  return x * x * (3 - 2 * x)
}

function useScrollProgress(targetRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    let rawProgress = 0
    let smoothProgress = 0

    const measure = () => {
      const node = targetRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      rawProgress = scrollable > 0 ? clamp(-rect.top / scrollable) : 0
    }

    const tick = () => {
      smoothProgress += (rawProgress - smoothProgress) * 0.08
      setProgress(smoothProgress)
      frame = requestAnimationFrame(tick)
    }

    const onScroll = () => measure()

    measure()
    frame = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetRef])

  return progress
}

// 图片自然高宽比（长图）—— 运行时动态读取，先用默认值 3
const IMG_ASPECT_RATIO = 3 // imgHeight / imgWidth，加载后更新

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image' | 'longimage'
  mediaSrc: string
  posterSrc?: string
  bgImageSrc: string
  title?: string
  scrollToExpand?: string
  children?: ReactNode
  /** 跳过展开阶段，直接从展开完成状态开始（用于与上一节过渡衔接） */
  skipExpand?: boolean
}

function ScrollExpandMedia({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  bgImageSrc: _bgImageSrc,
  title,
  scrollToExpand,
  children,
  skipExpand = false,
}: ScrollExpandMediaProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useScrollProgress(sectionRef)

  // 长图宽高比（动态）
  const [imgAspect, setImgAspect] = useState(IMG_ASPECT_RATIO)
  useEffect(() => {
    if (mediaType !== 'longimage') return
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth > 0) setImgAspect(img.naturalHeight / img.naturalWidth)
    }
    img.src = mediaSrc
  }, [mediaSrc, mediaType])

  // ── 阶段划分 ──
  // 0 → 0.75 : 扩展动画
  // 0.75 → 0.9 : 长图内部滚动
  // 0.9 → 1   : 停留（长图到底，等待继续滚动离开）
  const EXPAND_END = 0.75
  const SCROLL_END = 0.90

  // skipExpand 时跳过展开阶段：EXPAND_END 之前的行程直接映射到 animProgress=1
  // 即展开已完成，行程全部用于长图滚动和停留
  const animProgress = skipExpand ? 1 : Math.min(1, progress / EXPAND_END)

  // Media expands: 0 → 1 over animation range
  const expandProgress = smooth(0, 0.7, animProgress)
  // Content fades in after media is mostly expanded
  const contentIn = smooth(0.75, 1, animProgress)
  // Background fades out as media expands
  const bgOpacity = 1 - smooth(0, 0.5, animProgress)

  // 容器尺寸
  const maxW = Math.min(window.innerWidth * 0.9, 1080)
  const startW = Math.min(window.innerWidth * 0.55, 640)
  const mediaWpx = startW + expandProgress * (maxW - startW)
  const mediaHpx = mediaWpx * (9 / 16)
  const mediaW = `${mediaWpx}px`
  const mediaH = `${mediaHpx}px`
  const mediaRadius = 24

  // 长图滚动偏移：progress 从 EXPAND_END 到 SCROLL_END 时，图片从顶到底
  const imgDisplayW = mediaWpx * 0.8                    // 图片实际渲染宽度（与 CSS width:80% 对应）
  const imgTotalH = imgDisplayW * imgAspect              // 图片自然高度（px）
  const maxOffset = Math.max(0, imgTotalH - mediaHpx)    // 可滚动距离
  const scrollT = skipExpand
    ? clamp(progress / SCROLL_END)
    : clamp((progress - EXPAND_END) / (SCROLL_END - EXPAND_END))
  const imgOffsetY = -(scrollT * maxOffset)

  const firstWord = title ? title.split(' ')[0] : ''
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : ''
  const textTranslateX = expandProgress * 150

  return (
    <section
      ref={sectionRef}
      id="section5v2"
      style={{ position: 'relative', height: '550vh' }}
      aria-label="Section 5v2 scroll animation"
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          contain: 'layout paint',
        }}
      >
        {/* Background: transparent → white transition */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#FFFFFF',
            opacity: 1 - bgOpacity,
            zIndex: 0,
          }}
        />

        {/* Center stage */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          {/* Expanding media card */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, calc(-50% + 30px))',
              width: mediaW,
              height: mediaH,
              borderRadius: mediaRadius,
              overflow: 'hidden',
              boxShadow: '0 0 24px rgba(0,0,0,0.15)',
              transition: 'none',
              zIndex: 0,
              backgroundImage: 'url(/bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {mediaType === 'video' ? (
              <video
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : mediaType === 'longimage' ? (
              <img
                src={mediaSrc}
                alt={title || 'media'}
                style={{
                  width: '80%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  transform: `translateY(${imgOffsetY}px)`,
                  willChange: 'transform',
                  transition: 'none',
                }}
              />
            ) : (
              <img
                src={mediaSrc}
                alt={title || 'media'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
            {/* Overlay fades to 0 as media fully expands */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                opacity: 1 - expandProgress,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Title splits and slides apart */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, calc(-50% + 30px))',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              pointerEvents: 'none',
              width: '100%',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: 48,
                lineHeight: '56px',
                color: '#e8e8f0',
                transform: `translateX(-${textTranslateX}vw)`,
                willChange: 'transform',
              }}
            >
              {firstWord}
            </h2>
            <h2
              style={{
                margin: 0,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: 48,
                lineHeight: '56px',
                color: '#e8e8f0',
                transform: `translateX(${textTranslateX}vw)`,
                willChange: 'transform',
              }}
            >
              {restOfTitle}
            </h2>
            {scrollToExpand && expandProgress < 0.1 && (
              <p
                style={{
                  margin: '16px 0 0',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 14,
                  color: 'rgba(232,232,240,0.7)',
                  letterSpacing: '0.04em',
                }}
              >
                {scrollToExpand}
              </p>
            )}
          </div>

          {/* Content slides up from bottom after expand */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, calc(-50% + 30px + ${(1 - contentIn) * 48}px))`,
              opacity: contentIn,
              zIndex: 2,
              pointerEvents: contentIn > 0.5 ? 'auto' : 'none',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Section5v2() {
  return (
    <ScrollExpandMedia
      mediaType="longimage"
      mediaSrc="/longimg.png"
      bgImageSrc="https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1920&h=1080&fit=crop&q=80"
      title="设计 不止于画布"
      skipExpand
    />
  )
}
