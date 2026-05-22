export default function Section5() {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 0',
        zIndex: 1,
        position: 'relative',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 'min(80vw, 1210px)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
        }}
      >
        {/* Gallery Container - fills full height */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            padding: 32,
            gap: 32,
            width: '100%',
            flex: 1,
            background: '#0E0E0E',
            borderRadius: 24,
            boxSizing: 'border-box',
            minHeight: 'calc(100vh - 400px)',
          }}
        >
          {/* Left Column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flex: 1,
              minWidth: 0,
              padding: '16px 8px',
            }}
          >
            {/* Top: title + description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 500,
                  fontSize: 36,
                  lineHeight: '48px',
                  letterSpacing: '-0.01em',
                  color: '#FFFFFF',
                }}
              >
                设计，<br />不止于画布
              </h3>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: '28px',
                  letterSpacing: '-0.01em',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                精准定点修改，只改该改之处。<br />
                流影保持设计品质，让每一次编辑都恰到好处。
              </p>
            </div>

            {/* Bottom: button */}
            <button
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px 32px',
                height: 48,
                background: '#FFFFFF',
                borderRadius: 24,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: 16,
                lineHeight: '24px',
                color: '#000000',
                flexShrink: 0,
              }}
              onClick={() => window.location.href = '/home'}
            >
              立即体验
            </button>
          </div>

          {/* Right Column - Image */}
          <div
            style={{
              flexShrink: 0,
              width: 'min(55%, 560px)',
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
              background: '#1a1a1a',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=80"
              alt="精准编辑演示"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(4, 4, 4, 0.5)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
