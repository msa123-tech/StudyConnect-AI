import { Outlet } from 'react-router-dom'
import AuthenticatedLayout from './AuthenticatedLayout'
import { useAuth } from '../contexts/AuthContext'

export default function AuthenticatedShell() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1a2332 100%)' }}
      >
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  return (
    <AuthenticatedLayout
      userEmail={user?.email ?? ''}
      collegeName={user?.collegeName ?? ''}
    />
  )
}
