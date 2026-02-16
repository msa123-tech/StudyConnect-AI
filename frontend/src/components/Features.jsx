import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Connect With Classmates',
    description: 'Join course-based communities and instantly connect with students in your exact classes. No more hunting through random group chats.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    gradient: 'from-cyan-400 to-blue-500',
    glowColor: 'rgba(34, 211, 238, 0.15)',
  },
  {
    title: 'Form Study Groups',
    description: 'Create or join focused study groups within your courses. Schedule sessions, share resources, and prepare for exams together.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    gradient: 'from-violet-400 to-purple-500',
    glowColor: 'rgba(139, 92, 246, 0.15)',
  },
  {
    title: 'AI Academic Help',
    description: 'Get instant AI-powered assistance with concepts, practice problems, and study tips — tailored specifically to your course syllabus.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    gradient: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(251, 191, 36, 0.15)',
  },
  {
    title: 'Boost Performance',
    description: 'Track your progress, get personalized recommendations, and build better study habits with intelligent insights.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    gradient: 'from-emerald-400 to-teal-500',
    glowColor: 'rgba(52, 211, 153, 0.15)',
  },
]

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" ref={ref} className="relative py-32 md:py-40 section-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.span
            className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Core Features
          </motion.span>
          <motion.h2
            className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Built for how you{' '}
            <span className="text-gradient">learn</span>
          </motion.h2>
          <motion.p
            className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to collaborate, study, and succeed — in one intelligent platform.
          </motion.p>
        </div>

        {/* Feature cards grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ title, description, icon, gradient, glowColor }, i) => (
            <motion.div
              key={title}
              className="group relative glass-card rounded-3xl p-8 sm:p-10 glow-border transition-all duration-500 hover:bg-white/[0.04]"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -4 }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 60%)` }}
              />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
                  {icon}
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white tracking-tight">
                  {title}
                </h3>
                <p className="mt-3 text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
