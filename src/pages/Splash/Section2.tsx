export default function Section2() {
  return (
    <section
      className="relative flex flex-col items-center"
      style={{ padding: '120px 0 160px', zIndex: 1 }}
    >
      <div className="page-container flex flex-col items-center" style={{ gap: 124 }}>
        {/* 文字区 */}
        <div className="flex flex-col items-center" style={{ gap: 28, maxWidth: 833 }}>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '29px',
              textAlign: 'center',
              letterSpacing: '-0.018em',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
            }}
          >
            你的生活服务运营智能体
          </p>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 500,
              fontSize: 48,
              lineHeight: '56px',
              textAlign: 'center',
              letterSpacing: '-0.01em',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            为生活服务门店<br />设计一套运营素材
          </h2>
        </div>

        {/* 图片区 */}
        <img
          src="/section2-mockup.png"
          alt="AI 设计助手演示"
          style={{
            width: '100%',
            maxWidth: 1320,
            height: 'auto',
            borderRadius: 16,
            display: 'block',
          }}
        />
      </div>
    </section>
  )
}
