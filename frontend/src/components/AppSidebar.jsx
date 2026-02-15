import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function AppSidebar({ userEmail, collegeName }) {
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('studyconnect_token')
    navigate('/')
    window.location.reload()
  }

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: '📋' },
  ]

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col border-r border-white/10"
      style={{ backgroundColor: '#0c1222' }}
    >
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
        <Link
          to="/dashboard"
          className="text-lg font-semibold tracking-tight text-white hover:text-accent-400 transition-colors"
        >
          StudyConnect
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              location.pathname === to
                ? 'bg-accent-500/20 text-accent-400'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-slate-500 truncate">{collegeName}</p>
        <p className="text-sm text-slate-300 truncate font-medium">{userEmail}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
