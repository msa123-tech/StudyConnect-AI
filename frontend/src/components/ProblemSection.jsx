import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const scatteredTools = [
    { name: 'Discord', icon: '💬', x: '15%', y: '20%', rotate: -12, delay: 0, parallaxSpeed: 0.3 },
    { name: 'WhatsApp', icon: '📱', x: '75%', y: '15%', rotate: 8, delay: 0.1, parallaxSpeed: 0.5 },
    { name: 'Email', icon: '📧', x: '60%', y: '65%', rotate: -6, delay: 0.15, parallaxSpeed: 0.2 },
    { name: 'Google Docs', icon: '📄', x: '25%', y: '70%', rotate: 15, delay: 0.2, parallaxSpeed: 0.4 },
    { name: 'GroupMe', icon: '👥', x: '85%', y: '45%', rotate: -10, delay: 0.08, parallaxSpeed: 0.6 },
    { name: 'iMessage', icon: '💭', x: '10%', y: '50%', rotate: 5, delay: 0.25, parallaxSpeed: 0.35 },
    { name: 'Zoom', icon: '🎥', x: '50%', y: '25%', rotate: -8, delay: 0.12, parallaxSpeed: 0.45 },
    { name: 'Slack', icon: '🔔', x: '40%', y: '80%', rotate: 12, delay: 0.18, parallaxSpeed: 0.25 },
]

export default function ProblemSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-100px' })

    // Scroll-based parallax
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })

    return (
        <section ref={ref} className="relative min-h-screen flex items-center py-24 md:py-32 overflow-hidden section-dark-reverse">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand via-brand-surface to-brand pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-red-400/80">
                                The Problem
                            </span>
                            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                                Student collaboration is{' '}
                                <span className="text-slate-500 line-through decoration-red-400/50">broken</span>
                            </h2>
                            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg">
                                Students scatter across Discord servers, WhatsApp groups, random Google Docs,
                                and email chains. Nothing is organized. Nothing is linked to their courses.
                                Finding help feels like searching through chaos.
                            </p>
                        </motion.div>

                        <motion.div
                            className="mt-10 flex flex-wrap gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {['No structure', 'No AI help', 'No verification', 'Scattered tools'].map((pain) => (
                                <span
                                    key={pain}
                                    className="px-4 py-2 rounded-full text-sm font-medium text-red-300/80 border border-red-400/20 bg-red-400/5"
                                >
                                    {pain}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Scattered tools visual with parallax */}
                    <div className="relative h-[400px] lg:h-[500px]">
                        {scatteredTools.map(({ name, icon, x, y, rotate, delay, parallaxSpeed }) => {
                            const toolY = useTransform(scrollYProgress, [0, 1], [0, -50 * parallaxSpeed])

                            return (
                                <motion.div
                                    key={name}
                                    className="absolute glass-card rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-cinematic"
                                    style={{ left: x, top: y, y: toolY }}
                                    initial={{ opacity: 0, scale: 0, rotate: rotate * 2 }}
                                    animate={
                                        inView
                                            ? {
                                                opacity: [0, 1, 1, 0.6],
                                                scale: [0, 1.1, 1, 0.95],
                                                rotate: rotate,
                                                y: [0, -5, 0, 5, 0],
                                            }
                                            : {}
                                    }
                                    transition={{
                                        duration: 3,
                                        delay: delay + 0.3,
                                        y: { duration: 4 + delay * 5, repeat: Infinity, ease: 'easeInOut' },
                                    }}
                                >
                                    <span className="text-xl">{icon}</span>
                                    <span className="text-sm font-medium text-slate-300 whitespace-nowrap">{name}</span>
                                </motion.div>
                            )
                        })}

                        {/* Chaos lines connecting them */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <motion.line
                                x1="20%"
                                y1="25%"
                                x2="55%"
                                y2="30%"
                                stroke="rgba(239, 68, 68, 0.15)"
                                strokeWidth="1"
                                strokeDasharray="6 6"
                                initial={{ pathLength: 0 }}
                                animate={inView ? { pathLength: 1 } : {}}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                            <motion.line
                                x1="80%"
                                y1="20%"
                                x2="65%"
                                y2="70%"
                                stroke="rgba(239, 68, 68, 0.12)"
                                strokeWidth="1"
                                strokeDasharray="6 6"
                                initial={{ pathLength: 0 }}
                                animate={inView ? { pathLength: 1 } : {}}
                                transition={{ duration: 1.5, delay: 0.7 }}
                            />
                            <motion.line
                                x1="30%"
                                y1="75%"
                                x2="90%"
                                y2="50%"
                                stroke="rgba(239, 68, 68, 0.1)"
                                strokeWidth="1"
                                strokeDasharray="6 6"
                                initial={{ pathLength: 0 }}
                                animate={inView ? { pathLength: 1 } : {}}
                                transition={{ duration: 1.5, delay: 0.9 }}
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    )
}
