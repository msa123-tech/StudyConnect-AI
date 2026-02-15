import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const aiFeatures = [
    {
        title: 'Course AI Assistant',
        description: 'A dedicated AI tutor for every course that understands your syllabus and learning objectives.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
        ),
        gradient: 'from-indigo-400 to-violet-400',
    },
    {
        title: 'Study Group AI',
        description: 'AI that joins your study sessions to answer questions, quiz the group, and summarize discussions.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
        ),
        gradient: 'from-cyan-400 to-accent-400',
    },
    {
        title: 'Assignment Feedback',
        description: 'Submit your work and get detailed AI-powered improvement suggestions before the final deadline.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
        ),
        gradient: 'from-emerald-400 to-teal-400',
    },
    {
        title: 'AI Office Hours',
        description: '24/7 access to AI-powered academic support. Ask doubts at any time, even at midnight before an exam.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        gradient: 'from-pink-400 to-rose-400',
    },
    {
        title: 'Voice AI Clarification',
        description: 'Speak your doubts aloud and get instant AI explanations — like having a tutor in your pocket.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
        ),
        gradient: 'from-amber-400 to-yellow-400',
    },
    {
        title: 'Personalized Guidance',
        description: 'AI learns your strengths, weaknesses, and learning style to provide tailored study recommendations.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
        ),
        gradient: 'from-violet-400 to-purple-400',
    },
]

export default function FutureVision() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section
            id="vision"
            ref={ref}
            className="relative py-32 md:py-40 overflow-hidden noise-overlay"
            style={{ background: 'linear-gradient(180deg, #050a18 0%, #0d0a20 50%, #050a18 100%)' }}
        >
            {/* Dramatic background orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="orb w-[500px] h-[500px] top-20 -right-32 bg-violet-500/15"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="orb w-[400px] h-[400px] bottom-20 -left-32 bg-indigo-500/10"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-20">
                    <motion.span
                        className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        The Vision
                    </motion.span>
                    <motion.h2
                        className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        The Future of{' '}
                        <span className="text-gradient-warm">Academic AI</span>
                    </motion.h2>
                    <motion.p
                        className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        StudyConnect evolves into an AI academic infrastructure — an intelligent assistant for every student at every university.
                    </motion.p>
                </div>

                {/* AI features grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {aiFeatures.map(({ title, description, icon, gradient }, i) => (
                        <motion.div
                            key={title}
                            className="group glass-card rounded-2xl p-7 glow-border transition-all duration-500 hover:bg-white/[0.04]"
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                            whileHover={{ y: -3 }}
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
                                {icon}
                            </div>
                            <h3 className="mt-5 font-display text-lg font-semibold text-white tracking-tight">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                                {description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
