import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="about"
      className="relative px-6 py-24 md:py-32 lg:py-40 bg-gradient-to-b from-slate-50 via-accent-50/20 to-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent-50/40 via-transparent to-violet-100/25 pointer-events-none" />
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.h2
          className="font-display text-3xl font-bold tracking-tight-display text-slate-900 sm:text-4xl lg:text-[2.75rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          One platform for your entire academic journey
        </motion.h2>
        <motion.p
          className="mt-8 text-lg sm:text-[1.125rem] text-slate-600 leading-[1.7]"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          StudyConnect brings together discussions, AI assistance, and study groups so you can focus on learning. Built for students, trusted by universities.
        </motion.p>
      </div>
    </section>
  )
}
