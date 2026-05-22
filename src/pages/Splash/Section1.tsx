import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Section1() {
  const navigate = useNavigate()

  return (
    <section
      className="relative flex flex-col items-center justify-center"
      style={{ height: '100vh', minHeight: 640, zIndex: 1 }}
    >
      <motion.div
        className="relative z-10 flex flex-col items-center gap-5 select-none"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
      >
        <h1
          className="text-6xl font-bold text-center leading-tight"
          style={{ color: '#f0f0f5', letterSpacing: '-0.01em' }}
        >
          灵感, 即画面
        </h1>
        <p
          className="text-l text-center"
          style={{ color: 'rgba(240,240,245,0.55)', letterSpacing: '0.02em' }}
        >
          让好创意，更快被看见
        </p>

        <motion.button
          onClick={() => navigate('/home')}
          className="group relative overflow-hidden rounded-3xl font-medium text-sm tracking-wide"
          style={{
            width: 164,
            height: 58,
            background: '#FFFFFF',
            color: '#111111',
            border: 'none',
            marginTop: 36,
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(0,0,0,0.06)' }}
          />
          <span className="relative flex items-center justify-center gap-2 text-base font-semibold">
            即刻开始
          </span>
        </motion.button>
      </motion.div>
    </section>
  )
}
