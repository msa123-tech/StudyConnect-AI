import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function LoginCallout() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.section
      ref={ref}
      className="relative px-6 py-20 bg-gradient-to-b from-white via-slate-50/80 to-slate-100/60 border-y border-slate-200/80 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-50/30 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="font-display text-slate-800 font-semibold text-lg">
          New here?
        </p>
        <p className="mt-2 text-slate-600 text-base leading-relaxed">
          Enter your college above to get started.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-50/80 text-accent-700 text-sm font-medium border border-accent-200/60">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Verified student access only
          </span>
        </div>
      </div>
    </motion.section>
  )
}
