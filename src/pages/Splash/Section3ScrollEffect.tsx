import { useEffect, useMemo, useRef, useState } from 'react'

const posters = [
  { src: '/section3/poster-1.png', label: 'Poster 01' },
  { src: '/section3/poster-2.png', label: 'Poster 02' },
  { src: '/section3/poster-3.png', label: 'Poster 03' },
  { src: '/section3/poster-4.png', label: 'Poster 04' },
]

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function smooth(start: number, end: number, value: number) {
  const x = clamp((value - start) / (end - start))
  return x * x * (3 - 2 * x)
}

function lerp(start: number, end: number, value: number) {
  return start + (end - start) * value
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
      smoothProgress += (rawProgress - smoothProgress) * 0.04
      setProgress(smoothProgress)
      frame = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      measure()
    }

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

export default function Section3ScrollEffect() {
  const sectionRef = useRef<HTMLElement>(null)
  const rawProgress = useScrollProgress(sectionRef)
  // 动画在前 80% 行程完成，后 20% 为停留段
  const progress = Math.min(1, rawProgress / 0.8)

  const cardIn = smooth(0.66, 0.82, progress)

  // 发送按钮点击模拟：press 0.3→0.36 缩小，release 0.36→0.44 回弹
  const btnPress = smooth(0.30, 0.36, progress)
  const btnRelease = smooth(0.36, 0.44, progress)
  const btnScale = 1 - btnPress * 0.18 + btnRelease * 0.18

  const styles = useMemo(() => {
    const promptIn = smooth(0.1, 0.22, progress)
    const promptOut = smooth(0.48, 0.6, progress)
    const productOut = smooth(0.58, 0.7, progress)
    const cardInMemo = smooth(0.66, 0.82, progress)

    return {
      title: {
        // 标题不做位移
      },
      product: {
        opacity: 1 - productOut,
        transform: `translate3d(0, ${lerp(14, -12, progress)}px, 0) scale(${lerp(1, 0.985, productOut)})`,
      },
      prompt: {
        opacity: promptIn * (1 - promptOut),
        transform: `translate3d(-50%, ${lerp(44, 0, promptIn) + lerp(0, 40, promptOut)}px, 0)`,
      },
      grid: {
        opacity: cardInMemo,        transform: `translate3d(-50%, calc(-50% + ${lerp(58, 0, cardInMemo)}px), 0)`,
      },
    }
  }, [progress])

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '560vh' }}
      aria-label="Section 3 scroll animation"
    >
      {/* sticky viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          contain: 'layout paint',
          background: 'transparent',
        }}
      >
        {/* 内层宽度限制容器 */}
        <div className="page-container" style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* 标题区 */}
        <div
          style={{
            position: 'relative',
            zIndex: 4,
            width: 'min(833px, calc(100vw - 40px))',
            margin: '0 auto',
            paddingTop: 108,
            textAlign: 'center',
            flexShrink: 0,
            willChange: 'transform',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            ...styles.title,
          }}
        >
          
          <h2 style={{ margin: 0, fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 48, lineHeight: '56px', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
            以系统思维设计
          </h2>
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

        {/* 舞台区 */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 auto',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px',
            }}
          >
            {/* 产品图 + prompt 堆叠 */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'visible',
                marginTop: '4%',
              }}
            >
              {/* 产品图 */}
              <figure
                style={{
                  position: 'relative',
                  zIndex: 5,
                  width: 'calc((min(80vw, 1080px) - 72px) / 4)',
                  margin: '0 0 30% 0',
                  willChange: 'transform, opacity',
                  ...styles.product,
                }}
              >
                <img
                  src="/section3/coffee.jpg"
                  alt="产品图"
                  style={{ aspectRatio: '3 / 4', width: '100%', objectFit: 'cover', display: 'block', borderRadius: 16 }}
                />
              </figure>

              {/* prompt 卡片 */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 30,
                  zIndex: 8,
                  width: 'min(520px, calc(100vw - 32px))',
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  padding: 16,
                  gap: 16,
                  border: '1px solid #EBEBEB',
                  borderRadius: 24,
                  background: '#FFFFFF',
                  boxShadow: '0px 3px 10px rgba(0,0,0,0.05)',
                  willChange: 'transform, opacity',
                  ...styles.prompt,
                }}
              >
                {/* 内层：上文本 + 下操作栏 */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, width: '100%', flex: 1, minHeight: 0 }}>
                  {/* 文本行 */}
                  <div style={{ width: '100%' }}>
                    <span style={{ display: 'block', fontFamily: 'Outfit, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '24px', color: '#0E0E0E' }}>
                      为湖南酱板鸭设计一个美食宣传商业海报，标题名称为："今天你要吃酱板鸭吗？！！"
                    </span>
                  </div>

                  {/* 操作栏 */}
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {/* 左侧：附件按钮 + 比例选择器 */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {/* 附件按钮（圆形加号） */}
                      <div style={{ position: 'relative', width: 36, height: 36, border: '1px solid #EBEBEB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ position: 'absolute', width: 12, height: 2, background: '#2B2B2B', borderRadius: 1 }} />
                        <span style={{ position: 'absolute', width: 2, height: 12, background: '#2B2B2B', borderRadius: 1 }} />
                      </div>
                      {/* 比例选择器 */}
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '6px 12px', gap: 4, border: '1px solid #EBEBEB', borderRadius: 29, height: 36 }}>
                        <span style={{ fontFamily: 'PingFang SC, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '22px', color: '#2B2B2B' }}>9:16</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'rotate(90deg)', flexShrink: 0 }}>
                          <path d="M6 4l4 4-4 4" stroke="#CFCFCF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* 右侧：发送按钮 */}
                    <div style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', background: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${btnScale})`, transformOrigin: 'center' }}>
                      {/* 箭头 up */}
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 15V5M10 5L5 10M10 5L15 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 海报网格 */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                zIndex: 6,
                width: 'min(80vw, 1080px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 16,
                willChange: 'transform, opacity',
                ...styles.grid,
              }}
            >
              {posters.map((poster, index) => {
                // 阶段1：网格整体带毛玻璃进入，settle 控制位移
                const settle = smooth(0.68 + index * 0.025, 0.86 + index * 0.02, progress)
                const cardY = lerp(34, 0, settle)
                const cardOpacity = cardIn  // 整体随网格同步出现，不分先后

                // 阶段2：网格完全呈现后（progress > ~0.85），依次消散毛玻璃
                const reveal = smooth(0.84 + index * 0.03, 0.92 + index * 0.02, progress)
                return (
                  <figure
                    key={poster.label}
                    style={{
                      flex: '0 0 calc((min(80vw, 1080px) - 48px) / 4)',
                      margin: 0,
                      transform: `translate3d(0, ${cardY}px, 0)`,
                      opacity: cardOpacity,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '3 / 4',
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: 16,
                      }}
                    >
                      {/* 图片（始终完整展示） */}
                      <img
                        src={poster.src}
                        alt={poster.label}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {/* 深色遮罩，reveal 进度 0→1 时 opacity 1→0 */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: '#2a2a2a',
                          opacity: 1 - reveal,
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </figure>
                )
              })}
            </div>
          </div>
        </div>
        </div>{/* 内层宽度限制容器结束 */}
      </div>
    </section>
  )
}
