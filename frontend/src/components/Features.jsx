import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Course-Based Discussions',
    description: 'Join topic-based threads for each course. Ask questions, share notes, and stay in sync with your class.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    bg: 'bg-accent-500/15',
    iconColor: 'text-accent-500',
    border: 'hover:border-accent-400/40',
  },
  {
    title: 'AI Academic Assistant',
    description: 'Get instant help with concepts, practice problems, and study tips powered by AI tailored to your syllabus.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    bg: 'bg-violet-500/15',
    iconColor: 'text-violet-500',
    border: 'hover:border-violet-400/40',
  },
  {
    title: 'Study Group Collaboration',
    description: 'Create or join study groups, schedule sessions, and collaborate on assignments in one place.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    bg: 'bg-accent-500/15',
    iconColor: 'text-accent-500',
    border: 'hover:border-accent-400/40',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
}

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="features" ref={ref} className="px-6 py-24 md:py-32 lg:py-40 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-display text-3xl font-bold tracking-tight-display text-slate-900 sm:text-4xl lg:text-[2.75rem] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Built for how you learn
        </motion.h2>
        <motion.p
          className="mt-6 text-lg text-slate-600 text-center max-w-2xl mx-auto leading-[1.7]"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          Everything you need to collaborate and succeed in your courses.
        </motion.p>
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon, bg, iconColor, border }, i) => (
            <motion.div
              key={title}
              className={`group rounded-2xl border border-slate-100/80 bg-white p-8 sm:p-10 shadow-soft transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2 hover:border-accent-200/50 ${border}`}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={i}
              whileHover={{ y: -8 }}
            >
              <div className={`rounded-xl ${bg} p-4 w-fit ${iconColor} group-hover:shadow-glow-sm transition-all duration-300 group-hover:scale-105`}>
                {icon}
              </div>
              <h3 className="mt-7 font-display text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
              <p className="mt-4 text-slate-600 leading-[1.7]">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
