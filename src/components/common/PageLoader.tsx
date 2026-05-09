import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen" style={{ background: '#08080f' }}>
      <div className="flex flex-col items-center gap-4">
        {/* 呼吸发光的中心球体 */}
        <motion.div
          className="relative w-12 h-12 flex items-center justify-center rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Logo 图标渐隐渐现 */}
          <motion.svg 
            width="24" 
            height="24" 
            viewBox="0 0 36 36" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              opacity: [0.3, 1, 0.3],
              filter: ['blur(1px)', 'blur(0px)', 'blur(1px)']
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <path d="M23.7793 29.8082C23.4446 30.3031 22.8865 30.6001 22.2891 30.6002H7.20117L13.2881 21.6002H16.8887C17.4862 21.6002 18.0451 21.3032 18.3799 20.8082L22.7139 14.4H34.2012L23.7793 29.8082ZM22.7139 14.4H19.1133C18.5157 14.4 17.9569 14.697 17.6221 15.192L13.2881 21.6002H1.80078L12.2217 6.19202C12.5565 5.69702 13.1153 5.40004 13.7129 5.40002H28.8008L22.7139 14.4Z" fill="white"/>
          </motion.svg>
          
          {/* 外圈光晕效果 */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.3)' }}
            animate={{ 
              scale: [1, 1.2, 1.4],
              opacity: [0.5, 0, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              times: [0, 0.5, 1]
            }}
          />
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(240,240,245,0.45)' }}>
            Loading
          </span>
          {/* 三个呼吸的点 */}
          <span className="flex gap-[2px] ml-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-white/40"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </span>
        </motion.div>
      </div>
    </div>
  )
}