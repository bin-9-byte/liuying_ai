import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface PortfolioGalleryProps {
  title?: string
  archiveButton?: {
    text: string
    href: string
  }
  images?: Array<{
    src: string
    alt: string
    title?: string
  }>
  className?: string
  maxHeight?: number
  spacing?: string
  onImageClick?: (index: number) => void
  pauseOnHover?: boolean
  marqueeRepeat?: number
  /** 白色背景透明度回调 0→1，供外部同步 header 主题 */
  onBgOpacity?: (opacity: number) => void
}

const defaultImages = [
  { src: '/section4/001.png', alt: 'SaaS Dashboard Design' },
  { src: '/section4/002.jpeg', alt: 'Web Development' },
  { src: '/section4/003.jpeg', alt: 'E-Commerce Platform' },
  { src: '/section4/004.jpeg', alt: 'Mobile App Design' },
  { src: '/section4/005.jpeg', alt: 'Brand Identity' },
  { src: '/section4/011.jpeg', alt: 'Marketing Campaign' },
  { src: '/section4/007.jpeg', alt: 'Product Photography' },
  { src: '/section4/008.png', alt: 'Packaging Design' },
  { src: '/section4/009.jpeg', alt: 'Tech Innovation' },
  { src: '/section4/010.jpeg', alt: 'Future Vision' },
]

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
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
      smoothProgress += (rawProgress - smoothProgress) * 0.06
      setProgress(smoothProgress)
      frame = requestAnimationFrame(tick)
    }

    measure()
    frame = requestAnimationFrame(tick)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [targetRef])

  return progress
}

export default function Section4({
  title = 'Browse my library',
  archiveButton: _archiveButton = { text: 'View gallery', href: '/work' },
  images: customImages,
  className: _className = '',
  maxHeight = 120,
  spacing = '-space-x-72 md:-space-x-68',
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 4,
  onBgOpacity,
}: PortfolioGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useScrollProgress(sectionRef)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const images = customImages || defaultImages

  function smoothStep(x: number) { return x * x * (3 - 2 * x) }

  // 卡片间距随滚动展开：progress 0→0.55
  const cardSpreadProgress = Math.min(1, progress / 0.55)
  const cardNegMargin = -360 + cardSpreadProgress * (360 - 272)

  // 出场动效：progress 0.55→0.7，Section4内容淡出
  const exitT = smoothStep(clamp((progress - 0.55) / 0.15))
  const textExitY = exitT * -48
  const textExitOpacity = 1 - exitT
  const cardExitY = exitT * 40
  const cardExitOpacity = 1 - exitT

  // Section5v2 展开预演：progress 0.7→1.0
  // 完全复刻 Section5v2 的 smooth 函数和动效参数
  function smoothS5(start: number, end: number, value: number) {
    const x = clamp((value - start) / (end - start))
    return x * x * (3 - 2 * x)
  }
  const s5PreviewT = clamp((progress - 0.7) / 0.3)  // 0→1 in progress 0.7→1.0
  // 对应 Section5v2 的 animProgress（从0到1完整展开）
  const s5AnimProgress = smoothStep(s5PreviewT)
  const s5ExpandProgress = smoothS5(0, 0.7, s5AnimProgress)
  const s5BgOpacity = 1 - smoothS5(0, 0.5, s5AnimProgress)  // 与 Section5v2 bgOpacity 一致
  const maxW = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9, 1080) : 900
  const startW = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.55, 640) : 500
  const s5MediaWpx = startW + s5ExpandProgress * (maxW - startW)
  const s5MediaHpx = s5MediaWpx * (9 / 16)
  const s5DarkOverlay = 1 - s5ExpandProgress
  const s5PreviewOpacity = smoothStep(clamp((progress - 0.65) / 0.1))
  const s5TextTranslateX = s5ExpandProgress * 150  // 与 Section5v2 textTranslateX 一致

  // 把白色背景实际透明度回传给外层，用于同步 header 主题
  const bgWhiteOpacity = s5PreviewOpacity * (1 - s5BgOpacity)
  useEffect(() => {
    onBgOpacity?.(bgWhiteOpacity)
  }, [bgWhiteOpacity, onBgOpacity])

  return (
    // 外层 section：大高度，用于提供滚动行程
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '450vh' }}
      aria-label={title}
      id="section4"
    >
      {/* sticky 视口：固定在屏幕上 */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Section5v2 展开预演层：progress 0.65→1.0，在Section4 sticky内完成展开动效 */}
        {s5PreviewOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {/* 白色背景随展开淡入（对应Section5v2的 bgOpacity）*/}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#FFFFFF',
                opacity: s5PreviewOpacity * (1 - s5BgOpacity),
              }}
            />
            {/* 媒体卡片：完整复刻 Section5v2，scale 从小到大入场 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, calc(-50% + 30px)) scale(${0.3 + s5PreviewOpacity * 0.7})`,
                width: `${s5MediaWpx}px`,
                height: `${s5MediaHpx}px`,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 0 24px rgba(0,0,0,0.15)',
                opacity: s5PreviewOpacity,
                backgroundImage: 'url(/bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform, width, height, opacity',
              }}
            >
              <img
                src="/longimg.png"
                alt="preview"
                style={{
                  width: '80%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  willChange: 'transform',
                  transition: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  opacity: s5DarkOverlay,
                  pointerEvents: 'none',
                }}
              />
            </div>
            {/* 标题分裂效果：完整复刻 Section5v2 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, calc(-50% + 30px)) scale(${0.3 + s5PreviewOpacity * 0.7})`,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                pointerEvents: 'none',
                width: '100%',
                opacity: s5PreviewOpacity,
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
                  transform: `translateX(-${s5TextTranslateX}vw)`,
                  willChange: 'transform',
                }}
              >
                设计
              </h2>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 600,
                  fontSize: 48,
                  lineHeight: '56px',
                  color: '#e8e8f0',
                  transform: `translateX(${s5TextTranslateX}vw)`,
                  willChange: 'transform',
                }}
              >
                不止于画布
              </h2>
            </div>
          </div>
        )}

        {/* 深色圆角背景容器 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '24px',
            right: '24px',
            background: 'rgb(0, 0, 0)',
            borderRadius: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 文字区 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              paddingTop: '160px',
              paddingBottom: 48,
              textAlign: 'center',
              flexShrink: 0,
              zIndex: 2,
              position: 'relative',
              transform: `translateY(${textExitY}px)`,
              opacity: textExitOpacity,
              willChange: 'transform, opacity',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 500,
                fontSize: 48,
                lineHeight: '56px',
                letterSpacing: '-0.01em',
                color: '#FFFFFF',
              }}
            >
              {title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '29px', letterSpacing: '-0.018em', color: 'rgba(255,255,255,0.6)' }}>
                海量运营素材，随取随用
              </p>
              <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '29px', letterSpacing: '-0.018em', color: 'rgba(255,255,255,0.6)' }}>
                自动完成分层、命名与资产配置
              </p>
            </div>
          </div>

          {/* 卡片区：Desktop 3D overlapping layout */}
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              transform: `translateY(calc(80% + ${cardExitY}px))`,
              opacity: cardExitOpacity,
              willChange: 'transform, opacity',
            }}
          >
            <div
              className="flex items-end justify-center"
              style={{ gap: 0 }}
            >
              {images.map((image, index) => {
                const totalImages = images.length
                const middle = Math.floor(totalImages / 2)
                const distanceFromMiddle = Math.abs(index - middle)
                const staggerOffset = maxHeight - distanceFromMiddle * 20
                const zIndex = totalImages - index

                const isHovered = hoveredIndex === index
                const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index
                const yOffset = isHovered ? -120 : isOtherHovered ? 0 : -staggerOffset

                return (
                  <motion.div
                    key={index}
                    className="group cursor-pointer flex-shrink-0"
                    style={{
                      zIndex,
                      marginLeft: index === 0 ? 0 : `${cardNegMargin}px`,
                    }}
                    initial={{
                      transform: `perspective(5000px) rotateY(-40deg) translateY(200px)`,
                      opacity: 0,
                    }}
                    animate={{
                      transform: `perspective(5000px) rotateY(-40deg) translateY(${yOffset}px)`,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    onClick={() => onImageClick?.(index)}
                  >
                    <div
                      className="relative aspect-[9/16] w-64 md:w-80 lg:w-96 rounded-3xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
                      style={{
                        boxShadow: `
                          rgba(0,0,0,0.01) 0.8px 0px 0.8px 0px,
                          rgba(0,0,0,0.03) 2.4px 0px 2.4px 0px,
                          rgba(0,0,0,0.08) 6.4px 0px 6.4px 0px,
                          rgba(0,0,0,0.25) 20px 0px 20px 0px
                        `,
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-contain object-top"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Mobile marquee layout */}
          <div className="block md:hidden relative pb-8 mt-auto">
            <div
              className={cn(
                'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
                'flex-row'
              )}
            >
              {Array(marqueeRepeat)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex shrink-0 justify-around [gap:var(--gap)]',
                      'animate-marquee flex-row',
                      { 'group-hover:[animation-play-state:paused]': pauseOnHover }
                    )}
                  >
                    {images.map((image, index) => (
                      <div
                        key={`${i}-${index}`}
                        className="group cursor-pointer flex-shrink-0"
                        onClick={() => onImageClick?.(index)}
                      >
                        <div
                          className="relative aspect-[9/16] w-64 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                          style={{
                            boxShadow: `
                              rgba(0,0,0,0.01) 0.8px 0px 0.8px 0px,
                              rgba(0,0,0,0.03) 2.4px 0px 2.4px 0px,
                              rgba(0,0,0,0.08) 6.4px 0px 6.4px 0px,
                              rgba(0,0,0,0.25) 20px 0px 20px 0px
                            `,
                          }}
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
