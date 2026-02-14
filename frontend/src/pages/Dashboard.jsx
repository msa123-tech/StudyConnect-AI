import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchMe } from '../api/client'
import { getToken, isAuthenticated } from '../utils/auth'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) return
    const token = getToken()
    fetchMe(token)
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1e293b 100%)' }}>
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1e293b 100%)' }}>
        <p className="text-red-400">{error}</p>
        <Link to="/" className="mt-4 text-accent-400 hover:text-accent-300">← Back to home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1e293b 100%)' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-white/10 backdrop-blur-sm p-8 shadow-soft-lg"
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
        >
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Welcome to StudyConnect, <span className="text-white font-medium">{user?.email}</span>
          </p>
          <p className="mt-1 text-slate-500 text-sm">
            {user?.college_name}
          </p>
          <p className="mt-6 text-slate-400 text-sm">
            Phase 3 features (courses, chat, groups) coming next.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block text-accent-400 hover:text-accent-300 font-medium transition-colors"
          >
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
