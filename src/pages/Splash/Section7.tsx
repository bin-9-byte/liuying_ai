import { useNavigate } from 'react-router-dom'

export default function Section7() {
  const navigate = useNavigate()

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 0 100px',
        zIndex: 1,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 'min(80vw, 1210px)',
          margin: '0 auto',
        }}
      >
        {/* CTA Container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            isolation: 'isolate',
            width: '100%',
            minHeight: 400,
            background: '#0E0E0E',
            borderRadius: 20,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Glow: top-right blurred ellipse */}
          <div
            style={{
              position: 'absolute',
              width: 140,
              height: 140,
              right: 0,
              top: 0,
              background: '#D9D9D9',
              filter: 'blur(202px)',
              borderRadius: '50%',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Decorative circles */}
          {/* Large circle - left */}
          <div
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              left: -40,
              bottom: '35%',
              border: '2.47px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
          {/* Small circle - bottom right area */}
          <div
            style={{
              position: 'absolute',
              width: 44,
              height: 44,
              right: '18%',
              bottom: '14%',
              border: '1.59px solid rgba(255,255,255,0.21)',
              borderRadius: '50%',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          {/* Medium circle - top right */}
          <div
            style={{
              position: 'absolute',
              width: 56,
              height: 56,
              right: '5%',
              top: '18%',
              border: '2px solid rgba(255,255,255,0.21)',
              borderRadius: '50%',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          />
          {/* Small circle - top left */}
          <div
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              left: '15%',
              top: '18%',
              border: '2px solid rgba(255,255,255,0.21)',
              borderRadius: '50%',
              zIndex: 4,
              pointerEvents: 'none',
            }}
          />

          {/* Center Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 48,
              padding: '60px 40px',
              maxWidth: 800,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                lineHeight: 1.54,
                textAlign: 'center',
                letterSpacing: '-0.01em',
                color: '#FFFFFF',
              }}
            >
              流影没有边界<br />开启你的创作之旅
            </h2>

            <button
              onClick={() => navigate('/home')}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '14px 34px',
                width: 164,
                height: 58,
                background: '#FFFFFF',
                borderRadius: 24,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: 16,
                lineHeight: '24px',
                textAlign: 'center',
                color: '#000000',
                flexShrink: 0,
              }}
            >
              即刻开始
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
