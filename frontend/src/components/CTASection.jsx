import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function CTASection({ onOpenSelectCollege }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    // Scroll-based parallax for dramatic entrance
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98])
    const glowIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.15, 0.08])

    return (
        <section
            ref={ref}
            className="relative py-32 md:py-40 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050a18 0%, #0c1635 50%, #050a18 100%)' }}
        >
            {/* Dramatic glow with scroll-based intensity */}
            <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ opacity: glowIntensity }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/50 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-400/40 blur-[80px]" />
            </motion.div>

            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-400/30 to-transparent" />

            <motion.div
                className="relative z-10 mx-auto max-w-3xl text-center px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ scale }}
            >
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                    Ready to transform
                    <br />
                    <span className="text-gradient">how you study?</span>
                </h2>

                <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                    Join thousands of students who are already using AI-powered collaboration
                    to succeed in their courses.
                </p>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                        type="button"
                        onClick={onOpenSelectCollege}
                        className="relative inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-accent-500 shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 overflow-hidden"
                        whileHover={{ y: -2, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        animate={inView ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer-line_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                        <span className="relative z-10">Enter Your College</span>
                        <svg className="relative z-10 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.button>
                </div>

                {/* Trust badges */}
                <motion.div
                    className="mt-12 flex flex-wrap items-center justify-center gap-6"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {[
                        { icon: '🔒', text: 'Verified .edu Access' },
                        { icon: '⚡', text: 'AI-Powered' },
                        { icon: '🎓', text: 'Built for Students' },
                    ].map(({ icon, text }) => (
                        <div key={text} className="flex items-center gap-2 text-sm text-slate-500">
                            <span>{icon}</span>
                            <span>{text}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    )
}
