import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchDashboard } from '../api/client'
import { getToken } from '../utils/auth'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = getToken()
    fetchDashboard(token)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Loading courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-slate-400">
        {data?.college_name} · {data?.user_email}
      </p>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Your Courses</h2>
        {!data?.courses?.length ? (
          <p className="text-slate-500">No courses enrolled yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group block rounded-xl border border-white/10 bg-brand-card/80 p-6 shadow-soft transition-all hover:border-accent-500/30 hover:shadow-glow-sm"
              >
                <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                  {course.name}
                </h3>
                {course.code && (
                  <p className="mt-1 text-sm text-slate-500">{course.code}</p>
                )}
                <p className="mt-3 text-sm text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View course →
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
