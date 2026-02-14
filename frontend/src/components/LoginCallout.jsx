import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function LoginCallout() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.section
      ref={ref}
      className="px-6 py-16 bg-slate-100 border-y border-slate-200"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-slate-700 font-medium">
          New here?
        </p>
        <p className="mt-1 text-slate-600 text-sm">
          Enter your college above to get started.
        </p>
      </div>
    </motion.section>
  )
}
