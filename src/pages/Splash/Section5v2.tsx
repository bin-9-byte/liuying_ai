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

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image'
  mediaSrc: string
  posterSrc?: string
  bgImageSrc: string
  title?: string
  scrollToExpand?: string
  children?: ReactNode
}

function ScrollExpandMedia({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  bgImageSrc: _bgImageSrc,
  title,
  scrollToExpand,
  children,
}: ScrollExpandMediaProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useScrollProgress(sectionRef)

  // progress 0→0.6 驱动动画，0.6→1 为停留段（内容已完全展示）
  const animProgress = Math.min(1, progress / 0.75)

  // Media expands: 0 → 1 over animation range
  const expandProgress = smooth(0, 0.7, animProgress)
  // Content fades in after media is mostly expanded
  const contentIn = smooth(0.75, 1, animProgress)
  // Background fades out as media expands
  const bgOpacity = 1 - smooth(0, 0.5, animProgress)

  // start: 30vw × 50vh → end: capped at 1210px wide, 16:9 ratio
  const maxW = Math.min(window.innerWidth * 0.9, 1080)
  const startW = Math.min(window.innerWidth * 0.55, 640)
  const mediaWpx = startW + expandProgress * (maxW - startW)
  const mediaHpx = mediaWpx * (9 / 16)
  const mediaW = `${mediaWpx}px`
  const mediaH = `${mediaHpx}px`
  const mediaRadius = 24

  const firstWord = title ? title.split(' ')[0] : ''
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : ''
  const textTranslateX = expandProgress * 150

  return (
    <section
      ref={sectionRef}
      id="section5v2"
      style={{ position: 'relative', height: '400vh' }}
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
      mediaType="image"
      mediaSrc="/test_img.png"
      bgImageSrc="https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1920&h=1080&fit=crop&q=80"
      title="设计 不止于画布"
    />
  )
}
