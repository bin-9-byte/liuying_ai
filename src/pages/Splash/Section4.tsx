import { motion } from 'framer-motion'
import { useState } from 'react'
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
}

const defaultImages = [
  {
    src: '/section4/08.png',
    alt: 'SaaS Dashboard Design',
  },
  {
    src: '/section4/04.png',
    alt: 'Web Development',
  },
  {
    src: '/section4/05.png',
    alt: 'E-Commerce Platform',
  },
  {
    src: '/section4/06.png',
    alt: 'Mobile App Design',
  },
  {
    src: '/section4/03.png',
    alt: 'Brand Identity',
  },
  {
    src: '/section4/01.png',
    alt: 'Marketing Campaign',
  },
  {
    src: '/section4/07.png',
    alt: 'Product Photography',
  },
  {
    src: '/section4/09.png',
    alt: 'Packaging Design',
  },
  {
    src: '/section4/10.png',
    alt: 'Tech Innovation',
  },
  {
    src: '/section4/11.png',
    alt: 'Future Vision',
  },
]

export default function Section4({
  title = 'Browse my library',
  archiveButton: _archiveButton = { text: 'View gallery', href: '/work' },
  images: customImages,
  className = '',
  maxHeight = 120,
  spacing = '-space-x-72 md:-space-x-68',
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 4,
}: PortfolioGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const images = customImages || defaultImages

  return (
    <section className="relative" style={{ padding: '160px 0 120px', zIndex: 1 }}>
      <div className="page-container">
    <div
      aria-label={title}
      className={className}
      id="archives"
      style={{ width: '100%' }}
    >
      <div
        style={{
          width: '100%',
          background: 'rgba(14,14,14,0.7)',
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            paddingTop: 64,
            paddingBottom: 48,
            textAlign: 'center',
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

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '29px', letterSpacing: '-0.018em', color: 'rgba(255,255,255,0.6)' }}>
              设计决策，并非一座孤岛
            </p>
            <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '29px', letterSpacing: '-0.018em', color: 'rgba(255,255,255,0.6)' }}>
              流影将色彩、版式、语言统一为完整的品牌体系
            </p>
            <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '29px', letterSpacing: '-0.018em', color: 'rgba(255,255,255,0.6)' }}>
              从第一稿，到第一百稿
            </p>
          </div>
        </div>

        {/* Desktop 3D overlapping layout */}
        <div className="hidden md:block relative overflow-hidden" style={{ height: 'min(78vh, 820px)', marginBottom: '-320px' }}>
          <div className={`flex ${spacing} pb-8 pt-64 items-end justify-center`}>
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
                  style={{ zIndex }}
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
                    className="relative aspect-[9/16] w-64 md:w-80 lg:w-96 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
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
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile marquee layout */}
        <div className="block md:hidden relative pb-8">
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
                    {
                      'group-hover:[animation-play-state:paused]': pauseOnHover,
                    }
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
      </div>
    </section>
  )
}
