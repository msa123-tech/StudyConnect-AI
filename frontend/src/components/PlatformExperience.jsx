import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
    {
        number: '01',
        title: 'Join Your Courses',
        description: 'Select your university and enroll in your exact course sections. Instantly access course-specific communities.',
        gradient: 'from-indigo-500 to-violet-500',
        mockup: {
            title: 'My Courses',
            items: ['CS 483 — Analysis of Algorithms', 'MATH 214 — Linear Algebra', 'PHYS 260 — University Physics'],
        },
    },
    {
        number: '02',
        title: 'Collaborate in Groups',
        description: 'Create study groups, join discussions, share notes, and work together on assignments in real-time.',
        gradient: 'from-accent-400 to-cyan-500',
        mockup: {
            title: 'Study Group: Midterm Prep',
            items: ['Shared Notes — Chapter 5', 'Practice Problems Set', 'Study Session — Tuesday 7pm'],
        },
    },
    {
        number: '03',
        title: 'Get AI Assistance',
        description: 'Ask your AI study assistant anything about your coursework. Get explanations, practice problems, and feedback.',
        gradient: 'from-amber-400 to-orange-500',
        mockup: {
            title: 'AI Assistant',
            items: ['Explain Big-O notation...', 'Generate practice problems for...', 'Review my solution for...'],
        },
    },
]

export default function PlatformExperience() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section
            id="platform"
            ref={ref}
            className="relative py-32 md:py-40 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050a18 0%, #0a1230 50%, #050a18 100%)' }}
        >
            {/* Background decorations */}
            <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-24">
                    <motion.span
                        className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        How It Works
                    </motion.span>
                    <motion.h2
                        className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Experience the{' '}
                        <span className="text-gradient">platform</span>
                    </motion.h2>
                    <motion.p
                        className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Three simple steps to transform how you study and collaborate.
                    </motion.p>
                </div>

                {/* Steps with timeline */}
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-accent-400/40 to-amber-400/40 hidden sm:block" />

                    <div className="space-y-20 lg:space-y-32">
                        {steps.map(({ number, title, description, gradient, mockup }, i) => {
                            const isEven = i % 2 === 0
                            return (
                                <StepItem
                                    key={number}
                                    number={number}
                                    title={title}
                                    description={description}
                                    gradient={gradient}
                                    mockup={mockup}
                                    index={i}
                                    isEven={isEven}
                                    inView={inView}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

function StepItem({ number, title, description, gradient, mockup, index, isEven, inView }) {
    const ref = useRef(null)
    const itemInView = useInView(ref, { once: true, margin: '-60px' })
    const show = inView || itemInView

    return (
        <motion.div
            ref={ref}
            className={`relative flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${isEven ? '' : 'lg:flex-row-reverse'}`}
            initial={{ opacity: 0, y: 40 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Step number dot on timeline */}
            <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 hidden sm:block">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${gradient} shadow-lg ring-4 ring-brand`} />
            </div>

            {/* Text content */}
            <div className={`flex-1 ${isEven ? 'lg:text-right lg:pr-20' : 'lg:pl-20'}`}>
                <span className={`inline-block text-6xl font-extrabold bg-gradient-to-br ${gradient} bg-clip-text text-transparent opacity-30`}>
                    {number}
                </span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {title}
                </h3>
                <p className="mt-4 text-slate-400 leading-relaxed max-w-md">
                    {description}
                </p>
            </div>

            {/* Mockup card */}
            <div className="flex-1 w-full max-w-md">
                <motion.div
                    className="glass-card-light rounded-2xl p-6 glow-border"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                        </div>
                        <span className="text-xs text-slate-500 ml-2 font-medium">{mockup.title}</span>
                    </div>
                    <div className="space-y-3">
                        {mockup.items.map((item, j) => (
                            <motion.div
                                key={item}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                                initial={{ opacity: 0, x: -10 }}
                                animate={show ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.4 + index * 0.15 + j * 0.1, duration: 0.4 }}
                            >
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradient} flex-shrink-0`} />
                                <span className="text-sm text-slate-300">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
