import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Main content */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl text-center px-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
        style={{ y, opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase glass-card text-accent-300 border border-accent-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            Powered by PatriotAI
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-white"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="block">The Future of</span>
          <span className="block text-gradient mt-2">Academic Collaboration</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          AI-powered study groups, course communities, and intelligent academic
          assistance — built for university students.
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { value: 'AI-Powered', label: 'Study Assistance' },
            { value: 'Course-Based', label: 'Communities' },
            { value: 'University', label: 'Verified Access' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-sm font-bold text-accent-400 tracking-wider uppercase">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">Scroll to explore</span>
        <motion.div
          className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center p-1"
          initial={{ opacity: 0.5 }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-slate-400"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
