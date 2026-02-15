import { useState } from 'react'
import { useSearchParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login as loginApi } from '../api/client'
import { setToken } from '../utils/auth'

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-slate-900"
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

  const displayTitle = `Login to ${collegeName || 'College'} StudyConnect`
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1a2332 50%, #0f172a 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full bg-accent-500/12 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent-500/5 blur-[80px]" />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-white/10 backdrop-blur-xl p-10 shadow-card-hover"
        style={{ backgroundColor: 'rgba(17, 24, 39, 0.9)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-2xl font-bold tracking-tight-display text-white sm:text-[1.75rem]">
          {displayTitle}
        </h1>
        <p className="mt-3 text-slate-400 text-base leading-relaxed">
          Use your college email to continue.
        </p>
        <div className="mt-10 space-y-5">
          <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 shadow-inner-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">College</p>
            <p className="text-white font-semibold mt-1">{collegeName}</p>
          </div>
          <div>
            <div className="relative">
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
                className={`w-full rounded-xl border px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-60 pr-12 ${
                  error ? 'border-red-500/50 bg-red-500/5 focus:border-red-400 focus:ring-red-400/30' :
                  focusedField === 'email' ? 'border-accent-500/50 bg-white/8 focus:border-accent-500 focus:ring-accent-500/25' :
                  'border-white/10 bg-white/5 focus:border-accent-500 focus:ring-accent-500/25'
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
            <p className="mt-2 text-xs text-slate-500">{domainHint}</p>
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              disabled={loading}
              required
              autoComplete="current-password"
              className={`w-full rounded-xl border px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-60 ${
                error ? 'border-red-500/50 bg-red-500/5 focus:border-red-400 focus:ring-red-400/30' :
                'border-white/10 bg-white/5 focus:border-accent-500 focus:ring-accent-500/25'
              }`}
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-4 font-semibold text-slate-900 shadow-soft-lg transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80 disabled:pointer-events-none disabled:hover:scale-100 flex items-center justify-center gap-2"
            whileHover={!loading ? { y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <Spinner />
                <span>Signing in...</span>
              </>
            ) : (
              'Continue'
            )}
          </motion.button>
          <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Only verified college emails
          </p>
        </div>
        <p className="mt-8 text-center text-sm text-slate-400">
          <Link to="/" className="text-accent-400 hover:text-accent-300 font-medium transition-colors inline-flex items-center gap-1.5 hover:gap-2 duration-200">
            ← Back to home
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
