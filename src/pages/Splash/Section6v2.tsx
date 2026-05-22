import React from 'react'

type FeatureCard = {
  icon: string
  title: string
  desc: string
  tag?: string
}

const features: FeatureCard[] = [
  {
    icon: '✦',
    title: 'AI 智能生成',
    desc: '输入一句话，流影自动生成符合品牌调性的设计作品，省去从零开始的时间成本。',
    tag: 'Core',
  },
  {
    icon: '⬡',
    title: '精准定点修改',
    desc: '只改该改的地方，其余风格原封不动。流影理解你的意图，不多做一步。',
  },
  {
    icon: '◈',
    title: '品牌色彩管理',
    desc: '上传品牌规范，流影自动提取主色、辅色，所有生成内容均在品牌色域内输出。',
    tag: 'Brand',
  },
  {
    icon: '◎',
    title: '多格式一键导出',
    desc: '海报、横幅、社交封面、详情页，一次设计，多尺寸自动适配，随时导出使用。',
  },
  {
    icon: '❋',
    title: '版式智能推荐',
    desc: '基于内容语义自动分析最佳版式布局，标题、图片、留白均有专业设计逻辑支撑。',
  },
  {
    icon: '◇',
    title: '历史版本管理',
    desc: '每一次修改均自动存档，随时回到任意历史版本，创作没有后悔药可吃也不怕。',
  },
  {
    icon: '⬙',
    title: '素材库直连',
    desc: '内置海量正版图片、插画、字体资源，设计过程中直接引用，无需切换工具。',
    tag: 'Assets',
  },
  {
    icon: '◉',
    title: '协作与共享',
    desc: '一键生成分享链接，团队成员可实时查看与评论，设计决策不再困在邮件里。',
  },
  {
    icon: '✳',
    title: '风格迁移',
    desc: '上传参考图，流影提取其视觉风格并应用到你的内容上，一键复刻设计感。',
    tag: 'AI',
  },
]

const col1 = features.slice(0, 3)
const col2 = features.slice(3, 6)
const col3 = features.slice(6, 9)

function FeatureColumn({
  items,
  duration = 12,
  className = '',
}: {
  items: FeatureCard[]
  duration?: number
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        height: '100%',
        maskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div
        className="animate-marquee-vertical"
        style={{ ['--duration' as string]: `${duration}s`, display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}
      >
        {[0, 1].map((_, idx) => (
          <React.Fragment key={idx}>
            {items.map(({ icon, title, desc, tag }, i) => (
              <div
                key={i}
                style={{
                  padding: '24px',
                  borderRadius: 20,
                  border: '1px solid rgba(0,0,0,0.07)',
                  background: '#FAFAFA',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  maxWidth: 320,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* Icon + tag row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
                  {tag && (
                    <span style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      color: 'rgba(0,0,0,0.4)',
                      background: 'rgba(0,0,0,0.06)',
                      borderRadius: 6,
                      padding: '2px 8px',
                    }}>
                      {tag}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 15, lineHeight: '22px', color: '#111', marginBottom: 8 }}>
                  {title}
                </div>
                <p style={{ margin: 0, fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '22px', color: 'rgba(0,0,0,0.5)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default function Section6v2() {
  return (
    <section style={{ padding: '180px 0', background: '#FFFFFF' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: 60, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 'clamp(32px, 3.5vw, 48px)', lineHeight: 1.54, textAlign: 'center', letterSpacing: '-0.01em', color: '#111111', margin: 0 }}>
            流影没有边界<br />开启你的创作之旅
          </h2>
          <button
            onClick={() => window.location.href = '/home'}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '14px 34px',
              width: 164,
              height: 58,
              background: '#111111',
              borderRadius: 24,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            即刻开始
          </button>
        </div>
      </div>

      {/* Columns */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'flex-start', height: 580 }}>
        <FeatureColumn items={col1} duration={14} />
        <FeatureColumn items={col2} duration={11} />
        <FeatureColumn items={col3} duration={17} />
      </div>
    </section>
  )
}
