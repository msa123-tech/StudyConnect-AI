import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About', targetId: 'about' },
  { label: 'Features', targetId: 'features' },
]

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar({ onOpenSelectCollege }) {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 shadow-lg" style={{ backgroundColor: 'rgba(12, 18, 34, 0.97)' }}>
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-white hover:text-accent-400 transition-colors duration-200"
        >
          StudyConnect
        </Link>
        <div className="flex items-center gap-8">
          {navLinks.map(({ label, targetId }) => (
            location.pathname === '/' ? (
              <button
                key={label}
                type="button"
                onClick={() => scrollToSection(targetId)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
              >
                {label}
              </button>
            ) : (
              <Link
                key={label}
                to="/"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            )
          ))}
          <button
            type="button"
            onClick={onOpenSelectCollege}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
          >
            Select College
          </button>
          <button
            type="button"
            onClick={onOpenSelectCollege}
            className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02]"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}
