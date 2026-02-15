import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function IntroSection({ onOpenSelectCollege }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-15%' })
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })
    const scale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050a18 0%, #0c1635 50%, #050a18 100%)' }}
        >
            {/* Glowing center orb */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(34, 211, 238, 0.08) 40%, transparent 70%)',
                    filter: 'blur(60px)',
                    scale,
                }}
            />

            <motion.div
                className="relative z-10 mx-auto max-w-4xl text-center px-6"
                style={{ scale, opacity }}
            >
                {/* Introduction badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-accent-300 glass-card border border-accent-400/20">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        The Solution
                    </span>
                </motion.div>

                {/* Main text */}
                <motion.h2
                    className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[0.95]"
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    Meet{' '}
                    <span className="text-gradient">StudyConnect</span>
                </motion.h2>

                <motion.p
                    className="mt-8 text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.25 }}
                >
                    One platform where students connect, collaborate, and get AI-powered
                    academic help — organized by your actual courses.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                    className="mt-12 flex flex-wrap items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {['Structured by courses', 'AI-powered help', 'Verified students only', 'Real-time collaboration'].map((item) => (
                        <span
                            key={item}
                            className="px-4 py-2 rounded-full text-sm font-medium text-accent-300 border border-accent-400/20 bg-accent-400/5"
                        >
                            {item}
                        </span>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="mt-14"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <motion.button
                        type="button"
                        onClick={onOpenSelectCollege}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-accent-500 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40"
                        whileHover={{ y: -2, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Get Started Now
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    )
}
