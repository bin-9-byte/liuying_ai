const features = [
  {
    title: '懂你所想，精准编辑',
    desc: '精准定点修改，只改该改之处。流影保持设计品质，让每一次编辑都恰到好处。',
  },
  {
    title: '品牌一致性保障',
    desc: '色彩、字体、间距全局统一管理，从第一稿到第一百稿，始终如一的品牌语言。',
  },
  {
    title: '全链路设计服务',
    desc: '从创意输入到成品输出，流影覆盖海报、详情页、品牌手册等全场景设计需求。',
  },
  {
    title: '找到你的设计风格',
    desc: '智能风格匹配引擎，深度理解你的审美偏好，每次推荐都恰到好处。',
  },
  {
    title: '专业级设计能力',
    desc: '内置超过 130+ 专业模板，结合 AI 生成能力，输出媲美顶级设计师的作品。',
  },
  {
    title: '随时随地答疑解惑',
    desc: '无论是色彩搭配、版式规范还是品牌策略，流影 AI 随时为你提供专业建议。',
  },
]

export default function Section6() {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 0 240px',
        zIndex: 1,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 'min(80vw, 1210px)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Header */}
        <h2
          style={{
            margin: '0 0 40px 0',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(36px, 4.5vw, 36px)',
            lineHeight: 1.35,
            letterSpacing: '-0.0182em',
            color: 'rgba(0, 0, 0, 0.9)',
          }}
        >
          更多设计能力
        </h2>

        {/* Horizontal Border */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid rgba(0, 0, 0, 0.15)',
            position: 'relative',
            paddingTop: 48,
          }}
        >
          {/* Feature Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              rowGap: 52,
              columnGap: 40,
            }}
          >
            {features.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: '32px',
                    letterSpacing: '-0.04em',
                    color: '#1e1e1e',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: '27px',
                    letterSpacing: '-0.04em',
                    color: '#828282',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
