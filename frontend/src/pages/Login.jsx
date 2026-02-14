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

export default function Login() {
  const [searchParams] = useSearchParams()
  const collegeId = searchParams.get('college_id')
  const collegeName = searchParams.get('college')?.trim() || ''
  const domain = searchParams.get('domain')?.trim() || ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1e293b 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-white/10 backdrop-blur-sm p-10 shadow-soft-lg"
        style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {displayTitle}
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Use your college email to continue.
        </p>
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">College</p>
            <p className="text-white font-medium mt-0.5">{collegeName}</p>
          </div>
          <div>
            <input
              type="email"
              placeholder="College email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 transition-all duration-200 disabled:opacity-60"
            />
            <p className="mt-1.5 text-xs text-slate-500">{domainHint}</p>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 transition-all duration-200 disabled:opacity-60"
          />
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3.5 font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:scale-[1.02] disabled:opacity-80 disabled:pointer-events-none disabled:hover:scale-100 flex items-center justify-center gap-2"
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
          <p className="text-center text-xs text-slate-500">
            Secure college-verified login
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
