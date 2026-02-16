import { useState } from 'react'
import { useSearchParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login as loginApi } from '../api/client'
import { setToken } from '../utils/auth'

/* ─── tiny sub-components (unchanged logic) ─── */

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

/* ─── animation variants ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
}

/* ─── main component ─── */

export default function Login() {
  const [searchParams] = useSearchParams()
  const collegeId = searchParams.get('college_id')
  const collegeName = searchParams.get('college')?.trim() || ''
  const domain = searchParams.get('domain')?.trim() || ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)

  const isEmailValid = domain ? email.toLowerCase().endsWith(`@${domain}`) : email.includes('@')

  if (!collegeId) {
    return <Navigate to="/" replace />
  }

  const domainHint = domain
    ? `Must end with @${domain}`
    : 'Use your college email address.'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(email.trim().toLowerCase(), password, parseInt(collegeId, 10))
      setToken(res.access_token)
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── back link (top-left) ── */}
      <motion.div
        className="absolute top-6 left-6 z-30"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </motion.div>

      {/* ── logo (top-center) ── */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="StudyConnect"
            className="h-9 w-auto object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          />
          <span className="font-display text-lg font-bold text-white tracking-tight group-hover:text-accent-400 transition-colors duration-200">
            StudyConnect
          </span>
        </Link>
      </motion.div>

      {/* ── main login card ── */}
      <motion.div
        className="relative z-20 w-full max-w-[440px] mx-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* card header text */}
        <motion.div className="text-center mb-8" variants={fadeUp} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-3 text-base text-slate-400">
            Sign in to continue to your courses
          </p>
        </motion.div>

        {/* form card */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass-card-light rounded-3xl p-8 sm:p-10 glow-border"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          {/* college badge */}
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-7">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-accent-400/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-medium">College</p>
              <p className="text-sm text-white font-semibold truncate">{collegeName}</p>
            </div>
          </div>

          {/* fields */}
          <div className="space-y-4">
            {/* email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">College Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'email' ? 'text-accent-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  required
                  autoComplete="email"
                  className={`w-full rounded-2xl border pl-11 pr-12 py-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-all duration-300 disabled:opacity-50 bg-white/[0.03] ${error
                    ? 'border-red-500/40 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]'
                    : focusedField === 'email'
                      ? 'border-accent-400/50 ring-2 ring-accent-400/15 shadow-[0_0_25px_-5px_rgba(34,211,238,0.15)]'
                      : 'border-white/[0.08] hover:border-white/[0.15]'
                    }`}
                />
                {email && isEmailValid && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <CheckIcon />
                  </motion.span>
                )}
              </div>
              <p className="mt-1.5 text-[11px] text-slate-600 ml-1">{domainHint}</p>
            </div>

            {/* password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'password' ? 'text-accent-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                  className={`w-full rounded-2xl border pl-11 pr-5 py-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-all duration-300 disabled:opacity-50 bg-white/[0.03] ${error
                    ? 'border-red-500/40 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]'
                    : focusedField === 'password'
                      ? 'border-accent-400/50 ring-2 ring-accent-400/15 shadow-[0_0_25px_-5px_rgba(34,211,238,0.15)]'
                      : 'border-white/[0.08] hover:border-white/[0.15]'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          {/* submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`relative w-full mt-7 rounded-2xl py-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden ${loading
              ? 'bg-indigo-500/70 text-white/80 cursor-wait'
              : 'bg-gradient-to-r from-indigo-500 to-accent-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:shadow-xl'
              }`}
            whileHover={!loading ? { y: -2, scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {/* shimmer effect */}
            {!loading && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer-line_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            )}
            {loading ? (
              <>
                <Spinner />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* trust footer */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-5"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          {[
            { icon: '🔒', text: 'Secure login' },
            { icon: '🎓', text: 'Verified .edu' },
            { icon: '⚡', text: 'AI-powered' },
          ].map(({ icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="text-xs">{icon}</span>
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
